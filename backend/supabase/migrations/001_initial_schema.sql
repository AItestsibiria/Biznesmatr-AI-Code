-- Бизнесметр AI — начальная схема БД
-- Supabase / PostgreSQL

-- Объекты недвижимости
CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source        TEXT NOT NULL,          -- cian | avito | yandex | manual
  source_id     TEXT,                   -- ID на источнике
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC,
  price_per_m2  NUMERIC,
  area          NUMERIC,
  category      TEXT,                   -- office | retail | warehouse | land
  city          TEXT DEFAULT 'Москва',
  address       TEXT,
  lat           DOUBLE PRECISION,
  lon           DOUBLE PRECISION,
  photos        TEXT[],
  ai_score      NUMERIC,                -- AI оценка качества объявления
  ai_summary    TEXT,                   -- AI краткое описание
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Пользователи (расширение auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name     TEXT,
  company       TEXT,
  phone         TEXT,
  role          TEXT DEFAULT 'agent',  -- agent | investor | developer | admin
  plan          TEXT DEFAULT 'free',   -- free | pro | enterprise
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CRM — Лиды
CREATE TABLE crm_leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES profiles(id),
  listing_id    UUID REFERENCES listings(id),
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  status        TEXT DEFAULT 'new',    -- new | contacted | qualified | lost | won
  notes         TEXT,
  ai_score      NUMERIC,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- CRM — Задачи
CREATE TABLE crm_tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID REFERENCES crm_leads(id),
  owner_id      UUID REFERENCES profiles(id),
  title         TEXT NOT NULL,
  due_at        TIMESTAMPTZ,
  is_done       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- AI-отчёты
CREATE TABLE ai_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES profiles(id),
  type          TEXT,                  -- market | listing | competitive
  payload       JSONB,
  result        TEXT,
  tokens_used   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE listings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_tasks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- Индексы
CREATE INDEX idx_listings_city     ON listings(city);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_price    ON listings(price);
CREATE INDEX idx_crm_leads_owner   ON crm_leads(owner_id);
CREATE INDEX idx_crm_leads_status  ON crm_leads(status);
