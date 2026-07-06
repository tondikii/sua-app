#!/usr/bin/env python3
"""Fix App.tsx import paths and sequential indices after screen renumber."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIGMA = ROOT / "figma"
APP = FIGMA / "src/app/App.tsx"
SCREENS = FIGMA / "src/app/components/screens"


def build_export_map() -> dict[str, str]:
    mapping: dict[str, str] = {}
    for f in SCREENS.glob("*.tsx"):
        for m in re.finditer(r"export function (Screen\d+\w+)", f.read_text()):
            mapping[m.group(1)] = f.stem
    return mapping


def fix_imports(app_text: str, export_map: dict[str, str]) -> str:
    def fix_path(m: re.Match[str]) -> str:
        block = m.group(0)
        comps = re.findall(r"Screen\d+\w+", block)
        if not comps:
            return block
        stem = export_map.get(comps[0])
        if not stem:
            raise SystemExit(f"Missing file for {comps[0]}")
        return re.sub(r"from '\./components/screens/[^']+'", f"from './components/screens/{stem}'", block)

    return re.sub(
        r"import\s+(?:\{[^}]+\}|\w+)\s+from '\./components/screens/[^']+';",
        fix_path,
        app_text,
    )


def fix_indices(app_text: str) -> str:
    lines = app_text.splitlines()
    idx = 0
    out = []
    for line in lines:
        if re.search(r"\{ index: \d+, label: '", line):
            idx += 1
            line = re.sub(r"index: \d+", f"index: {idx}", line, count=1)
        out.append(line)
    return "\n".join(out) + "\n"


def main() -> None:
    export_map = build_export_map()
    app_text = APP.read_text()
    app_text = fix_imports(app_text, export_map)
    app_text = fix_indices(app_text)
    APP.write_text(app_text)
    print(f"Fixed imports for {len(export_map)} exports; indices 1..{app_text.count('index: ') - 1}")


if __name__ == "__main__":
    main()
