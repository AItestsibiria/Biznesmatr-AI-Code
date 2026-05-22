# Backend — Supabase

## Структура

```
supabase/
  migrations/
    001_initial_schema.sql   — Основная схема БД
  functions/
    analyze-listing/         — Edge Function: AI-анализ объекта
    generate-report/         — Edge Function: Генерация отчёта
    scraper-webhook/         — Edge Function: Приём данных от парсера
```

## Деплой миграций

```bash
supabase db push
```

## Edge Functions

```bash
supabase functions deploy analyze-listing
supabase functions deploy generate-report
```
