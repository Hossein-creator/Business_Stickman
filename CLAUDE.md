# Business Stickman

Faceless stickman shorts made with HyperFrames (HTML + canvas → MP4).

- Follow `STYLE_GUIDE.md` for every new video (niche, formula, colours, timing, safe zone).
- On-screen text is English.
- Shared drawing code lives in `shared/lib/stickman.js`; after editing anything in `shared/`, run
  `./scripts/sync-shared.sh` before checking or rendering a video.
- Each video is a HyperFrames project in `videos/<name>/`; finished files go to `renders/<name>.mp4`
  (1080×1920, 60 fps).
- Commit and push everything (sources and renders) to GitHub; nothing should exist only on the
  machine.

## When the user says "generiere" / "generate"

1. **Research first, always: run `/anthropic-skills:ig-viral`.** Find the reels/shorts that are
   working right now in this niche (motivation, mindset, money, small business; faceless and
   stickman/animation accounts), rank them by outlier multiple (views ÷ the account's own median)
   and name the hook formulas that over-index.
   - Capture rows in `research/captured.tsv`, rank with
     `python3 scripts/rank_swipe.py research/captured.tsv --out research/swipe.md`, and also copy
     the result to `~/.claude/instagram/swipe.md` (where the other ig-* skills read it).
   - Read only, at human speed, through the user's own browser: never log in, never scrape, copy
     the formula and never the video.
   - If no browser is available or the network blocks Instagram/YouTube, say so and ask the user
     to paste account, followers, median, views and hook for 10–40 videos. If they skip it, use
     the latest `research/swipe.md` and say how old it is.
   - Formulas last a season: a swipe file younger than about a month can be reused.
   - **Also look outside the niche, always:** take the most successful shorts of any topic
     (sort YouTube search by view count, shorts ≤ 70 s; e.g. "animation #shorts",
     "life lesson #shorts") and turn their formula into our niche: same hook shape, structure,
     length and payoff, but our own money/business story and our own visuals. Copy the formula,
     never the video. Save the data in `research/` and the findings in `research/swipe.md`.
   - Pick the idea that has the best chance of being the most viral video, and that teaches a
     real, useful lesson.
2. **Pick the topic:** start from the open list in `STYLE_GUIDE.md` ("Video ideas"), not from
   scratch, and give it the strongest formula from the research. When making several videos,
   mix the three kinds (mindset & money habits, business models, business ideas) and include at
   least one with the core themes (gratitude, comparison, everyday characters). Move made ideas to
   "Made" and add new ideas from the research to the open list.
3. **Story:** follow `STYLE_GUIDE.md`: a hook that speaks to "you" and names the topic in frame 0,
   a topic chip, a build-up with real numbers, a big payoff, a short quote. Videos 5, 6 and 7 are
   the benchmark.
4. **Build:** copy a project to `videos/NN-<name>/`, write the scene in `index.html`, add new props
   to `shared/lib/stickman.js`, then `./scripts/sync-shared.sh`.
5. **Check:** `hyperframes check`, then snapshots at the key moments; look at them and fix.
6. **Render** to `renders/NN-<name>.mp4` (60 fps, delivery quality), commit, push, and show the
   videos in the session. GitHub refuses files over 100 MB: if a render is above ~90 MB, render
   again with `--crf 20` (or higher) before committing.
