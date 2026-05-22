import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase, type Listing } from '../../lib/supabase'

export default function ListingPage() {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [listing,  setListing]  = useState<Listing | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [aiLoad,   setAiLoad]   = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('listings').select('*').eq('id', id).single()
      .then(({ data }) => { setListing(data); setLoading(false) })
  }, [id])

  const runAI = async () => {
    if (!listing) return
    setAiLoad(true)
    const r = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
    })
    setAnalysis(await r.json())
    setAiLoad(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
      <div className="text-[#888]">Загрузка...</div>
    </div>
  )

  if (!listing) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
      <div className="text-[#888]">Объект не найден</div>
    </div>
  )

  return (
    <>
      <Head><title>{listing.title} — Бизнесметр AI</title></Head>

      <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Back */}
          <button onClick={() => router.back()}
                  className="text-sm text-[#888] hover:text-white mb-8 flex items-center gap-2">
            ← Назад
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
              {listing.address && <p className="text-[#888] mb-6">📍 {listing.address}</p>}

              {/* Photo */}
              <div className="rounded-xl overflow-hidden mb-6 h-72"
                   style={{ background: '#161616' }}>
                {listing.photos?.[0] ? (
                  <img src={listing.photos[0]} alt={listing.title}
                       className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-[#2A2A2A]">🏢</div>
                )}
              </div>

              {listing.description && (
                <p className="text-sm text-[#888] leading-relaxed mb-6">{listing.description}</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Price */}
              <div className="rounded-xl p-5" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#D4A853' }}>
                  {listing.price?.toLocaleString('ru-RU')} ₽
                </div>
                {listing.area && (
                  <div className="text-sm text-[#888]">
                    {listing.area} м² · {listing.price_per_m2?.toLocaleString('ru-RU')} ₽/м²
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="rounded-xl p-5" style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                <h3 className="font-semibold mb-3">AI-анализ</h3>
                {analysis ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#888]">Оценка</span>
                      <span className="font-bold" style={{ color: '#D4A853' }}>{analysis.score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#888]">Цена</span>
                      <span>{analysis.price_assessment}</span>
                    </div>
                    {analysis.summary && (
                      <p className="text-xs text-[#888] pt-2 border-t border-[#2A2A2A]">{analysis.summary}</p>
                    )}
                    {analysis.recommendation && (
                      <p className="text-xs text-green-400 pt-1">{analysis.recommendation}</p>
                    )}
                  </div>
                ) : (
                  <button onClick={runAI} disabled={aiLoad}
                          className="w-full py-2.5 rounded-lg text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                          style={{ background: '#D4A853', color: '#000' }}>
                    {aiLoad ? 'Анализирую...' : 'Запустить AI-анализ'}
                  </button>
                )}
              </div>

              {/* Add lead */}
              <button className="w-full py-3 rounded-xl text-sm font-medium transition hover:opacity-80"
                      style={{ border: '1px solid #D4A853', color: '#D4A853' }}>
                + Добавить в CRM
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
