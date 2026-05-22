"""
Middleware: Bright Data прокси + 2captcha
"""
import os
import base64
import requests


class BrightDataMiddleware:
    """Ротация IP через Bright Data"""
    def process_request(self, request, spider):
        user = os.getenv("BRIGHT_DATA_USERNAME")
        pwd  = os.getenv("BRIGHT_DATA_PASSWORD")
        if user and pwd:
            creds = base64.b64encode(f"{user}:{pwd}".encode()).decode()
            request.headers["Proxy-Authorization"] = f"Basic {creds}"
            request.meta["proxy"] = "http://brd.superproxy.io:22225"


class CaptchaMiddleware:
    """Решение капч через 2captcha"""
    def process_response(self, request, response, spider):
        if "captcha" in response.text.lower():
            spider.logger.warning(f"Капча на {request.url}")
            # TODO: интегрировать 2captcha API
        return response
