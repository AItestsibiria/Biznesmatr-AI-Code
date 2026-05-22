import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SearchBar from '../../components/SearchBar'
import ListingCard from '../../components/ListingCard'
import type { Listing } from '../../lib/supabase'

export default function ListingsPage() {
  const router = useRouter()
  const { q = '', category = '' } = router.query as Record<string, string>

  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)
  const [total,    setTotal]    = useState(0)

  useEffect(() => {
    if (!router.isReady) return
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(q)}&category=${category}`)
      .then(r => r.json())
      .then(d => { setListings(d.hits ?? []); setTotal(d.total ?? 0) })
      .finally(() => setLoading(false))
  }, [q, category, router.isReady])

  return (
    <>
      <Head>
        <title>Каталог объектов — Бизнесметр AI</title>
      </Head>

      <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
        {/* Header */}
        <div className="px-6 py-8 border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Каталог объектов</h1>
            <SearchBar initialQuery={q} />
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-[#888]">
              {loading ? 'Поиск...' : `Найдено: ${total} объектов`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl animate-pulse"
                     style={{ background: '#161616' }} />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-24 text-[#888]">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg">Ничего не найдено</p>
              <p className="text-sm mt-2">Попробуйте изменить запрос</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
