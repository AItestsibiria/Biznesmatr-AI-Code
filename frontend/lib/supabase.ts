import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Listing = {
  id: string
  source: string
  title: string
  description?: string
  price?: number
  price_per_m2?: number
  area?: number
  category: string
  city: string
  address?: string
  lat?: number
  lon?: number
  photos?: string[]
  ai_score?: number
  ai_summary?: string
  is_active: boolean
  created_at: string
}

export type CrmLead = {
  id: string
  owner_id: string
  listing_id?: string
  name: string
  phone?: string
  email?: string
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won'
  notes?: string
  ai_score?: number
  created_at: string
}
