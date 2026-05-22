# Frontend — Next.js

Развёртывание: Vercel Hobby (бесплатно)

## Структура

```
pages/
  index.tsx          — Главная / лендинг
  listings/
    index.tsx        — Каталог объектов
    [id].tsx         — Карточка объекта
  crm/
    index.tsx        — CRM Dashboard
  analytics/
    index.tsx        — Аналитика рынка
  api/
    search.ts        — Typesense proxy
    ai/
      analyze.ts     — AI-анализ объекта
      report.ts      — Генерация отчёта

components/
  ListingCard.tsx
  SearchBar.tsx
  MarketChart.tsx
  CRMLeadCard.tsx
  AIInsightPanel.tsx
```
