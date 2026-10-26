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
| Length | about 22 s (slower and smoother than the first four videos, which ran 18 s) |
| Built with | [HyperFrames](https://hyperframes.heygen.com): HTML + canvas, rendered to MP4 |
| Safe zone | All words between y = 168 and y = 1330. Below that, only scenery (the app UI covers it) |

## Goal: the most viral video every time

Every video is built to be the most viral version of its idea, not just a good one:

- **Topics must mean something.** One real lesson about money, time or work that a viewer can use
  today (pay yourself first, start early, consistency, compare less). No empty hype.
- **Borrow formats that already travel.** Take the most successful shorts in any niche (see
  `research/swipe.md`) and turn their formula into our niche: a simple lesson with one object,
  X vs Y, a seamless loop, a satisfying transformation, a relatable daily problem, an emotional
  twist, a warning hook. Copy the formula, never the video.
- **Real numbers.** When money is shown, compute it (e.g. compound interest), and put an honest
  footnote on assumptions ("8% average yearly return, not guaranteed").
- **Rewatch value.** Prefer endings that loop into frame 0, or a final picture worth pausing on.

## Pacing: slow, smooth, cinematic

- Each beat gets **1.5–2.5 s**; let the meaning land and hold the reaction before the next beat.
- Arrivals use long ease-outs (`expo.out`, `power4.out`); camera moves ease both ways and take
  1–2 s; exits are shorter than entrances.
- Render with **motion blur** (`data-motion-blur="on" data-motion-blur-events="on"` on the root).
- Text: per-word blur-in (0.5 s, 0.28 s apart), the keyword gets an underline swipe.

## Effects toolbox (`shared/lib/stickman-fx.js`)

Use several per video, always with a cause on screen:

| Effect | Use it for |
|---|---|
| `fx.rays`, `fx.flare`, `fx.leak` | the payoff, a reveal, sunrise |
| `fx.burst` (sparks, coins, snow), `fx.ring` | an impact or a win |
| `fx.confetti`, `fx.moneyRain` | payday, success |
| `fx.snow`, `SM.rain`, `SM.motes` | weather and mood (with depth: near flakes big and soft) |
| `fx.speedLines` | time passing fast, spins |
| `fx.grade` | drain colour when life goes grey, flood it back at the payoff |
| `fx.handheld` | always on: the camera is never perfectly still |
| `fx.spring` | overshoot on anything that lands |
| picture-in-picture | showing a second life at the same time (see `06-snowball`) |

## The formula (why people watch to the end)

1. **Frame 0 is the hook.** A bold line is already on screen in the first frame (it is also the
   thumbnail). The second line arrives at about 0.6 s and asks the question.
2. **Open a loop.** A counter or timeline (DAY 1 → 365, 2026 → 2016) makes the viewer wait for
   the result.
3. **Contrast.** Two paths side by side, or one person's past against their present. One path
   goes grey and rainy, the other gets warm light.
4. **Build up.** Time speeds up toward the payoff, but each beat still has room to land.
5. **The payoff** is a transformation with light, particles and an impact sound (about 12–15 s).
6. **The insight / quote** (last 4–6 s) is one short, quotable sentence in two lines with one amber
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
- **Big number rise and fall:** $70 million to bankrupt, told with stickmen, no names.
  *"It's not what you earn. It's what you keep."*
- **Who stays:** when the stall is empty, one friend still comes every day (emotional twist).
