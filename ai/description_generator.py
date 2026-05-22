"""
AI-модуль: Генерация продающих описаний объектов
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_description(listing: dict, tone: str = "professional") -> str:
    """
    Генерирует продающее описание объекта.
    
    Args:
        tone: professional | friendly | investment
    """
    tone_map = {
        "professional": "деловой профессиональный",
        "friendly": "дружелюбный и доступный",
        "investment": "инвестиционно-аналитический",
    }
    
    prompt = f"""Создай продающее описание объекта коммерческой недвижимости.
Тон: {tone_map.get(tone, 'профессиональный')}

Характеристики:
- Тип: {listing.get('category')}
- Площадь: {listing.get('area')} м²
- Адрес: {listing.get('address')}
- Цена: {listing.get('price')} руб.
- Доп. параметры: {listing.get('extra', {})}

Требования: 150-250 слов, без клише, с акцентом на ключевые преимущества.
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
    )
    
    return response.choices[0].message.content
