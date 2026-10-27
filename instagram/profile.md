# Instagram profile setup (new account)

The new account for this repo's videos (business ideas, business models, money mindset).
Everything below is copy-ready. Nothing is posted automatically; set each field in the app.

## 1. Handle

Use the name that is already on every video: the watermark says **BUSINESS STICKMAN**, so a
viewer who wants more searches for exactly that. Try in this order (Instagram shows if it is free):

1. `@business.stickman`
2. `@businessstickman`
3. `@the.business.stickman`
4. `@stickman.business`

## 2. Name field (30 characters, Instagram search reads it)

Recommended:

```
Business Ideas | Stickman
```

Other options: `Business & Money | Stickman` (27), `Small Business Ideas` (20).
The name can only be changed twice in 14 days, so pick once.

## 3. Bio (150 characters)

```
Business ideas you can start small, with real numbers.
How everyday businesses make money.
3 new stickman videos a day.
```

119 characters. Line 1 says what you get, line 2 the second kind of video, line 3 why to follow.

## 4. Profile picture

`instagram/brand/avatar.png`: the hero stickman holding out a gold coin on the night background,
same look as the videos. Reads at small size inside the circle.

## 5. Account settings

- Switch to a **professional account → Creator**, category **Education**. Hide the category label
  if you prefer a clean profile.
- Public account. No link for now: one link that leads nowhere useful is worse than none. Add one
  later when there is something to give (e.g. a free list of business ideas with numbers).

## 6. The first nine posts (the grid a new visitor sees)

Three a day at the times in `POSTING.md`. Two of every three are business ideas or models.

| Day | 1st slot | 2nd slot | 3rd slot |
|---|---|---|---|
| 1 | 08 $50 Car Wash | 07 Your $5 Coffee | 01 Spare Change |
| 2 | 11 Coffee Bike | 10 Delivery App | 05 Payday Loop |
| 3 | 13 Gym Money | 12 Look Rich | 04 Bamboo |

Then 06 Snowball, 09 Money Leaks, 02 Chapter One, 03 Same 24 Hours, then new videos.
Captions: `renders/NN-<name>.caption.txt`.

**Cover for every reel:** in "Edit cover", pick the frame at about **1.5 s**: both hook lines are
on screen and they sit inside the 3:4 grid crop. Keep "Share to feed" on.

## 7. Pinned three

Pin one of each kind, the user's favourites:

1. **08 $50 Car Wash**: a business idea (what this account gives you)
2. **07 Your $5 Coffee**: a business model (how businesses make money)
3. **01 Spare Change**: the mindset side

After two weeks, swap in the reel with the most saves and shares.

## 8. Highlights (four, named for what a visitor wants)

| Name | Cover | What goes in |
|---|---|---|
| Start here | `brand/cover-start.png` | the 3 stories `brand/story-1.png`, `story-2.png`, `story-3.png` (welcome, the 3 kinds of videos, "save the idea you want to start") |
| Ideas | `brand/cover-ideas.png` | every business-idea reel shared to story (car wash, coffee bike, ...) |
| Breakdowns | `brand/cover-breakdowns.png` | every business-model reel (coffee, delivery app, gym, ...) |
| Habits | `brand/cover-habits.png` | mindset and money-habit reels |

Share each new reel to your story the day it goes up, then add it to the matching highlight.
Covers are rebuilt with `node instagram/brand/shoot.js` (drawn with the video engine).

## Score

An empty account scores 0. With all of the above in place it reaches about **70/100**. The rest
cannot be written: it needs reels with proven saves in the pinned slots, a daily story habit, and
later one link with a real offer.
