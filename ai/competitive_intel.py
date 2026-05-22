"""
AI-модуль: Конкурентная разведка и мониторинг рынка
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_competitors(our_listing: dict, market_listings: list) -> dict:
    """
    Сравнивает объект с аналогами на рынке.
    """
    market_summary = [
        {
            "price_per_m2": l.get("price_per_m2"),
            "area": l.get("area"),
            "address": l.get("address"),
            "source": l.get("source"),
        }
        for l in market_listings[:10]
    ]
    
    prompt = f"""Проведи конкурентный анализ объекта недвижимости:

НАШ ОБЪЕКТ:
{our_listing}

АНАЛОГИ НА РЫНКЕ:
{market_summary}

Верни JSON:
{{
  "position": "<лучше|на уровне|хуже рынка>",
  "price_delta_pct": <отклонение цены в %>,
  "strengths": ["<преимущества>"],
  "weaknesses": ["<недостатки>"],
  "recommendations": ["<рекомендации по цене и продвижению>"]
}}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=600,
    )
    
    import json
    return json.loads(response.choices[0].message.content)
