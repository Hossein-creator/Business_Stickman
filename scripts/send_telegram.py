#!/usr/bin/env python3
"""Send finished videos with their captions to Telegram.

Usage: python3 scripts/send_telegram.py renders/13-gym-money.mp4 [more.mp4 ...]

Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment (never commit the token).
The caption comes from renders/NN-<name>.caption.txt next to the video. Bots may upload at most
50 MB, so bigger videos are re-encoded to a temporary copy first; the file in renders/ stays as is.
"""
import json, os, subprocess, sys, tempfile

LIMIT = 49 * 1024 * 1024        # stay under the 50 MB bot upload limit
CAPTION_MAX = 1024              # Telegram media caption limit

token, chat = os.environ.get("TELEGRAM_BOT_TOKEN"), os.environ.get("TELEGRAM_CHAT_ID")
if not token or not chat:
    sys.exit("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID first.")
api = f"https://api.telegram.org/bot{token}/"


def call(method, *form):
    fields = [arg for f in form for arg in ("-F", f)]
    out = subprocess.run(["curl", "-sS", api + method, "-F", f"chat_id={chat}", *fields],
                         capture_output=True, text=True).stdout
    res = json.loads(out or "{}")
    if not res.get("ok"):
        sys.exit(f"{method} failed: {res.get('description', out)}")
    return res


def shrink(path, tmp):
    """Re-encode to fit under LIMIT (same size and fps, lower bitrate)."""
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", path], capture_output=True, text=True).stdout)
    kbps = int(LIMIT * 8 * 0.92 / dur / 1000) - 160
    out = os.path.join(tmp, os.path.basename(path))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path, "-c:v", "libx264", "-preset", "slow",
                    "-b:v", f"{kbps}k", "-maxrate", f"{kbps}k", "-bufsize", f"{kbps * 2}k",
                    "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
                    out], check=True)
    return out


with tempfile.TemporaryDirectory() as tmp:
    for video in sys.argv[1:]:
        cap_path = video[:-4] + ".caption.txt"
        caption = open(cap_path, encoding="utf-8").read().strip() if os.path.exists(cap_path) else ""
        send = video if os.path.getsize(video) <= LIMIT else shrink(video, tmp)
        form = [f"video=@{send}", "supports_streaming=true", "width=1080", "height=1920"]
        if caption and len(caption) <= CAPTION_MAX:
            form.append(f"caption=<{cap_path}")
        call("sendVideo", *form)
        if caption and len(caption) > CAPTION_MAX:
            call("sendMessage", f"text=<{cap_path}")
        print("sent", video, "(re-encoded)" if send != video else "")
