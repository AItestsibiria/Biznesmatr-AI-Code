import Link from 'next/link'
import type { Listing } from '../lib/supabase'

interface Props { listing: Listing }

const CATEGORY_LABELS: Record<string, string> = {
  office:    'Офис',
  retail:    'Торговля',
  warehouse: 'Склад',
  land:      'Земля',
  commercial:'Коммерция',
}

const SOURCE_COLORS: Record<string, string> = {
  cian:   '#E53935',
  avito:  '#00AAFF',
  yandex: '#FFCC00',
  manual: '#D4A853',
}

export default function ListingCard({ listing }: Props) {
  const fmt = (n?: number) =>
    n ? n.toLocaleString('ru-RU') + ' ₽' : '—'

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="rounded-xl overflow-hidden transition hover:border-[#D4A853] cursor-pointer"
           style={{ background: '#161616', border: '1px solid #2A2A2A' }}>

        {/* Photo */}
        <div className="relative h-44 overflow-hidden"
             style={{ background: '#0D0D0D' }}>
          {listing.photos?.[0] ? (
            <img src={listing.photos[0]} alt={listing.title}
                 className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-[#2A2A2A]">
              🏢
            </div>
          )}
          {/* Source badge */}
          <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded font-medium text-white"
               style={{ background: SOURCE_COLORS[listing.source] ?? '#333' }}>
            {listing.source}
          </div>
          {/* AI score */}
          {listing.ai_score != null && (
            <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded font-bold"
                 style={{ background: '#D4A853', color: '#000' }}>
              AI {listing.ai_score}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2">{listing.title}</h3>
            <span className="text-xs px-2 py-1 rounded shrink-0"
                  style={{ background: '#2A2A2A', color: '#888' }}>
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </span>
          </div>

          {listing.address && (
            <p className="text-xs text-[#888] mb-3 line-clamp-1">📍 {listing.address}</p>
          )}

          <div className="flex items-end justify-between">
            <div>
              <div className="font-bold text-base" style={{ color: '#D4A853' }}>
                {fmt(listing.price)}
              </div>
              {listing.area && (
                <div className="text-xs text-[#888]">
                  {listing.area} м² · {fmt(listing.price_per_m2)}/м²
                </div>
              )}
            </div>
          </div>

          {listing.ai_summary && (
            <p className="text-xs text-[#888] mt-3 pt-3 border-t border-[#2A2A2A] line-clamp-2">
              {listing.ai_summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
