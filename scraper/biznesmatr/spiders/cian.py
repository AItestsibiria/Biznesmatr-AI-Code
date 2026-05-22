"""
Паук: Циан (cian.ru) — Коммерческая недвижимость
"""
import scrapy
from scrapy_playwright.page import PageMethod


class CianSpider(scrapy.Spider):
    name = "cian"
    allowed_domains = ["cian.ru"]
    
    categories = [
        "https://www.cian.ru/cat.php?deal_type=sale&engine_version=2&offer_type=offices",
        "https://www.cian.ru/cat.php?deal_type=sale&engine_version=2&offer_type=warehouses",
        "https://www.cian.ru/cat.php?deal_type=sale&engine_version=2&offer_type=free-appointment-object",
    ]

    def start_requests(self):
        for url in self.categories:
            yield scrapy.Request(
                url,
                meta={
                    "playwright": True,
                    "playwright_include_page": True,
                    "playwright_page_methods": [
                        PageMethod("wait_for_selector", "[data-name='OffersSerpItem']"),
                    ],
                },
            )

    def parse(self, response):
        for card in response.css("[data-name='OffersSerpItem']"):
            yield {
                "source": "cian",
                "source_id": card.attrib.get("data-id"),
                "title": card.css("h3 ::text").get("").strip(),
                "price": self._parse_price(card.css("[data-mark='MainPrice'] ::text").get("")),
                "area": self._parse_area(card.css("[data-mark='OfferGeneralInfo'] ::text").get("")),
                "address": card.css("[data-mark='Address'] ::text").get("").strip(),
                "category": "commercial",
                "url": card.css("a::attr(href)").get(""),
            }

        next_page = response.css("a[data-name='Pagination'] + a::attr(href)").get()
        if next_page:
            yield response.follow(next_page, callback=self.parse)

    def _parse_price(self, text):
        import re
        digits = re.sub(r"[^\d]", "", text)
        return int(digits) if digits else None

    def _parse_area(self, text):
        import re
        m = re.search(r"([\d,\.]+)\s*м", text)
        return float(m.group(1).replace(",", ".")) if m else None
