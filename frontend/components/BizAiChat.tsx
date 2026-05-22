import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  'Какая средняя цена офисов в Москва-Сити?',
  'Сравни аренду склада в Подмосковье vs Москве',
  'Как оценить торговое помещение у метро?',
  'Тренды рынка коммерческой недвижимости 2025',
]

export default function BizAiChat() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [streaming, setStream]  = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const history = [...messages, userMsg]
    setMessages(history)
    setInput('')
    setLoading(true)
    setStream('')

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          stream: true,
        }),
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let full     = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const lines = dec.decode(value).split('
')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6)
          if (raw === '[DONE]') break
          try {
            const { text } = JSON.parse(raw)
            full += text
            setStream(full)
          } catch {}
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }])
      setStream('')
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Ошибка соединения. Попробуйте снова.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition hover:scale-105"
        style={{ background: '#D4A853' }}
        aria-label="Открыть Biz AI"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {messages.length === 0 && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[#0D0D0D]" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: '#161616', border: '1px solid #2A2A2A', height: '560px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2A2A]"
               style={{ background: '#0D0D0D' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-black"
                 style={{ background: '#D4A853' }}>AI</div>
            <div>
              <p className="text-sm font-semibold">Biz AI</p>
              <p className="text-xs text-[#888]">Ассистент по недвижимости</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-[#888]">онлайн</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[#888] text-center pt-4">
                  Привет! Я Biz AI — ваш ассистент по коммерческой недвижимости.
                </p>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => send(s)}
                            className="text-left text-xs px-3 py-2.5 rounded-lg transition hover:border-[#D4A853]"
                            style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', color: '#888' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-black mr-2 mt-0.5 shrink-0"
                       style={{ background: '#D4A853' }}>B</div>
                )}
                <div
                  className="max-w-[80%] text-sm px-3 py-2.5 rounded-xl leading-relaxed whitespace-pre-wrap"
                  style={m.role === 'user'
                    ? { background: '#D4A853', color: '#000' }
                    : { background: '#0D0D0D', color: '#fff', border: '1px solid #2A2A2A' }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Streaming */}
            {streaming && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-black mr-2 mt-0.5 shrink-0"
                     style={{ background: '#D4A853' }}>B</div>
                <div className="max-w-[80%] text-sm px-3 py-2.5 rounded-xl leading-relaxed whitespace-pre-wrap"
                     style={{ background: '#0D0D0D', color: '#fff', border: '1px solid #2A2A2A' }}>
                  {streaming}
                  <span className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse rounded-sm"
                        style={{ background: '#D4A853' }} />
                </div>
              </div>
            )}

            {loading && !streaming && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-black mr-2 shrink-0"
                     style={{ background: '#D4A853' }}>B</div>
                <div className="px-4 py-3 rounded-xl" style={{ background: '#0D0D0D', border: '1px solid #2A2A2A' }}>
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                           style={{ background: '#D4A853', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#2A2A2A]">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Спросите о недвижимости..."
                disabled={loading}
                className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
                style={{ background: '#0D0D0D', border: '1px solid #2A2A2A', color: '#fff' }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:opacity-90 disabled:opacity-30"
                style={{ background: '#D4A853' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-[#888] text-center mt-2">Biz AI · Бизнесметр.рф</p>
          </div>
        </div>
      )}
    </>
  )
}
