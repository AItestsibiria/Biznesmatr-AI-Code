# Архитектура Бизнесметр AI

## Обзор

Монорепозиторий с 5 изолированными модулями, связанными через Supabase.

## Потоки данных

```
Парсер → MongoDB (raw) → Pipeline → Supabase (normalized)
                                  → Typesense (search index)
                                  → R2 (media files)

Пользователь → Next.js → Supabase API → AI-модули → OpenAI
                       → CRM → Supabase DB
```

## Masштабирование

- Тир 1 ($100/мес): Vercel Hobby, Supabase Free, 1 scraper worker
- Тир 2 ($500/мес): Vercel Pro, Supabase Pro, 3 scraper workers
- Тир 3 ($1K/мес): + Dedicated Typesense, Redis кэш
- Тир 4 ($2K+/мес): + Claude API Enterprise, ML lead scoring
