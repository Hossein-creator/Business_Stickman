# Business Stickman

Faceless stickman short videos (TikTok, Instagram Reels, YouTube Shorts) about mindset, money
and small business, written as code with [HyperFrames](https://hyperframes.heygen.com) and
rendered to MP4.

The style, audience and video formula are in **[STYLE_GUIDE.md](STYLE_GUIDE.md)**.

## Videos

| # | Video | Story | Quote |
|---|---|---|---|
| 1 | [`renders/01-spare-change.mp4`](renders/01-spare-change.mp4) | *Spend first* vs. *save first*: $5 a day for 365 days. One gets a pile of bills, the other a jar of $1,825 that becomes an iced-tea cart. | "Spare change today. Starting **capital** tomorrow." |
| 2 | [`renders/02-chapter-one.mp4`](renders/02-chapter-one.mp4) | A new coffee seller envies the packed noodle stall. Rewind 10 years: the owner started alone in the rain, lost money, closed, tried again. | "Don't compare your **chapter 1** to their chapter 10." |

## Layout

```
shared/            engine shared by every video
  lib/stickman.js    canvas engine: stickman rig, props, atmosphere, camera
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
