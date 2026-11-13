import json
import os
import re
import argparse
import gspread

SPREADSHEET_ID = "1dYnXSmtPH9_Qx53mAAG6YcSpMB2SXXIHOyepiVilr88"
CREDENTIALS_FILE = r"C:/Users/Edvin/Documents/GoogleAPI/GoogleAPI.json"
BUILD_DIR = "src/JSON"

SHEETS = [
    "Boomerang Australia"
]

SHEET_CONFIGS = []


def is_blank(cell):
    return cell is None or str(cell).strip() == ""


def trim_row(row):
    row = list(row)
    while row and is_blank(row[-1]):
        row.pop()
    return row


def clean_rows(values):
    cleaned = []
    for row in values:
        row = trim_row(row)
        if row and any(not is_blank(cell) for cell in row):
            cleaned.append(row)
    return cleaned


def ensure_length(row, length):
    if len(row) >= length:
        return row
    return row + [""] * (length - len(row))


def export_mapped(values, config):
    """
    Export a sheet using the configured column mapping and category bucket.

    Output shape:
    {
      "Category": [
        {
          "name": "...",
          "description": "..."
        }
      ]
    }
    """
    rows = clean_rows(values)[1:]  # Skip first row, assuming it is the header row.

    categories = config["categories"]
    grouped = {category: [] for category in categories}

    mapping = config["mapping"]
    required_length = max([config["category_column_index"]] + list(mapping.values())) + 1

    for row in rows:
        row = ensure_length(row, required_length)

        item = {}
        for key, index in mapping.items():
            value = row[index]

            item[key] = value

        category = row[config["category_column_index"]]
        category = "" if category is None else str(category).strip()

        if category not in grouped:
            category = categories[0]

        grouped[category].append(item)

    return grouped


def export_raw(values):
    """
    Export a sheet as a plain JSON array using the first row as headers.

    Output shape:
    [
      {
        "Column A": "...",
        "Column B": "..."
      }
    ]
    """
    rows = clean_rows(values)

    if not rows:
        return []

    max_len = max(len(row) for row in rows)
    header = ensure_length(rows[0], max_len)

    headers = []
    for i, value in enumerate(header):
        name = str(value).strip() if value is not None else ""
        if not name:
            name = f"col_{i}"

        base = name
        suffix = 2
        while name in headers:
            name = f"{base}_{suffix}"
            suffix += 1

        headers.append(name)

    items = []
    for row in rows[1:]:
        row = ensure_length(row, len(headers))
        items.append({headers[i]: row[i] for i in range(len(headers))})

    return items


def slugify_sheet_name(name):
    return re.sub(r"[^0-9a-zA-Z]+", "_", name).strip("_").lower()


def save_json(data, filename):
    path = os.path.join(BUILD_DIR, filename)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    if isinstance(data, list):
        print(f"Wrote {path} ({len(data)} rows)")
    elif isinstance(data, dict):
        total = sum(len(value) for value in data.values() if isinstance(value, list))
        print(f"Wrote {path} ({total} rows)")
    else:
        print(f"Wrote {path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export Google Sheets to JSON")
    parser.add_argument(
        "--sheet", "-s",
        help="Export only this specific sheet (default: all sheets)"
    )
    parser.add_argument(
        "--all-sheets", "-a",
        action="store_true",
        help="Export all sheets (default behavior)"
    )
    parser.add_argument(
        "--credentials", "-c",
        default=CREDENTIALS_FILE,
        help=f"Path to credentials JSON file (default: {CREDENTIALS_FILE})"
    )
    
    args = parser.parse_args()
    
    os.makedirs(BUILD_DIR, exist_ok=True)
    
    try:
        client = gspread.service_account(filename=args.credentials)
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
    except Exception as exc:
        raise SystemExit(f"Could not open spreadsheet: {exc}")
    
    config_by_sheet = {config["sheet_name"]: config for config in SHEET_CONFIGS}
    
    # Determine which sheets to process
    if args.sheet:
        sheets_to_process = [args.sheet]
        print(f"Processing single sheet: {args.sheet}")
    else:
        sheets_to_process = SHEETS
        print(f"Processing all {len(SHEETS)} sheets")
    
    for sheet_name in sheets_to_process:
        try:
            worksheet = spreadsheet.worksheet(sheet_name)
            values = worksheet.get_all_values()
        except Exception as exc:
            print(f"Could not fetch sheet '{sheet_name}': {exc}")
            continue

        try:
            config = config_by_sheet.get(sheet_name)

            if config:
                output = export_mapped(values, config)
                filename = config["file"]
            else:
                output = export_raw(values)
                filename = f"{slugify_sheet_name(sheet_name)}.json"

            save_json(output, filename)

        except Exception as exc:
            print(f"Failed to export sheet '{sheet_name}': {exc}")