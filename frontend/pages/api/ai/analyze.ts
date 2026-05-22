import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const listing = req.body

  try {
    const prompt = `Проанализируй объявление о коммерческой недвижимости:

Название: ${listing.title}
Цена: ${listing.price ? listing.price.toLocaleString('ru-RU') + ' ₽' : 'не указана'}
Площадь: ${listing.area ? listing.area + ' м²' : 'не указана'}
Цена за м²: ${listing.price_per_m2 ? listing.price_per_m2.toLocaleString('ru-RU') + ' ₽/м²' : 'не указана'}
Адрес: ${listing.address ?? 'не указан'}
Источник: ${listing.source}

Верни JSON:
{
  "score": <0-100>,
  "summary": "<краткое описание 1-2 предложения>",
  "price_assessment": "<ниже рынка|рыночная|выше рынка>",
  "flags": ["<подозрительные признаки>"],
  "recommendation": "<действие для агента>"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    })

    const result = JSON.parse(response.choices[0].message.content ?? '{}')

    // Сохраняем AI score в Supabase
    if (listing.id) {
      const { supabase } = await import('../../../lib/supabase')
      await supabase.from('listings').update({
        ai_score:   result.score,
        ai_summary: result.summary,
      }).eq('id', listing.id)
    }

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'AI анализ недоступен' })
  }
}
