import json
import shutil
from pathlib import Path
from datetime import date

ROOT = Path(__file__).parent
DATA_FILE = ROOT / "conferences.json"
README_FILE = ROOT / "README.md"
WEBSITE_DIR = ROOT / "docs"


def fmt_date(d):
    if not d or d == "none":
        return "—"
    try:
        return date.fromisoformat(d).strftime("%b %d, %Y")
    except ValueError:
        return d


def fmt_location(c):
    city = c.get("city", "")
    country = c.get("country", "")
    city = "" if city == "none" else city
    country = "" if country == "none" else country
    if city and country:
        return f"{city}, {country}"
    return city or country or "—"


def generate_readme(conferences):
    categories = {}
    for c in conferences:
        categories.setdefault(c.get("category", "Other"), []).append(c)

    for cat in categories:
        categories[cat].sort(key=lambda c: c.get("start_date", ""))

    lines = [
        "# Quantum Conferences\n",
        "A curated list of quantum computing and quantum information conferences.\n",
    ]

    for cat in sorted(categories):
        lines.append(f"## {cat}\n")
        lines.append("| Conference | Dates | Location | Deadlines (submission, registration) |")
        lines.append("|-----------|-------|----------|--------------------------------------|")
        for c in categories[cat]:
            url = c.get("url", "")
            name = f"[{c['name']}]({url})" if url and url != "none" else c["name"]
            dates = f"{fmt_date(c.get('start_date'))} – {fmt_date(c.get('end_date'))}"
            location = fmt_location(c)
            sub = fmt_date(c.get("submission_deadline"))
            reg = fmt_date(c.get("registration_deadline"))
            lines.append(f"| {name} | {dates} | {location} | {sub}, {reg} |")
        lines.append("")

    lines += [
        "## Contributing\n",
        "To add a conference, edit `conferences.json` and open a pull request. Each entry should follow this format:\n",
        "```json",
        """{
  "name": "Conference name",
  "url": "https://conference.url",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "registration_deadline": "YYYY-MM-DD or none",
  "submission_deadline": "YYYY-MM-DD or none",
  "city": "City",
  "country": "Country",
  "keywords": "keyword1, keyword2",
  "category": "Category name"
}""",
        "```\n",
    ]

    README_FILE.write_text("\n".join(lines))
    print(f"Generated {README_FILE}")


def generate_website():
    WEBSITE_DIR.mkdir(exist_ok=True)
    shutil.copy(DATA_FILE, WEBSITE_DIR / "conferences.json")
    print(f"Copied conferences.json to {WEBSITE_DIR}/")


def main():
    conferences = json.loads(DATA_FILE.read_text())
    generate_readme(conferences)
    generate_website()


if __name__ == "__main__":
    main()
