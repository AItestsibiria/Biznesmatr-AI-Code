import { useState } from 'react'
import { useRouter } from 'next/router'

interface Props {
  initialQuery?: string
  onSearch?: (q: string) => void
}

const CATEGORIES = [
  { id: '',          label: 'Все' },
  { id: 'office',    label: 'Офисы' },
  { id: 'retail',    label: 'Торговля' },
  { id: 'warehouse', label: 'Склады' },
  { id: 'land',      label: 'Земля' },
]

export default function SearchBar({ initialQuery = '', onSearch }: Props) {
  const router   = useRouter()
  const [q, setQ]     = useState(initialQuery)
  const [cat, setCat] = useState('')

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (cat)      params.set('category', cat)
    if (onSearch) onSearch(q.trim())
    else router.push(`/listings?${params}`)
  }

  return (
    <form onSubmit={handle} className="flex flex-col md:flex-row gap-3 w-full">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Поиск объектов..."
        className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#fff' }}
      />
      <select
        value={cat}
        onChange={e => setCat(e.target.value)}
        className="px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: '#161616', border: '1px solid #2A2A2A', color: '#888' }}
      >
        {CATEGORIES.map(c => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      <button type="submit"
              className="px-6 py-3 rounded-xl font-medium text-sm transition hover:opacity-90"
              style={{ background: '#D4A853', color: '#000' }}>
        Найти
      </button>
    </form>
  )
}
