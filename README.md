# Business Stickman

Faceless stickman short videos (TikTok, Instagram Reels, YouTube Shorts) about mindset, money
and small business, written as code with [HyperFrames](https://hyperframes.heygen.com) and
rendered to MP4.

The style, audience and video formula are in **[STYLE_GUIDE.md](STYLE_GUIDE.md)**.

## Videos

Videos 1–4 run 18 s; from video 5 on they run 22 s, slower, with motion blur and the effects layer.

| # | Video | Story | Quote |
|---|---|---|---|
| 1 | [`renders/01-spare-change.mp4`](renders/01-spare-change.mp4) | *Spend first* vs. *save first*: $5 a day for 365 days. One gets a pile of bills, the other a jar of $1,825 that becomes an iced-tea cart. | "Spare change today. Starting **capital** tomorrow." |
| 2 | [`renders/02-chapter-one.mp4`](renders/02-chapter-one.mp4) | A new coffee seller envies the packed noodle stall. Rewind 10 years: the owner started alone in the rain, lost money, closed, tried again. | "Don't compare your **chapter 1** to their chapter 10." |
| 3 | [`renders/03-same-24-hours.mp4`](renders/03-same-24-hours.mp4) | A building cut open: upstairs one scrolls every night, downstairs one builds. Both spend 1,460 hours in a year. One gets a dead battery, the other a sunrise and his first orders. | "Everyone gets 24 hours. Not everyone **uses** them." |
| 4 | [`renders/04-bamboo.mp4`](renders/04-bamboo.mp4) | He waters a seed for 4 years while people laugh. Nothing grows. The camera dives underground: 4 years of roots. Then the bamboo shoots up 27 m in 6 weeks. | "No results yet doesn't mean no **progress**." |
| 5 | [`renders/05-payday-loop.mp4`](renders/05-payday-loop.mp4) | Payday feels rich, day 29 is instant noodles under a rain cloud. Pull back: he runs in a hamster wheel made of days, and the years spin by. Loops seamlessly into frame 0. | "No plan for your money? Every month is the **same month.**" |
| 6 | [`renders/06-snowball.mp4`](renders/06-snowball.mp4) | $100 a month rolls down a snowy mountain and grows to $149,036 in 30 years (8% example). A picture-in-picture shows someone who starts 10 years later: $58,902. | "Start small. But start **now.**" |
| 7 | [`renders/07-coffee-money.mp4`](renders/07-coffee-money.mp4) | You pay $5 for a latte: the cup fills with every cost (beans, milk, cup, rent, staff, power) until only $0.60 profit is left. To make $3,000 a month the café must sell 167 cups a day. | "Revenue is vanity. **Profit** is sanity." |
| 8 | [`renders/08-car-wash.mp4`](renders/08-car-wash.mp4) | Got $50? Buy a car-wash kit, wash a car for $10, repeat: $55 a day, $440 a month on weekends only. | "You don't need a lot of money. You need a **first customer.**" |
| 9 | [`renders/09-money-leaks.mp4`](renders/09-money-leaks.mp4) | Your salary pours into a jar that leaks $115 a month (streaming, delivery fees, gym, apps, late fees): $21,039 in 10 years if invested. Plug the holes and the jar fills. | "Small leaks sink big ships. Check yours **tonight.**" |
| 10 | [`renders/10-delivery-app.mp4`](renders/10-delivery-app.mp4) | You pay $12.50 for a delivery order: the money flows to the restaurant ($8.00), the rider ($1.60) and the app ($2.90, 23%). Times 2 million orders a day. | "The one who connects **collects.**" |
| 11 | [`renders/11-coffee-bike.mp4`](renders/11-coffee-bike.mp4) | Got $80 and a bike? Buy the kit, sell a $1 cup with $0.65 profit, 40 cups at the 6 a.m. bus stop: $26 a day, $624 a month. | "The city wakes up at 6. Be there with **coffee.**" |
| 12 | [`renders/12-look-rich.mp4`](renders/12-look-rich.mp4) | Same $100 a month: one pays off phones on installments, the other saves for a year and buys a coffee cart. After 2 years: $700 of used phones vs. $3,600 a year. | "You can look rich, or **get rich.**" |
| 13 | [`renders/13-gym-money.mp4`](renders/13-gym-money.mp4) | You pay $20 for the gym. Month by month the gym empties, but 1,000 members keep paying $20,000 a month. Where the $20 goes (profit $6), then 1,000 members vs. room for 100: $6,000 a month. | "They sell you the plan. You have to **show up.**" |
| 14 | [`renders/14-shoe-cleaning.mp4`](renders/14-shoe-cleaning.mp4) | Got $30? A $30 kit (brushes, cleaner, cloths, bucket, sign), one dirty sneaker brushed clean for $5 ($4.60 profit), 8 pairs on a Saturday ($36.80), weekends only: $294 a month. | "Every dirty shoe you see is a **customer.**" |
| 15 | [`renders/15-bubble-tea.mp4`](renders/15-bubble-tea.mp4) | You pay $4 for bubble tea. The cup fills layer by layer with every cost (pearls, tea and milk, syrup, cup, rent, staff, power): $0.70 profit. To make $3,000 a month: 143 cups every day. | "Busy is not the same as **profitable.**" |
| 16 | [`renders/16-plant-stall.mp4`](renders/16-plant-stall.mp4) | Got $60? A $60 kit (soil, cuttings, tray, can, labels; pots recycled), 3 weeks of growth from day 1 to day 21, $2.30 profit per $3 plant, 12 plants on a Saturday ($27.60), weekends only: $220 a month. | "Everything big starts as a **seed.**" |
| 17 | [`renders/17-waiting-for-money.mp4`](renders/17-waiting-for-money.mp4) | You're waiting for $10,000, he started with $10. Split screen over the same 1,095 days: one waits on a bench, the other goes from a crate of iced tea to a cart to a tea house. | "You don't need more money. You need to **start.**" |

## Layout

```
shared/            engine shared by every video
  lib/stickman.js    canvas engine: stickman rig, props, atmosphere, camera
  lib/stickman-props.js  rooms, desk work, garden, bamboo, roots, toasts, speech bubbles, scooter, bicycle
  lib/stickman-ui.js     clean infographic UI: topic chip, steps, cost rows, big numbers, icons
  lib/stickman-fx.js     effects: rays, flares, bursts, confetti, money rain, snow, springs, grade
  lib/gsap.min.js    GSAP 3.14.2 (timeline that HyperFrames seeks)
  fonts/             Plus Jakarta Sans
  sfx/               sound effects (Pixabay licence)
videos/<name>/     one HyperFrames project per video (index.html is the film)
renders/           finished MP4s + paste-ready captions (NN-name.caption.txt)
scripts/sync-shared.sh   copies shared/ into every video project
scripts/caption_lint.py  checks a caption (first 125 chars, 1 ask, ≤ 5 hashtags, no links)
scripts/send_telegram.py sends videos + captions to the Telegram bot (token from env)
.claude/skills/          project skills: generiere, stickman-scene, business-math (calc.py)
```

## Working on a video

Requirements: Node 22+ and FFmpeg. The HyperFrames CLI runs through `npx`.

```bash
./scripts/sync-shared.sh                   # after changing anything in shared/
cd videos/01-spare-change
npx hyperframes preview                    # live preview in the browser
npx hyperframes check                      # lint + layout checks
npx hyperframes snapshot --at 0,6,12,16    # still frames to review
npx hyperframes render --fps 60 --quality delivery -o ../../renders/01-spare-change.mp4
```

Text (hook, quote, watermark) is set by variables at the top of each `index.html`, so you can also
render a variant without editing code:

```bash
npx hyperframes render --variables '{"hook1":"$3 a day."}' -o ../../renders/variant.mp4
```
