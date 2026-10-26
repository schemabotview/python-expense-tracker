"""A stand-in for a currency service: GET /rates/EUR answers with JSON.

Like a real service across the internet, it takes a moment to answer
(DELAY), and it stops by itself once nobody has asked for IDLE seconds.
The rates are fixed for the course, so every run agrees.
"""
import json
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

RATES = {"EUR": "0.86", "USD": "0.79", "CHF": "0.89", "JPY": "0.0052",
         "SEK": "0.072"}    # one unit, in GBP
DELAY, IDLE = 0.2, 1.5


class Rates(BaseHTTPRequestHandler):
    def do_GET(self):
        currency = self.path.rsplit("/", 1)[-1]
        time.sleep(DELAY)
        if currency not in RATES:
            self.send_error(404, f"no rate for {currency}")
            return
        body = json.dumps({"from": currency, "to": "GBP",
                           "rate": RATES[currency]}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):    # quiet: no line per request
        pass


class Server(ThreadingHTTPServer):
    idle = False

    def handle_timeout(self):
        self.idle = True


server = Server(("127.0.0.1", 8765), Rates)
server.timeout = IDLE
while not server.idle:
    server.handle_request()
