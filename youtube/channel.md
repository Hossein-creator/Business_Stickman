# YouTube channel setup

Same brand as Instagram (`instagram/profile.md`). Set everything in YouTube Studio →
Customization. Nothing is posted automatically.

## 1. Name and handle

- Name: `Business Stickman`
- Handle, in this order: `@businessstickman`, `@business.stickman`, `@thebusinessstickman`

## 2. Pictures

| What | File | Size |
|---|---|---|
| Profile picture | `instagram/brand/avatar.png` | 1080 × 1080 (shown as a circle) |
| Banner | `instagram/brand/yt-banner.png` | 2560 × 1440, text inside the 1546 × 423 middle that every device shows |
| Video watermark | `instagram/brand/avatar.png` | optional, "end of video" |

Rebuild the banner with `node instagram/brand/shoot.js`.

## 3. Description (Customization → Basic info)

```
Business ideas you can start small, with real numbers.

Every Short is one stickman story about money:
- Business ideas: what it costs to start, what you earn per day and per month
- Breakdowns: how a coffee shop, a gym or a delivery app really makes money
- Money habits: small habits that add up over the years

New Shorts every day. Subscribe if you want to start something of your own.

Numbers are examples with honest assumptions, not financial advice.
```

## 4. Keywords (Settings → Channel → Basic info)

```
business ideas, small business ideas, side hustle, how businesses make money, business model, money habits, personal finance, stickman, stickman animation, passive income, start a business, entrepreneur
```

Also set: country, "No, it's not made for kids", and a channel trailer is not needed for a
Shorts channel.

## 5. Shorts titles (≤ 60 characters, no #shorts needed)

Description of each Short = its `renders/NN-<name>.caption.txt`. Same order and times as
`POSTING.md`.

| Video | Title |
|---|---|
| 08 | Start a Car Wash With $50 This Weekend |
| 07 | Where Your $5 Coffee Money Really Goes |
| 01 | $5 a Day for a Year: Spend It or Keep It? |
| 11 | $80 Coffee Bike Business Idea |
| 10 | How Delivery Apps Make Money From Your Order |
| 05 | Why You Are Broke Every Month |
| 13 | How Gyms Make Money From People Who Never Come |
| 12 | Look Rich or Get Rich? Same $100 a Month |
| 04 | The Bamboo Lesson: 4 Years of Nothing |
| 06 | $100 a Month for 30 Years |
| 09 | 5 Money Leaks Draining Your Account |
| 02 | His Stall Is Packed, Yours Is Empty |
| 03 | Same 24 Hours, Two Different Years |

## 6. Home page and playlists

Three playlists, same as the Instagram highlights:

- **Business Ideas**: 08, 11
- **How Businesses Make Money**: 07, 10, 13
- **Money Habits**: 01, 02, 03, 04, 05, 06, 09, 12

Home page sections: Shorts (popular), then the three playlists. Add every new Short to its
playlist the day it goes up.

## 7. Every upload

- Title from the table, description = caption file, 3 to 5 hashtags already inside it.
- Audience: not made for kids. Category: Education.
- Comment on your own Short with one question (e.g. "Would you start this?") and pin it.
