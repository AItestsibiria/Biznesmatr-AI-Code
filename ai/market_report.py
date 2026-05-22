"""
AI-модуль: Автогенерация отчётов по сегментам рынка
"""
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_market_report(segment: str, data: dict) -> str:
    """
    Генерирует профессиональный отчёт по сегменту рынка.
    
    Args:
        segment: office | retail | warehouse | land
        data: агрегированные данные по сегменту
    """
    prompt = f"""Составь аналитический отчёт по сегменту '{segment}' 
коммерческой недвижимости Москвы на основе данных:

{data}

Отчёт должен содержать:
1. Резюме (3-4 предложения)
2. Ключевые показатели рынка
3. Тренды и динамика
4. Топ-локации
5. Прогноз на 3-6 месяцев
6. Рекомендации для инвесторов

Формат: профессиональный деловой русский язык.
"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
    )
    
    return response.choices[0].message.content
