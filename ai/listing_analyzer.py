"""
AI-модуль: Анализ объявлений о коммерческой недвижимости
Использует OpenAI GPT-4o для выявления аномалий и оценки качества.
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def analyze_listing(listing: dict) -> dict:
    """
    Анализирует объявление и возвращает AI-оценку.
    
    Returns:
        {score, summary, flags, price_assessment}
    """
    prompt = f"""Проанализируй объявление о коммерческой недвижимости:

Название: {listing.get('title')}
Цена: {listing.get('price')} руб.
Площадь: {listing.get('area')} м²
Цена за м²: {listing.get('price_per_m2')} руб/м²
Адрес: {listing.get('address')}
Описание: {listing.get('description', 'не указано')}

Верни JSON:
{{
  "score": <0-100, качество объявления>,
  "summary": "<краткое описание 1-2 предложения>",
  "price_assessment": "<ниже рынка|рыночная|выше рынка>",
  "flags": ["<список подозрительных признаков>"],
  "recommendation": "<действие для агента>"
}}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        max_tokens=500,
    )
    
    import json
    return json.loads(response.choices[0].message.content)


if __name__ == "__main__":
    test = {
        "title": "Офис в БЦ Москва-Сити",
        "price": 85_000_000,
        "area": 120,
        "price_per_m2": 708_333,
        "address": "Москва, Пресненская наб., 8с1",
        "description": "Офис с панорамным видом, отделка под ключ",
    }
    result = analyze_listing(test)
    print(result)
