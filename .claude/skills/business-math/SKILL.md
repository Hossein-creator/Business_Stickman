---
name: business-math
description: Work out and check every number in a Business Stickman business-model or business-idea video (kit cost, cost per unit, profit per day and month, payback, where the money goes) and write the honest assumptions line. Use before building any video that shows money, when the user asks "stimmen die Zahlen", or when a number on screen or in a caption changes.
---

# business-math

The videos teach. A wrong or too-good number breaks trust, and the comments will say it. So
every number on screen comes out of `calc.py`, never out of the head.

## Steps

1. **Find real prices.** Search the web for current prices in Indonesia (street-food, kopi,
   cups, thermoses, laundry per kg, haircut, ...). Convert to USD at today's rate and round to
   friendly numbers ($0.35, not $0.347). Keep prices typical, not best case.
2. **Write the numbers** to `videos/NN-<name>/numbers.json` (it is committed with the video):
   - Business idea: `kit`, `price`, `unit_cost`, `units_per_day`, `days_per_month`,
     optional `hours_per_day`.
   - Business model: `price`, `split` (every party that gets a share), optional `scale`
     (`n`, `label`, `of`) and `px_per_dollar` for the money bar.
   - Examples are in the docstring of `calc.py`.
3. **Run it:**
   ```bash
   python3 .claude/skills/business-math/calc.py videos/NN-<name>/numbers.json
   ```
   Fix every FAIL. For each WARN either change the number or show the reason in the video
   (for example "2 people" or "only weekends"). Say which out loud.
4. **Use the output exactly** in `index.html` (counters, rows, donut, bars) and in the caption.
   If a number changes later, change `numbers.json` and run it again.
5. **The assumptions line** goes small on screen (15 px, 45 % white, above y = 1330) and as one
   line in the caption.

## Rules

- Conservative beats exciting: fewer sales a day, more days off, all costs counted.
- One person, one city, one day: say who and where the numbers are for.
- Money for young people in Indonesia: a monthly result far above a minimum wage (~$330) needs
  a reason in the story, or it reads as a scam.
- Round once, at the end. On screen show at most two decimals and no more than 4 digits where
  possible ($624, $5.8M).
- Never promise income: "can make", "example", "not guaranteed".
