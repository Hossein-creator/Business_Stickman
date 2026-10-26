#!/usr/bin/env python3
"""Check the numbers of a Business Stickman video before they go on screen.

    python3 calc.py numbers.json

Two shapes, both may be in one file:

  Business idea  (start small):
    {"name": "Coffee bike", "kit": {"thermoses": 30, "cups": 10},
     "price": 1.00, "unit_cost": {"coffee & sugar": 0.15, "cup": 0.10, "milk": 0.10},
     "units_per_day": 40, "days_per_month": 24, "hours_per_day": 3}

  Business model (where your money goes):
    {"name": "Delivery app", "price": 12.50,
     "split": {"Restaurant": 8.00, "Rider": 1.60, "App": 2.90},
     "scale": {"n": 2000000, "label": "orders a day", "of": "App"},
     "px_per_dollar": 32}

Optional "assumptions": "..." replaces the default footnote line.

Prints every number the video and the caption need, an honest assumptions line, and
WARN lines for anything that looks too good to be true. Exit code 1 on FAIL.
"""
import json
import sys

# Rough sanity limits for one person, international audience (2026). Above these the video must say why.
MONTHLY_WAGE = 500      # a rough entry-level monthly wage in many countries, in USD
MAX_UNITS_ONE_PERSON = 150
MAX_DAYS = 26


def money(v):
    if abs(v) >= 1000:
        return f"${v:,.0f}"
    return f"${v:,.2f}".replace(".00", "")


def idea(d, out, warn, fail):
    kit = d.get("kit", {})
    kit_total = sum(kit.values())
    price = d["price"]
    costs = d.get("unit_cost", {})
    unit_cost = sum(costs.values())
    profit = price - unit_cost
    units, days = d["units_per_day"], d["days_per_month"]
    day = profit * units
    month = day * days

    out.append("KIT")
    for k, v in kit.items():
        out.append(f"  {k:<22}{money(v):>10}")
    out.append(f"  {'total':<22}{money(kit_total):>10}")
    out.append("PER UNIT")
    out.append(f"  {'price':<22}{money(price):>10}")
    for k, v in costs.items():
        out.append(f"  {k:<22}{money(v):>10}   {v / price:5.0%} of price")
    out.append(f"  {'cost':<22}{money(unit_cost):>10}   {unit_cost / price:5.0%}")
    out.append(f"  {'profit':<22}{money(profit):>10}   {profit / price:5.0%}")
    out.append("SALES")
    out.append(f"  {'per day':<22}{money(day):>10}   ({units} units)")
    out.append(f"  {'per month':<22}{money(month):>10}   ({days} days)")
    if "hours_per_day" in d:
        out.append(f"  {'per hour':<22}{money(day / d['hours_per_day']):>10}")
    if day > 0 and kit_total:
        payback = kit_total / day
        out.append(f"  {'kit paid back after':<22}{payback:>9.1f} days")

    if profit <= 0:
        fail.append("profit per unit is zero or negative")
    if profit / price > 0.8:
        warn.append(f"margin {profit / price:.0%} is very high: are all costs in unit_cost?")
    if units > MAX_UNITS_ONE_PERSON:
        warn.append(f"{units} units a day is a lot for one person")
    if days > MAX_DAYS:
        warn.append(f"{days} days a month leaves almost no day off")
    if month > MONTHLY_WAGE * 3:
        warn.append(f"{money(month)} a month is over 3x a minimum wage: show why or lower it")
    if not costs:
        warn.append("no unit_cost given")

    hrs = f", {d['hours_per_day']} hours a day" if "hours_per_day" in d else ""
    return (f"Example prices. {units} sales a day{hrs}, {days} days a month. "
            "Rent, permits, spoilage and slow days not included. Check local prices and rules.")


def model(d, out, warn, fail):
    price = d["price"]
    split = d["split"]
    total = sum(split.values())
    px = d.get("px_per_dollar")

    out.append("SPLIT")
    for k, v in split.items():
        bar = f"   {v * px:6.0f} px" if px else ""
        out.append(f"  {k:<22}{money(v):>10}   {v / price:5.0%}{bar}")
    out.append(f"  {'sum':<22}{money(total):>10}   (price {money(price)})")
    if abs(total - price) > 0.005:
        fail.append(f"split adds up to {money(total)}, not the price {money(price)}")
    if px and price * px > 1080 - 120:
        warn.append(f"money bar is {price * px:.0f} px wide, wider than the screen with margins")

    sc = d.get("scale")
    if sc:
        part = split.get(sc.get("of"), price)
        out.append("SCALE")
        out.append(f"  x {sc['n']:,} {sc.get('label', '')}: {money(part * sc['n'])}"
                   + (f" for {sc['of']}" if sc.get("of") else ""))
    return (f"Example split of {money(price)}. Real shares change by business, city "
            "and season.")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    with open(sys.argv[1]) as f:
        d = json.load(f)
    out, warn, fail, notes = [], [], [], []
    out.append(d.get("name", "Untitled").upper())
    if "units_per_day" in d:
        notes.append(idea(d, out, warn, fail))
    if "split" in d:
        notes.append(model(d, out, warn, fail))
    if not notes:
        sys.exit("need units_per_day (business idea) or split (business model)")

    print("\n".join(out))
    print("\nASSUMPTIONS (footnote and caption)")
    for n in ([d["assumptions"]] if "assumptions" in d else notes):
        print("  " + n)
    for w in warn:
        print("WARN  " + w)
    for x in fail:
        print("FAIL  " + x)
    print("\n" + ("NOT READY" if fail else "READY"))
    sys.exit(1 if fail else 0)


if __name__ == "__main__":
    main()
