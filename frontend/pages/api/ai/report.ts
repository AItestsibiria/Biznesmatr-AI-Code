import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { supabase } from '../../../lib/supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { segment = 'office', city = 'Москва', owner_id } = req.body

  // Получаем рыночные данные из Supabase
  const { data: listings } = await supabase
    .from('listings')
    .select('price, price_per_m2, area, address')
    .eq('category', segment)
    .eq('city', city)
    .eq('is_active', true)
    .limit(50)

  const stats = listings?.length ? {
    count:            listings.length,
    avg_price_per_m2: Math.round(listings.reduce((s, l) => s + (l.price_per_m2 ?? 0), 0) / listings.length),
    avg_area:         Math.round(listings.reduce((s, l) => s + (l.area ?? 0), 0) / listings.length),
  } : { count: 0, avg_price_per_m2: 0, avg_area: 0 }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Составь аналитический отчёт по сегменту '${segment}' коммерческой недвижимости ${city}.
Данные: ${JSON.stringify(stats)}
Формат: профессиональный, 400-600 слов, структурированный.`,
      }],
      max_tokens: 1500,
    })

    const result = response.choices[0].message.content ?? ''

    // Логируем в Supabase
    if (owner_id) {
      await supabase.from('ai_reports').insert({
        owner_id,
        type:        'market',
        payload:     { segment, city, stats },
        result,
        tokens_used: response.usage?.total_tokens,
      })
    }

    res.json({ report: result, stats })
  } catch (err) {
    res.status(500).json({ error: 'Ошибка генерации отчёта' })
  }
}
