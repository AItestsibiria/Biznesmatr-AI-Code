# Бизнесметр AI — Коммерческая недвижимость нового поколения

> AI-платформа для агентств, инвесторов и девелоперов.  
> Анализ рынка · CRM · Парсинг конкурентов — на русском языке.

![Version](https://img.shields.io/badge/version-0.1--DEV-yellow)
![Budget](https://img.shields.io/badge/бюджет-~$100%2Fмес-blue)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Supabase%20%7C%20OpenAI-black)

---

## 🏗 Архитектура

| Слой | Технология | Тариф |
|------|-----------|-------|
| Хостинг | Vercel Hobby | Free |
| База данных | Supabase Free | Free |
| Поиск | Typesense Cloud | ~$10/мес |
| Хранилище | Cloudflare R2 | Free tier |
| AI | OpenAI GPT-4o | ~$35/мес |
| Email | Resend | Free tier |
| SMS | SMS.ru | ~$15/мес |
| Карты | Яндекс Карты API | Free tier |
| Прокси | Bright Data | ~$25/мес |
| Антикапча | 2captcha | ~$5/мес |

**Итого: ~$90–100/месяц**

---

## 📦 Структура репозитория

```
├── frontend/        # Next.js — UI платформы (Vercel)
├── backend/         # Supabase migrations + Edge Functions
├── scraper/         # Scrapy + Playwright парсер
├── ai/              # AI-модули (OpenAI GPT-4o)
├── crm/             # CRM-модуль
└── docs/            # Архитектура, роадмап, API
```

---

## 🤖 AI-модули (6 шт.)

| Модуль | Описание |
|--------|----------|
| `listing_analyzer` | Анализ объявлений и выявление аномалий цен |
| `price_predictor` | Прогноз цены на основе рыночных данных |
| `market_report` | Автогенерация отчётов по сегментам рынка |
| `description_generator` | AI-описания объектов для публикации |
| `lead_scorer` | Скоринг лидов по поведению (отложено) |
| `competitive_intel` | Мониторинг конкурентов и ценовой разведки |

---

## 🕷 Парсер (7-стадийный пайплайн)

**Источники:** Циан · Авито · Яндекс.Недвижимость · Domofond · Mirkvartir · ру.09

```
Сбор → Дедупликация → Нормализация → Обогащение → 
Валидация → Индексация (Typesense) → MongoDB
```

---

## 🚀 Роадмап масштабирования

| Тир | Пользователи | Бюджет |
|-----|-------------|--------|
| 1 | 0–1K | ~$100/мес |
| 2 | 1K–10K | ~$500/мес |
| 3 | 10K–50K | ~$1,000/мес |
| 4 | 50K+ | ~$2,000+/мес |

---

## ⚙️ Быстрый старт

```bash
git clone https://github.com/AItestsibiria/Biznesmatr-AI-Code.git
cd Biznesmatr-AI-Code
cp .env.example .env
# Заполни .env своими ключами
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Scraper
```bash
cd scraper
pip install -r requirements.txt
scrapy crawl cian
```

---

## 📄 Лицензия

Proprietary — © 2025 Бизнесметр.рф
