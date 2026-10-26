#!/usr/bin/env python3
"""Lint an Instagram/TikTok caption: visible first line, hashtags, asks, links, emoji, AI tells."""
import re, sys

SLOP = ["delve", "unlock", "elevate", "game-changer", "game changer", "dive in", "journey", "leverage", "seamless", "in today's"]
ASKS = [r"\bsave (this|it)\b", r"\bcomment\b", r"\bdm\b", r"\bshare (this|it)\b", r"\bfollow\b", r"\btag\b", r"\blink in bio\b"]

for path in sys.argv[1:]:
    text = open(path, encoding="utf-8").read().strip()
    tags = re.findall(r"#\w+", text)
    body = re.sub(r"#\w+", "", text)
    asks = sum(len(re.findall(p, body, re.I)) for p in ASKS)
    emoji = len(re.findall(r"[\U0001F300-\U0001FAFF☀-➿]", text))
    fails, warns = [], []
    if len(text) > 2200: fails.append(f"{len(text)} chars, limit 2,200")
    if len(tags) > 5: fails.append(f"{len(tags)} hashtags, limit 5")
    if asks != 1: fails.append(f"{asks} asks, want exactly 1")
    if re.search(r"https?://|www\.", text): fails.append("link in caption")
    if "—" in text or "–" in text: fails.append("em/en dash")
    if text[:1] in "#" or re.match(r"[\U0001F300-\U0001FAFF]", text): fails.append("starts with hashtag/emoji")
    for w in SLOP:
        if w in text.lower(): warns.append(f"slop word: {w}")
    if emoji * 100 > 4 * max(1, len(text)): warns.append("too many emoji")
    print(f"{path}\n  visible: {text[:125]!r}\n  first line {len(text.splitlines()[0])} chars, {len(tags)} hashtags, {asks} ask(s), {len(text)} chars total")
    for f in fails: print("  FAIL", f)
    for w in warns: print("  WARN", w)
    print("  READY" if not fails else "  NOT READY")
