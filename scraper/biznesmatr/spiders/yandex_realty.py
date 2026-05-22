"""
Паук: Яндекс.Недвижимость (realty.yandex.ru)
"""
import scrapy
from scrapy_playwright.page import PageMethod


class YandexRealtySpider(scrapy.Spider):
    name = "yandex_realty"
    allowed_domains = ["realty.yandex.ru"]
    start_urls = ["https://realty.yandex.ru/moskva/kupit/kommercheskaya-nedvizhimost/"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_page_methods": [
                        PageMethod("wait_for_timeout", 2000),
                    ],
                },
            )

    def parse(self, response):
        # TODO: реализовать парсинг Яндекс.Недвижимость
        self.logger.info(f"Получен ответ от {response.url}")
        yield {}
