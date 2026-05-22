# Scrapy settings — Бизнесметр парсер

BOT_NAME = "biznesmatr"
SPIDER_MODULES = ["biznesmatr.spiders"]
NEWSPIDER_MODULE = "biznesmatr.spiders"

# Playwright
DOWNLOAD_HANDLERS = {
    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
}
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
PLAYWRIGHT_BROWSER_TYPE = "chromium"
PLAYWRIGHT_LAUNCH_OPTIONS = {"headless": True}

# Bright Data прокси
ROTATING_PROXY_LIST_PATH = None  # настраивается через env
DOWNLOADER_MIDDLEWARES = {
    "biznesmatr.middlewares.BrightDataMiddleware": 610,
    "biznesmatr.middlewares.CaptchaMiddleware": 620,
}

# Вежливость
DOWNLOAD_DELAY = 1.5
RANDOMIZE_DOWNLOAD_DELAY = True
CONCURRENT_REQUESTS = 4
CONCURRENT_REQUESTS_PER_DOMAIN = 2

# MongoDB pipeline
ITEM_PIPELINES = {
    "biznesmatr.pipelines.DedupePipeline": 100,
    "biznesmatr.pipelines.NormalizePipeline": 200,
    "biznesmatr.pipelines.MongoDBPipeline": 300,
    "biznesmatr.pipelines.SupabasePipeline": 400,
    "biznesmatr.pipelines.TypesensePipeline": 500,
}

MONGODB_URI = "mongodb://localhost:27017"
MONGODB_DB = "biznesmatr_raw"

LOG_LEVEL = "INFO"
