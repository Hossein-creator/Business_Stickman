# Business Stickman: Style Guide

The brief every video in this repo follows. Read it before making a new one.

## Niche

Faceless short videos (TikTok, Instagram Reels, YouTube Shorts) about **motivation, mindset and
life lessons, tied to money and business**.

- **Themes:** gratitude, comparison, entrepreneurship, small business, discipline, time.
- **Audience:** young adults from working and middle-class backgrounds (first target: Indonesia).
  The characters are everyday people: delivery riders, street-food sellers, people paying off
  installments, people saving spare change.
- **Language on screen:** English.

## Format

| | |
|---|---|
| Size | 1080 × 1920 (9:16), rendered at 60 fps |
| Length | about 18 s |
| Built with | [HyperFrames](https://hyperframes.heygen.com): HTML + canvas, rendered to MP4 |
| Safe zone | All words between y = 168 and y = 1330. Below that, only scenery (the app UI covers it) |

## The formula (why people watch to the end)

1. **Frame 0 is the hook.** A bold line is already on screen in the first frame (it is also the
   thumbnail). The second line arrives at about 0.6 s and asks the question.
2. **Open a loop.** A counter or timeline (DAY 1 → 365, 2026 → 2016) makes the viewer wait for
   the result.
3. **Contrast.** Two paths side by side, or one person's past against their present. One path
   goes grey and rainy, the other gets warm light.
4. **Accelerate.** Beats get faster toward the payoff (3.0 s, 4.6 s, 6.0 s … 11.7 s).
5. **The payoff** is a transformation with light, sparkle and an impact sound (about 12–13 s).
6. **The quote** (about 14.5–18 s) is one short, quotable sentence in two lines with one amber
   keyword, revealed word by word. Nothing in the picture repeats it.

## Look

| Element | Rule |
|---|---|
| Background | Night. Gradient `#171b24` → `#0a0c11`, parallax city silhouette with a few lit windows, vignette, light film grain |
| Characters | Stickmen with round heads and thick, rounded limbs with a dark outline (`#0d1015`). Hero `#eef1f6`, others `#9aa3b3`. No faces: posture tells the mood (slump, proud, cheer) |
| Accent | Amber `#ffc23d` with a soft glow: only for what matters (money, light, the payoff, the keyword) |
| Bad news | Coral `#ef6f5e` (bills, losses, "CLOSED") |
| Props | Flat vector, rounded corners, same outline: carts with striped awnings (teal `#6fa7ac` / cream), jars, coins, signs, thought bubbles |
| Labels | Small caps, wide letter spacing, muted grey (`SPEND FIRST`, `SAVED`) |
| Type | Plus Jakarta Sans ExtraBold (800), 64–66 px for the hook and quote |
| Motion | Everything eased (no linear moves except counters). The camera always breathes (slow push), with a small kick on each beat. Pop-ins overshoot. Characters never move in unison |
| Watermark | `BUSINESS STICKMAN` (a variable, `brand`), small and faint at the bottom |

## Sound

- Sound effects only on visible actions: pop (bubble or coin), whoosh (camera move, quote),
  notification (bills), sparkle and impact (payoff), chime (first customer).
- **No music is baked in.** Add a trending sound in the TikTok / Instagram / YouTube app when
  posting: trending audio helps reach, and the effects are mixed low enough to sit under it.
- The effects come from the HyperFrames bundled library (Pixabay licence, free for commercial
  use; see `shared/sfx/CREDITS.md`).

## Making a new video

0. **Research what is trending first** with `/anthropic-skills:ig-viral` (see `CLAUDE.md`). The
   hook and structure of every new video start from `research/swipe.md`: the formulas that beat
   their account's own median by 3x or more, rewritten as our own story.
1. Copy an existing project: `cp -r videos/02-chapter-one videos/03-<name>` and rename the id in
   `meta.json` and `package.json`.
2. Run `./scripts/sync-shared.sh` so the project has the latest engine, fonts and sounds.
3. Write the story in `index.html` (`draw(ctx, t)` draws the frame at time `t`). Hook and quote
   text are variables at the top of the file.
4. Check and render (see `README.md`).

## Video ideas (backlog)

- **Gratitude chain:** a rider wants a car, the driver (installments) wants a scooter, the couple
  on the scooter wants the seller's freedom, the hospital patient wants to be the rider.
  *"Your 'not enough' is someone else's 'if only'."*
- **Waiting for capital:** one waits for $10,000, the other starts with $10.
  *"You're waiting for money. You need to start."*
- **Fake rich:** new phone on installments vs. a cart bought with cash. *"Look rich, or get rich."*
