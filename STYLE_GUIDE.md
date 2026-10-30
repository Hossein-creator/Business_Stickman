# Business Stickman: Style Guide

The brief every video in this repo follows. Read it before making a new one.

## Niche

Faceless short videos (TikTok, Instagram Reels, YouTube Shorts) about **motivation, mindset and
life lessons, tied to money and business**.

- **Themes:** gratitude, comparison, entrepreneurship, small business, discipline, time.
- **Three kinds of video** (most videos are kinds 2 and 3, see "What works best"):
  1. **Mindset & money habits:** gratitude, comparison, discipline, time, saving (e.g. Payday Loop,
     Snowball, Money Leaks).
  2. **Business models:** how a business really makes money, cost by cost (e.g. Your $5 Coffee).
  3. **Business ideas:** a business someone can start small, step by step with real numbers
     (e.g. $50 Car Wash).
- **Audience:** international: young people everywhere who want to understand money and start
  something of their own. Stories and prices work in any country (shown in USD, simple English).
  The characters are everyday people: delivery riders, street-food sellers, people paying off
  installments, people saving spare change.
- **Language on screen:** English.

## What works best (user feedback)

- **Favourites:** 1 Spare Change, 2 Chapter 1, 4 Bamboo, 5 Payday Loop, 7 Your $5 Coffee,
  8 $50 Car Wash.
- **Make the most of 7 and 8:** business models (one product taken apart cost by cost) and
  business ideas (start small, step by step with real numbers). When making several videos, about
  two of every three are of these two kinds; the rest are mindset & money (in the style of 1, 2,
  4, 5: one strong picture, one lesson, an emotional or seamless ending).

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

## Instantly clear, speaks to the viewer

- **The hook talks to "you"** and names the topic in the first frame: "You pay $5 for this
  coffee.", "Got $50?", "You're not bad with money."
- **Frame 0 shows the subject** (the cup, the dirty car, the leaking jar), never an empty scene.
- **A topic chip stays on screen** (`ui.topic`, y = 196) from about 3 s until the ending text
  takes over: "HOW A CAFÉ MAKES MONEY", "BUSINESS IDEA: CAR WASH".
- **Clean infographic look:** one big central object, large labels, numbers that count up, rows
  and steps from `stickman-ui.js` (`ui.step`, `ui.row`, `ui.bigNumber`). Few elements, lots of
  air, nothing overlapping.

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

## Video ideas

Pick from the open list first (see `CLAUDE.md`); when one is made, move it to "Made".

### Open

**Mindset & money habits**
- **Gratitude chain:** a rider wants a car, the driver (installments) wants a scooter, the couple
  on the scooter wants the seller's freedom, the hospital patient wants to be the rider.
  *"Your 'not enough' is someone else's 'if only'."* (Close to a reference video: own story and look.)
- **Waiting for capital:** one waits for $10,000, the other starts with $10.
  *"You're waiting for money. You need to start."* (Close to a reference video: own story and look.)
- **Rise and fall:** $70 million to bankrupt, told with stickmen, no names.
  *"It's not what you earn. It's what you keep."*
- **Who stays:** the stall is empty, but one friend still comes every day (emotional twist).

**Business models**
- **How a street-food cart makes money:** one portion of fried snacks, cost by cost.
- **Why a $3 bottle of water costs 20 cents to make:** brand, shop, transport, margin.
- **How a barbershop makes money:** one $8 haircut, chair rent, tools, time per cut.
- **How a phone-credit kiosk makes money:** tiny margin, many sales a day.
- **How a ride-hailing app sets prices:** surge pricing, the rider's cut, the app's cut.
- **How a cinema makes money:** the ticket mostly goes to the film studio; the popcorn pays the rent.
- **How a free app makes money:** you are not the customer, the advertiser is.

**Business ideas**
- **$100 phone-accessories stall:** buy, price, sell, profit per week.
- **Laundry pickup service:** one scooter, a few regular customers, monthly numbers.
- **Selling home-made frozen food:** batch cost, price per pack, weekend sales.
- **$20 phone-photo service for small shops:** take product photos for online sellers.
- **Sneaker cleaning by pickup:** collect shoes from a dorm or office, return them clean next day.
- **$40 ice-tea stand at a school or field:** cups, ice, syrup, price per cup, afternoon sales.

### Made

1 Spare Change · 2 Chapter 1 · 3 Same 24 Hours · 4 Bamboo · 5 Payday Loop · 6 The Snowball ·
7 Your $5 Coffee · 8 $50 Car Wash · 9 Money Leaks · 10 Delivery App · 11 $80 Coffee Bike ·
12 Look Rich or Get Rich · 13 How a Gym Makes Money · 14 $30 Shoe Cleaning · 15 How Bubble Tea Makes Money · 16 $60 Plant Stall
