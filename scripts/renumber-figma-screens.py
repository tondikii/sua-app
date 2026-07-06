#!/usr/bin/env python3
"""Renumber Figma preview screens sequentially 1..N (no gaps)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIGMA = ROOT / "figma"
APP = FIGMA / "src/app/App.tsx"
SCREENS = FIGMA / "src/app/components/screens"


def main() -> None:
    app_text = APP.read_text()
    matches = re.findall(
        r"\{ index: (\d+), label: '([^']+)', component: <(\w+) /> \}", app_text
    )
    if not matches:
        raise SystemExit("No screens found")

    rename: dict[str, str] = {}
    entries: list[tuple[int, str, str]] = []
    for new_idx, (_old_idx, label, comp) in enumerate(matches, 1):
        suffix = re.sub(r"^Screen\d+", "", comp)
        new_comp = f"Screen{new_idx}{suffix}"
        rename[comp] = new_comp
        entries.append((new_idx, label, new_comp))

    # Replace component names everywhere under figma/
    for path in sorted(FIGMA.rglob("*")):
        if path.suffix not in {".tsx", ".ts", ".md"}:
            continue
        text = path.read_text()
        updated = text
        for old, new in sorted(rename.items(), key=lambda x: -len(x[0])):
            updated = updated.replace(old, new)
        if updated != text:
            path.write_text(updated)

    # Two-phase file renames
    files = sorted(SCREENS.glob("Screen*.tsx"))
    temps: list[tuple[Path, Path]] = []
    for i, f in enumerate(files):
        tmp = SCREENS / f"__renum_{i:03d}.tsx"
        f.rename(tmp)
        temps.append((tmp, f))

    for tmp, _original in temps:
        text = tmp.read_text()
        m = re.search(r"export function (Screen\d+\w+)", text)
        if not m:
            raise SystemExit(f"No export in {tmp}")
        tmp.rename(SCREENS / f"{m.group(1)}.tsx")

    # Fix indices in App.tsx (labels are unique per screen)
    app_text = APP.read_text()
    label_to_idx = {label: idx for idx, label, _ in entries}
    def fix_line(line: str) -> str:
        m = re.match(r"(\s*\{ index: )(\d+)(, label: '([^']+)', component: <\w+> \},?)", line)
        if not m:
            return line
        label = m.group(3)
        if label not in label_to_idx:
            return line
        return f"{m.group(1)}{label_to_idx[label]}{m.group(3)}"

    APP.write_text("\n".join(fix_line(line) for line in app_text.splitlines()) + "\n")

    # Import paths must match renamed files (multi-export files keep first export filename)
    import subprocess
    subprocess.run([str(ROOT / "scripts" / "fix-figma-app-imports.py")], check=True)

    print(f"Renumbered {len(rename)} screens -> indices 1..{len(rename)}")


if __name__ == "__main__":
    main()
