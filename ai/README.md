# AI-модули — Бизнесметр

Все модули используют OpenAI GPT-4o.

## Модули

| Файл | Назначение |
|------|-----------|
| `listing_analyzer.py` | Анализ и скоринг объявлений |
| `price_predictor.py` | Прогноз рыночной цены |
| `market_report.py` | Генерация отчётов по сегментам |
| `description_generator.py` | Продающие описания объектов |
| `competitive_intel.py` | Конкурентная разведка |

## Использование

```python
from ai.listing_analyzer import analyze_listing

result = analyze_listing({
    "title": "Офис 120м² в Москва-Сити",
    "price": 85_000_000,
    "area": 120,
    "price_per_m2": 708_333,
    "address": "Пресненская наб., 8с1",
})
print(result)
```

## Зарезервировано

- `lead_scorer.py` — ML скоринг лидов (активация при ~$500/мес бюджете)
- Интеграция Claude API (1–2 недели до запуска)
