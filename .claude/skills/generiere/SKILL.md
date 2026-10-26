---
name: generiere
description: Make the next Business Stickman short from start to finish - research, pick the topic, build, check, render, caption, commit and push. Use when the user says "generiere", "generate", "mach ein neues Video", "next video" or asks for one or more new videos.
---

# generiere

The full loop for one new video. `CLAUDE.md` and `STYLE_GUIDE.md` hold the rules; this is the
checklist that runs them in order. Do every step, every time. Nothing stays only on the machine.

## 0. Before anything

- `git pull` and `git status`: start clean.
- Read `STYLE_GUIDE.md` ("What works best", "Video ideas") and the newest `research/swipe.md`.
- Next number: `ls videos | tail -1` + 1.

## 1. Research (`/anthropic-skills:ig-viral`)

- Swipe file younger than about a month: reuse it, say how old it is.
- Older: collect new rows in `research/captured.tsv`, then
  `python3 scripts/rank_swipe.py research/captured.tsv --out research/swipe.md` and
  `cp research/swipe.md ~/.claude/instagram/swipe.md`.
- Also take the top shorts of any niche (YouTube by view count, ≤ 70 s) and turn the formula
  into ours. Copy the formula, never the video.

## 2. Pick the topic

- About 2 of every 3 videos: **business model** (one product taken apart cost by cost, like
  07 Coffee Money) or **business idea** (start small with real numbers, like 08 Car Wash).
  Check the last two made videos and keep the mix.
- The rest: mindset & money in the style of 01, 02, 04, 05 (one strong picture, one lesson).
- Start from the open list in `STYLE_GUIDE.md`. Pick the one with the strongest formula from
  the research and a real lesson.
- Numbers: run the `business-math` skill. Never invent a number on screen.

## 3. Story (22 s beat map)

| Time | Beat |
|---|---|
| 0.0 | Hook line 1 already on screen, speaks to "you", subject visible in frame 0 |
| 0.6 | Hook line 2 (the question / the promise) |
| ~3.0 | Topic chip at y = 196 (`UI.topic`) |
| 3–12 | Build-up: kit / costs / steps, each beat 1.5–2.5 s, numbers count up |
| 12–15 | Payoff: big number, light, particles, impact |
| 15–18 | Twist or scale-up (× days, × customers, year 2) |
| 18.4–22 | Quote, two lines, one amber keyword, word by word |

Write the hook, quote and topic chip down before building. Read them out loud: short words, no
jargon, a 16-year-old in Jakarta understands them at once.

## 4. Build

```bash
N=13; NAME=my-topic                        # example
mkdir videos/$N-$NAME
cp -r videos/08-car-wash/{meta.json,package.json,CLAUDE.md} videos/$N-$NAME/   # not index.html
sed -i "s/08-car-wash/$N-$NAME/g" videos/$N-$NAME/meta.json videos/$N-$NAME/package.json
./scripts/sync-shared.sh
```

Write `index.html` with the `stickman-scene` skill. New props go into `shared/lib/`, then
`./scripts/sync-shared.sh` again (never while a render runs).

## 5. Check

```bash
HF="node /root/.claude/plugins/marketplaces/hyperframes/skills/hyperframes/scripts/plugin-cli.mjs"
cd videos/$N-$NAME
$HF check
$HF snapshot --at 0,0.7,3.5,6,9,12,14,17,19.5,21.5
```

Look at every contact sheet (`.hyperframes/artifacts/snapshots/<id>/contact-sheet*.jpg`). Use the
review list in `stickman-scene`. Fix, snapshot again.

## 6. Render

```bash
$HF render --fps 60 --quality delivery --skill hyperframes --quiet -o ../../renders/$N-$NAME.mp4
```

About 6 minutes. Run it in the background. Above ~90 MB: render again with `--crf 20`.

## 7. Caption (`/anthropic-skills:ig-caption`, Job A)

- Line 1 (≤ 125 characters): the topic plus the one ask ("Save this ...").
- Body: real numbers, search phrases people type, one honest assumptions line.
- Up to 5 specific hashtags. No #fyp / #viral. **Everything in English.** No links, no em dashes.
- Save as `renders/$N-$NAME.caption.txt`, then `python3 scripts/caption_lint.py renders/$N-$NAME.caption.txt`.

## 8. Ship

- `STYLE_GUIDE.md`: move the idea to "Made", add new ideas from the research to "Open".
- `README.md`: add the table row.
- Commit as the user and push:

```bash
git add -A
git -c user.name="Hossein-creator" -c user.email="hosseinahmadi009911@gmail.com" commit -m "Add video $N ($NAME)"
git push
```

- Show the video and the caption in the session (SendUserFile).
