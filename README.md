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

## Layout

```
shared/            engine shared by every video
  lib/stickman.js    canvas engine: stickman rig, props, atmosphere, camera
  lib/stickman-props.js  rooms, desk work, garden, bamboo, roots, toasts, speech bubbles
  lib/stickman-fx.js     effects: rays, flares, bursts, confetti, money rain, snow, springs, grade
  lib/gsap.min.js    GSAP 3.14.2 (timeline that HyperFrames seeks)
  fonts/             Plus Jakarta Sans
  sfx/               sound effects (Pixabay licence)
videos/<name>/     one HyperFrames project per video (index.html is the film)
renders/           finished MP4s
scripts/sync-shared.sh   copies shared/ into every video project
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
