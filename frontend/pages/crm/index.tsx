import { useEffect, useState } from 'react'
import Head from 'next/head'
import { supabase, type CrmLead } from '../../lib/supabase'

const STATUS_CONFIG = {
  new:       { label: 'Новый',       color: '#888' },
  contacted: { label: 'Контакт',     color: '#3B82F6' },
  qualified: { label: 'Квалификация',color: '#D4A853' },
  lost:      { label: 'Потерян',     color: '#EF4444' },
  won:       { label: 'Сделка ✓',   color: '#22C55E' },
}

export default function CRMPage() {
  const [leads, setLeads] = useState<CrmLead[]>([])

  useEffect(() => {
    supabase.from('crm_leads').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setLeads(data ?? []))
  }, [])

  const columns = Object.entries(STATUS_CONFIG).map(([status, cfg]) => ({
    status,
    ...cfg,
    leads: leads.filter(l => l.status === status),
  }))

  return (
    <>
      <Head><title>CRM — Бизнесметр AI</title></Head>

      <div className="min-h-screen" style={{ background: '#0D0D0D' }}>
        <div className="px-6 py-8 border-b border-[#2A2A2A] flex items-center justify-between">
          <h1 className="text-2xl font-bold">CRM · Воронка</h1>
          <button className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: '#D4A853', color: '#000' }}>
            + Новый лид
          </button>
        </div>

        {/* Kanban */}
        <div className="flex gap-4 p-6 overflow-x-auto scrollbar-hide">
          {columns.map(col => (
            <div key={col.status} className="shrink-0 w-72">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-medium">{col.label}</span>
                <span className="text-xs text-[#888] ml-auto">{col.leads.length}</span>
              </div>
              <div className="space-y-3">
                {col.leads.map(lead => (
                  <div key={lead.id} className="p-4 rounded-xl cursor-pointer hover:border-[#D4A853] transition"
                       style={{ background: '#161616', border: '1px solid #2A2A2A' }}>
                    <p className="font-medium text-sm mb-1">{lead.name}</p>
                    {lead.phone && <p className="text-xs text-[#888]">{lead.phone}</p>}
                    {lead.ai_score != null && (
                      <div className="mt-2 text-xs" style={{ color: '#D4A853' }}>
                        AI score: {lead.ai_score}
                      </div>
                    )}
                  </div>
                ))}
                {col.leads.length === 0 && (
                  <div className="h-16 rounded-xl border-2 border-dashed border-[#2A2A2A] flex items-center justify-center text-xs text-[#888]">
                    Пусто
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
