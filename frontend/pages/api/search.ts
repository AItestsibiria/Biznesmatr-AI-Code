import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q = '', category = '', city = 'Москва', page = '1' } = req.query as Record<string, string>

  try {
    // Попытка поиска через Typesense (быстрый полнотекстовый поиск)
    if (process.env.TYPESENSE_API_KEY) {
      const { typesense } = await import('../../lib/typesense')
      const params: any = {
        q:          q || '*',
        query_by:   'title,description,address',
        per_page:   24,
        page:       parseInt(page),
      }
      if (category) params.filter_by = `category:=${category}`
      const result = await typesense.collections('listings').documents().search(params)
      return res.json({
        hits:  result.hits?.map((h: any) => h.document) ?? [],
        total: result.found ?? 0,
      })
    }

    // Fallback: Supabase full-text search
    let query = supabase.from('listings').select('*', { count: 'exact' }).eq('is_active', true)
    if (q)        query = query.textSearch('title', q, { config: 'russian' })
    if (category) query = query.eq('category', category)
    if (city)     query = query.eq('city', city)

    const { data, count } = await query.range(0, 23).order('ai_score', { ascending: false, nullsFirst: false })
    res.json({ hits: data ?? [], total: count ?? 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка поиска', hits: [], total: 0 })
  }
}
