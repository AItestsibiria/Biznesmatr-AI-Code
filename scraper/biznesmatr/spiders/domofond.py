"""
Паук: Domofond.ru
"""
import scrapy


class DomofondSpider(scrapy.Spider):
    name = "domofond"
    allowed_domains = ["domofond.ru"]
    start_urls = ["https://www.domofond.ru/prodazha-kommercheskaya-moskva"]

    def parse(self, response):
        # TODO: реализовать парсинг Domofond
        self.logger.info(f"Получен ответ от {response.url}")
        yield {}
