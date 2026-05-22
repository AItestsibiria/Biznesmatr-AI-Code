"""
7-стадийный пайплайн: Сбор → Дедупликация → Нормализация →
Обогащение → Валидация → Индексация → Хранение
"""
import hashlib
from pymongo import MongoClient
from itemadapter import ItemAdapter


class DedupePipeline:
    """Стадия 2: Дедупликация по хэшу источника"""
    def __init__(self):
        self.seen = set()

    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        key = f"{adapter.get('source')}:{adapter.get('source_id')}"
        uid = hashlib.sha256(key.encode()).hexdigest()
        if uid in self.seen:
            from scrapy.exceptions import DropItem
            raise DropItem(f"Дубликат: {key}")
        self.seen.add(uid)
        item["dedup_hash"] = uid
        return item


class NormalizePipeline:
    """Стадия 3: Нормализация полей"""
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        price = adapter.get("price")
        area = adapter.get("area")
        if price and area:
            adapter["price_per_m2"] = round(price / area, 2)
        return item


class MongoDBPipeline:
    """Стадия 7a: Сохранение raw-данных в MongoDB"""
    def open_spider(self, spider):
        import os
        uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.client = MongoClient(uri)
        self.col = self.client["biznesmatr_raw"]["listings"]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        self.col.update_one(
            {"dedup_hash": item.get("dedup_hash")},
            {"$set": dict(item)},
            upsert=True
        )
        return item


class SupabasePipeline:
    """Стадия 7b: Сохранение нормализованных данных в Supabase"""
    # TODO: реализовать через supabase-py
    def process_item(self, item, spider):
        return item


class TypesensePipeline:
    """Стадия 6: Индексация в Typesense для поиска"""
    # TODO: реализовать через typesense-python
    def process_item(self, item, spider):
        return item
