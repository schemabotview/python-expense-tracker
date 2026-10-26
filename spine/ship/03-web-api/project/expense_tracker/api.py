"""A small JSON web API over the same expenses.

GET  /report?month=2026-10    what was spent, by category
POST /expenses               {"amount": "3.20", "category": "food"}
"""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from .errors import TrackerError
from .models import Category, Expense
from .money import Money, parse_amount
from .report import BUDGET, TODAY, spent_by_category
from .store import JsonStore


class Api(BaseHTTPRequestHandler):
    saved = Path("data/expenses.json")

    def do_GET(self) -> None:
        url = urlparse(self.path)
        if url.path != "/report":
            return self.reply(404, {"error": f"no such page: {url.path}"})
        month = parse_qs(url.query).get("month", [TODAY.isoformat()[:7]])[0]
        with JsonStore(self.saved) as store:
            totals = spent_by_category(store.load(), month)
        spent = {str(c): str(totals[c].amount) for c in BUDGET}
        self.reply(200, {"month": month, "spent": spent})

    def do_POST(self) -> None:
        if self.path != "/expenses":
            return self.reply(404, {"error": f"no such page: {self.path}"})
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        try:
            amount = Money(parse_amount(body["amount"]))
            category = Category.parse(body["category"])
        except TrackerError as error:
            return self.reply(400, {"error": str(error)})
        note = body.get("note", "added over the API")
        with JsonStore(self.saved) as store:
            expenses = store.load()
            expenses.append(Expense(TODAY.isoformat(), note, amount, category))
            store.save(expenses)
        self.reply(201, {"added": str(amount), "to": str(category)})

    def reply(self, status: int, body: dict[str, object]) -> None:
        data = (json.dumps(body) + "\n").encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, format: str, *args: object) -> None:
        pass    # no line per request


def serve(port: int = 8766, idle: float | None = None) -> None:
    """Answer requests until stopped, or until idle seconds pass unasked."""
    server = HTTPServer(("127.0.0.1", port), Api)
    if idle is None:
        return server.serve_forever()
    server.timeout = idle
    stopped = []
    server.handle_timeout = lambda: stopped.append(True)    # type: ignore
    while not stopped:
        server.handle_request()
