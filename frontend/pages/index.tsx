import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/listings?q=${encodeURIComponent(query)}`)
  }

  const stats = [
    { value: '2 847', label: 'Объектов в базе' },
    { value: '6',     label: 'AI-модулей' },
    { value: '~$100', label: 'Стартовый бюджет/мес' },
    { value: '50K+',  label: 'Объектов в индексе' },
  ]

  const categories = [
    { id: 'office',    label: 'Офисы',    icon: '🏢' },
    { id: 'retail',    label: 'Торговля', icon: '🏪' },
    { id: 'warehouse', label: 'Склады',   icon: '🏭' },
    { id: 'land',      label: 'Земля',    icon: '🌍' },
  ]

  return (
    <>
      <Head>
        <title>Бизнесметр AI — Коммерческая недвижимость</title>
        <meta name="description" content="AI-платформа для агентств, инвесторов и девелоперов" />
      </Head>

      <main className="min-h-screen" style={{ background: '#0D0D0D' }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-5 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-black text-sm"
                 style={{ background: '#D4A853' }}>Б</div>
            <span className="font-semibold text-lg">Бизнесметр</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <Link href="/listings" className="hover:text-white transition">Каталог</Link>
            <Link href="/analytics" className="hover:text-white transition">Аналитика</Link>
            <Link href="/crm" className="hover:text-white transition">CRM</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
                  className="text-sm text-[#888] hover:text-white transition px-4 py-2">
              Войти
            </Link>
            <Link href="/auth/register"
                  className="text-sm px-4 py-2 rounded-lg font-medium transition"
                  style={{ background: '#D4A853', color: '#000' }}>
              Демо AI
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="px-8 pt-24 pb-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-[#2A2A2A] text-[#888] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Тестовая среда · Бизнесметр.рф
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Коммерческая<br />
            недвижимость.<br />
            <span style={{ color: '#D4A853' }}>Данные говорят.</span>
          </h1>
          <p className="text-lg text-[#888] mb-12 max-w-2xl mx-auto">
            AI-платформа для агентств, инвесторов и девелоперов.
            Анализ рынка, CRM, парсинг конкурентов — в одном месте.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto mb-16">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Торговые помещения у метро с трафик..."
              className="flex-1 px-5 py-4 rounded-xl text-sm outline-none"
              style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#fff' }}
            />
            <button type="submit"
                    className="px-6 py-4 rounded-xl font-medium text-sm transition hover:opacity-90"
                    style={{ background: '#D4A853', color: '#000' }}>
              Найти
            </button>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl p-5 text-left"
                   style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#D4A853' }}>{s.value}</div>
                <div className="text-xs text-[#888]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(c => (
              <Link key={c.id} href={`/listings?category=${c.id}`}
                    className="flex items-center gap-3 p-4 rounded-xl transition hover:border-[#D4A853]"
                    style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                <span className="text-2xl">{c.icon}</span>
                <span className="font-medium text-sm">{c.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
