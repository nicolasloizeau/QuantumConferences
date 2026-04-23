import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
DATA_FILE = ROOT / "conferences.json"
PAST_FILE = ROOT / "past_conferences.json"


def main():
    today = date.today().isoformat()
    conferences = json.loads(DATA_FILE.read_text())
    past = json.loads(PAST_FILE.read_text()) if PAST_FILE.exists() else []

    current, moved = [], []
    for c in conferences:
        end = c.get("end_date", "")
        if end and end != "none" and end < today:
            moved.append(c)
        else:
            current.append(c)

    if moved:
        past.extend(moved)
        PAST_FILE.write_text(json.dumps(past, indent=2))
        DATA_FILE.write_text(json.dumps(current, indent=2))
        print(f"Moved {len(moved)} past conference(s) to {PAST_FILE.name}")
    else:
        print("No past conferences to remove")


if __name__ == "__main__":
    main()
