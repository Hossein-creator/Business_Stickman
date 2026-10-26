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
