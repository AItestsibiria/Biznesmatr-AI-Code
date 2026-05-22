"""
AI-модуль: Прогноз цены объекта коммерческой недвижимости
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def predict_price(features: dict) -> dict:
    """
    Прогнозирует рыночную цену объекта на основе характеристик.
    """
    prompt = f"""Оцени рыночную стоимость коммерческой недвижимости в Москве:

Категория: {features.get('category')}
Площадь: {features.get('area')} м²
Район: {features.get('district')}
Этаж: {features.get('floor')} из {features.get('floors_total')}
Состояние: {features.get('condition', 'не указано')}

Верни JSON:
{{
  "price_min": <минимальная оценка руб>,
  "price_max": <максимальная оценка руб>,
  "price_per_m2": <цена за м² руб>,
  "confidence": "<высокая|средняя|низкая>",
  "factors": ["<ключевые факторы влияния на цену>"]
}}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=400,
    )
    
    import json
    return json.loads(response.choices[0].message.content)
