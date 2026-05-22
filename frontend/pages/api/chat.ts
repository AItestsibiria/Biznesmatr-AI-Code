import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Ты — Biz AI, умный ассистент платформы Бизнесметр.рф по коммерческой недвижимости России.

Твои задачи:
- Помогать агентам, инвесторам и девелоперам находить и анализировать объекты
- Объяснять цены, локации, тренды рынка коммерческой недвижимости (офисы, торговля, склады, земля)
- Помогать с оценкой объектов и составлением отчётов
- Отвечать на вопросы по работе платформы Бизнесметр

Стиль: профессиональный, конкретный, на русском языке. Используй данные и цифры где возможно.
Если не знаешь точного ответа — честно скажи и предложи альтернативу.
Не придумывай конкретные адреса или цены объектов.`

export const config = { api: { bodyParser: true } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages, stream = true } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages обязательны' })
  }

  try {
    if (stream) {
      // Streaming режим
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      const response = await client.messages.stream({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system:     SYSTEM_PROMPT,
        messages,
      })

      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}

`)
        }
      }
      res.write('data: [DONE]

')
      res.end()
    } else {
      // Обычный режим
      const response = await client.messages.create({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system:     SYSTEM_PROMPT,
        messages,
      })
      res.json({ text: response.content[0].type === 'text' ? response.content[0].text : '' })
    }
  } catch (err: any) {
    console.error('Chat API error:', err)
    res.status(500).json({ error: err.message ?? 'Ошибка чата' })
  }
}
