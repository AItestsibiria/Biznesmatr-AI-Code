"""
Паук: Авито Недвижимость (avito.ru)
"""
import scrapy


class AvitoSpider(scrapy.Spider):
    name = "avito"
    allowed_domains = ["avito.ru"]
    start_urls = [
        "https://www.avito.ru/moskva/kommercheskaya_nedvizhimost",
    ]

    def parse(self, response):
        for card in response.css("[data-marker='item']"):
            yield {
                "source": "avito",
                "source_id": card.attrib.get("data-item-id"),
                "title": card.css("[itemprop='name'] ::text").get("").strip(),
                "price": self._parse_price(card.css("[data-marker='item-price'] ::text").get("")),
                "address": card.css("[data-marker='item-address'] ::text").get("").strip(),
                "category": "commercial",
            }

        next_page = response.css("a[data-marker='pagination-button/next']::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def _parse_price(self, text):
        import re
        digits = re.sub(r"[^\d]", "", text)
        return int(digits) if digits else None
