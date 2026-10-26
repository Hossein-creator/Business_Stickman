# Research

Step 1 of every new video (`/anthropic-skills:ig-viral`): what is working right now in the niche.

- `captured.tsv`: one row per reel/short (account, followers, median, views, hook, length, cta).
  `median` is the middle view count of that account's last ~12 videos.
- `swipe.md`: the ranked result:
  `python3 scripts/rank_swipe.py research/captured.tsv --out research/swipe.md`

Rank by **outlier multiple** (views ÷ the account's own median), never by raw views. Above 3x is a
signal. Collect accounts within about 10x of our own size, plus a few bigger ones for format only.
Copy the formula (hook shape, structure, length), never the video.
