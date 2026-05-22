#!/usr/bin/env python3
"""Parse VDS Figma Collection metadata XML into token JSON files."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_INPUT = SCRIPT_DIR / "data" / "figma-collection-export.xml"
OUT_DIR = SCRIPT_DIR.parent / "src/tokens/generated"

TABLE_IDS = [
    ("73102:139626", "semantic-colors"),
    ("73102:149124", "color-primitives"),
    ("73102:151299", "size"),
    ("73102:151952", "effects"),
]


def extract_table_xml(text: str, table_id: str) -> str:
    marker = f'<frame id="{table_id}" name="Table"'
    start = text.find(marker)
    if start < 0:
        return ""
    next_tables = [text.find(f'<frame id="{tid}" name="Table"') for tid, _ in TABLE_IDS if tid != table_id]
    next_tables = [i for i in next_tables if i > start]
    end = min(next_tables) if next_tables else len(text)
    return text[start:end]


def cell_texts(cell: str) -> list[str]:
    return re.findall(r'<text[^>]* name="([^"]*)"', cell)


def parse_value_cell(cell: str) -> dict:
    texts = [t for t in cell_texts(cell) if t not in ("Rectangle", "Variable", "Type", "Light", "Value", "Dark Mode Testing")]
    hex_match = re.search(r"\(#([0-9A-Fa-f]{6,8})\)", cell)
    if hex_match:
        return {"hex": f"#{hex_match.group(1).upper()}", "step": next((t for t in texts if re.fullmatch(r"\d+|transparent|scrim", t)), None)}
    direct = next((t for t in texts if re.fullmatch(r"#[0-9A-Fa-f]{6,8}", t)), None)
    if direct:
        return {"hex": direct.upper(), "step": None}
    return {"hex": None, "step": None, "raw": " ".join(texts) if texts else None}


def normalize_group(header: str) -> str:
    h = header.strip()
    if h.startswith("--"):
        h = h[2:]
    return re.sub(r"\s*/\s*", "/", h)


def build_token(group: str, variable: str) -> str:
    if variable.startswith("--"):
        return variable
    if group:
        return f"--{group}/{variable}"
    return f"--{variable}"


def parse_semantic_table(table_xml: str) -> list[dict]:
    rows: list[dict] = []
    current_group = ""

    parts = re.split(r'(?=\n    <frame id="[^"]*" name="(?:Header|Row)")', table_xml)

    for part in parts:
        if 'name="Header"' in part[:80]:
            m = re.search(r'<text[^>]* name="([^"]*)"', part)
            if m and m.group(1) not in ("color",):
                current_group = normalize_group(m.group(1))
            continue

        if 'name="Row"' not in part[:80]:
            continue

        cells = re.findall(r'<frame id="[^"]*" name="Cell"[^>]*>([\s\S]*?)</frame>', part)
        if len(cells) < 2:
            continue

        var = cell_texts(cells[0])[0] if cell_texts(cells[0]) else None
        if not var or var in ("Variable", "Type"):
            continue

        token_type = cell_texts(cells[1])[0] if len(cells) > 1 and cell_texts(cells[1]) else "unknown"
        light = parse_value_cell(cells[2]) if len(cells) > 2 else {}
        dark = parse_value_cell(cells[3]) if len(cells) > 3 else {}

        token = build_token(current_group, var)
        parts_tok = token.lstrip("-").split("/")
        group_key = "/".join(parts_tok[:2]) if len(parts_tok) >= 2 else (parts_tok[0] if parts_tok else "root")

        rows.append(
            {
                "token": token,
                "group": group_key,
                "type": token_type,
                "light": light.get("hex") or light.get("raw"),
                "lightStep": light.get("step"),
                "dark": dark.get("hex") or dark.get("raw"),
                "darkStep": dark.get("step"),
            }
        )

    return rows


def parse_simple_table(table_xml: str, mode: str) -> list[dict]:
    rows: list[dict] = []
    current_palette = ""

    parts = re.split(r'(?=\n    <frame id="[^"]*" name="(?:Header|Row)")', table_xml)

    for part in parts:
        if 'name="Header"' in part[:80]:
            m = re.search(r'<text[^>]* name="([^"]*)"', part)
            if m:
                name = m.group(1)
                if name not in ("--color primitives", "size", "effects", "icon", "radius", "space", "stroke", "blur", "opacity"):
                    current_palette = normalize_group(name)
                elif name.startswith("--"):
                    current_palette = normalize_group(name)
            continue

        if 'name="Row"' not in part[:80]:
            continue

        cells = re.findall(r'<frame id="[^"]*" name="Cell"[^>]*>([\s\S]*?)</frame>', part)
        if len(cells) < 2:
            continue

        var = cell_texts(cells[0])[0] if cell_texts(cells[0]) else None
        if not var or var in ("Variable", "Type", "Value"):
            continue

        token_type = cell_texts(cells[1])[0] if cell_texts(cells[1]) else mode
        value = parse_value_cell(cells[2]) if len(cells) > 2 else parse_value_cell(cells[1])

        if mode == "primitives":
            token = f"--color-primitives/{current_palette}/{var}" if current_palette else f"--color-primitives/{var}"
        else:
            token = f"--{current_palette}/{var}" if current_palette else f"--{var}"

        rows.append(
            {
                "token": token,
                "palette": current_palette or "root",
                "type": token_type,
                "value": value.get("hex") or value.get("raw"),
                "step": value.get("step"),
            }
        )

    return rows


def main() -> None:
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_INPUT
    if not input_path.exists():
        print(f"Error: input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    text = input_path.read_text()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    semantic_xml = extract_table_xml(text, "73102:139626")
    primitives_xml = extract_table_xml(text, "73102:149124")
    size_xml = extract_table_xml(text, "73102:151299")
    effects_xml = extract_table_xml(text, "73102:151952")

    semantic = parse_semantic_table(semantic_xml)
    primitives = parse_simple_table(primitives_xml, "primitives")
    size = parse_simple_table(size_xml, "size")
    effects = parse_simple_table(effects_xml, "effects")

    group_counts: dict[str, int] = {}
    category_counts: dict[str, int] = {}
    for row in semantic:
        group_counts[row["group"]] = group_counts.get(row["group"], 0) + 1
        cat = row["group"].split("/")[0]
        category_counts[cat] = category_counts.get(cat, 0) + 1

    meta = {
        "source": "VDS Figma Collection 73102:139464",
        "exportedAt": "2026-05-22",
        "counts": {
            "semantic-colors": len(semantic),
            "color-primitives": len(primitives),
            "size": len(size),
            "effects": len(effects),
        },
        "semanticGroups": dict(sorted(group_counts.items(), key=lambda x: (-x[1], x[0]))),
        "topCategories": dict(sorted(category_counts.items(), key=lambda x: (-x[1], x[0]))),
    }

    (OUT_DIR / "semantic-colors.json").write_text(json.dumps({"rows": semantic, **meta}, indent=2))
    (OUT_DIR / "color-primitives.json").write_text(json.dumps({"rows": primitives, **meta}, indent=2))
    (OUT_DIR / "size.json").write_text(json.dumps({"rows": size, **meta}, indent=2))
    (OUT_DIR / "effects.json").write_text(json.dumps({"rows": effects, **meta}, indent=2))
    (OUT_DIR / "meta.json").write_text(json.dumps(meta, indent=2))

    print("Exported:")
    for k, v in meta["counts"].items():
        print(f"  {k}: {v}")
    print(f"  groups: {len(group_counts)}")
    print(f"  top categories: {len(category_counts)}")


if __name__ == "__main__":
    main()
