---
name: stickman-scene
description: Write or fix the canvas scene (index.html) of a Business Stickman video with the shared SM engine - API cheat sheet, timing helpers, layout rules, known bugs and the snapshot review list. Use when building a new video, adding a prop to shared/lib, or fixing something that looks wrong in a snapshot.
---

# stickman-scene

Every video is one `index.html`: HTML for hook and quote text, one `<canvas id="stage">` for
everything else. `draw(ctx, t)` paints the frame at time `t` and must be a **pure function of
`t`** (no state carried between frames, no `Math.random()`, no `Date.now()`). Use the newest
video (`videos/11-coffee-bike`, `videos/12-look-rich`) as the template.

## File skeleton

- `<html data-composition-variables=...>`: hook1, hook2, quote1, quote2a, quote2b (keyword), brand.
- Scripts in this order: `gsap.min.js`, `stickman.js`, `stickman-props.js`, `stickman-fx.js`,
  `stickman-ui.js` (all from `assets/lib/`).
- `#root` has `data-motion-blur="on" data-motion-blur-events="on"`, `data-duration="22"`.
- `#hook` (0 to ~2.9 s) and `#quote` (18.4 s to the end) are `.lines clip` divs; GSAP animates them.
- `<audio class="clip">` per sound effect, placed exactly on the visible action.
- At the end: `document.fonts.load(...)` then the hook/quote tweens, then
  `SM.mount("stage", DUR, draw, tl); window.__timelines["main"] = tl;`.

## Engine cheat sheet (`window.SM`)

| Need | Use |
|---|---|
| 0→1 between two times | `tw(t, t0, t1, E.out)` (eases: `E.inOut`, `E.out`, `E.back`, ...) |
| Several keyframes | `kf(t, [[t0, v0], [t1, v1], ...], ease)` |
| Maths | `clamp`, `lerp`, `inv`, `mix`, `rng(seed)`, `hash(n)` |
| Shapes | `box`, `circle`, `rr`, `glow`, `withA(hex, a)`, `mixColor` |
| Text on canvas | `label` (small caps, spaced), `text`, `pill` |
| People | `stickman(ctx, {x, y, s, face, pose, color, alpha, glowA})` returns hand/head points; poses in `SM.POSE` (stand, slump, proud, sit, phone, give, reach, cheer, work, wipe, ...); `walk(phase)`, `poseMix(a, b, k)` |
| Scene | `background`, `city`, `groundStrip`, `rain`, `motes`, `vignette`, `grain`, `camera` |
| Props | `coin`, `jar`, `cart`, `signBoard`, `shop`, `phone`, `cup`, `bill`, `icon`, `bench`, `tree`, `thought`, and in props.js `scooter`, `bicycle` (both return the seat point), `foodBag`, `desk`, `laptop`, `chartBoard`, `toast`, `say`, `bamboo`, ... |
| Infographic (`SM.ui`) | `topic(ctx, str, 196, a)`, `step`, `row`, `bigNumber`, `ico(name)`, `glint` |
| Effects (`SM.fx`) | `spring`, `handheld` (always on), `burst`, `ring`, `confetti`, `moneyRain`, `rays`, `flare`, `leak`, `snow`, `speedLines`, `grade` |
| Colours (`SM.C`) | hero `#eef1f6`, others `#9aa3b3`, amber `#ffc23d` (only what matters), coral `#ef6f5e` (bad news), outline `#0d1015` |

Grep before drawing something new: `grep -n "function " shared/lib/*.js`. A prop used in two
videos belongs in `shared/lib/stickman-props.js` (export it in the `Object.assign(SM, {...})` line),
then `./scripts/sync-shared.sh`.

## Layout rules

- 1080 × 1920. **All words between y = 168 and y = 1330.** Below 1330 only scenery and the faint
  watermark (app UI covers it).
- Topic chip at y = 196 from ~3 s until the quote. Hook text block starts at top 250 px.
- One big object in the middle, few elements, lots of air, nothing overlapping.
- Fonts: hook/quote 64–66 px (`.huge` 104 px for a number hook), canvas labels ≥ 22 px,
  footnotes 15 px at 45 % white.
- Money bars and charts: pick one scale (e.g. `$1 = 32 px`) and keep it for the whole video.

## Known traps

- `E.back(0)` is now 0, but always guard a switch with time: `t >= t0 && ...`, not `k > 0`.
- Never run `sync-shared.sh` while a render is running (it deletes `assets/lib` under it).
- No emoji in canvas text (they render as tofu or off-style). Use `UI.ico`.
- A prop that returns an anchor (seat, hand): place the rider/item from the returned point,
  never with guessed offsets.
- Counters are the only linear motion. Everything else eases; entrances long, exits short.
- Remove dead code and no-op calls before the check.

## Snapshot review list

Look at every contact sheet frame and ask:

1. Frame 0: hook readable, subject visible, works as a thumbnail?
2. Any word below y = 1330 or over the top 168 px?
3. Anything overlapping, cut off, or too small to read on a phone?
4. Does anything appear too early (pop before its beat, number already at its final value)?
5. Do the numbers on screen match `business-math` output exactly?
6. Is amber used only for money / the payoff / the keyword?
7. Does the quote stand alone without repeating the picture?
