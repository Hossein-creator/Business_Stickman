#!/usr/bin/env python3
"""Rank captured reels/shorts by outlier multiple (views / the account's own median).

Usage: python3 scripts/rank_swipe.py research/captured.tsv --out research/swipe.md

Input is tab-separated with a header row:
account  followers  median  views  hook  [length]  [cta]
Above 3x is a signal; below 1.5x is that account's normal day.
"""
import argparse
import csv
import statistics
import sys


def num(v):
    return float(str(v).replace(",", "").replace("_", "").strip() or 0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tsv")
    ap.add_argument("--out", default="research/swipe.md")
    a = ap.parse_args()

    with open(a.tsv, newline="", encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f, delimiter="\t") if r.get("account")]
    if not rows:
        sys.exit("no rows in " + a.tsv)
    for r in rows:
        med = num(r["median"])
        r["multiple"] = num(r["views"]) / med if med else 0.0
        r["words"] = len(r["hook"].split())
    rows.sort(key=lambda r: r["multiple"], reverse=True)

    third = max(1, len(rows) // 3)
    top, bottom = rows[:third], rows[-third:]
    accounts = len({r["account"] for r in rows})
    out = [f"# Swipe file\n\n{len(rows)} videos · {accounts} accounts · baseline: account median\n"]
    if len(rows) < 30:
        out.append(f"> Small sample ({len(rows)} videos). Treat patterns as hints, not findings.\n")

    out.append("## Outliers (above 3x)\n")
    for r in rows:
        if r["multiple"] >= 3:
            out.append(f"- **{r['multiple']:.1f}x** {r['account']} · {int(num(r['views'])):,} views "
                       f"(median {int(num(r['median'])):,}) · \"{r['hook']}\"")
    out.append("\n## Top third vs bottom third\n")
    out.append(f"- Hook length: {statistics.median(r['words'] for r in top):.0f} words up top, "
               f"{statistics.median(r['words'] for r in bottom):.0f} at the bottom")
    lens = [num(r["length"]) for r in top if r.get("length")]
    if lens:
        out.append(f"- Video length (top third): median {statistics.median(lens):.0f} s")
    out.append("\n## All videos\n\n| multiple | account | views | hook |\n|---|---|---|---|")
    for r in rows:
        out.append(f"| {r['multiple']:.1f}x | {r['account']} | {int(num(r['views'])):,} | {r['hook']} |")

    with open(a.out, "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    print("\n".join(out[:12]))
    print(f"\nwrote {a.out}")


if __name__ == "__main__":
    main()
