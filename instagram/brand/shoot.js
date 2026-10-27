// Render the brand kit PNGs: node instagram/brand/shoot.js
const { chromium } = require("playwright");
const path = require("path");
const SQUARE = ["avatar", "cover-start", "cover-ideas", "cover-breakdowns", "cover-habits"];
const STORY = ["story-1", "story-2", "story-3"];
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const w of [...SQUARE, ...STORY]) {
    await p.goto("file://" + path.join(__dirname, "brand.html") + "?which=" + w);
    await p.waitForSelector("body[data-ready]");
    await (await p.$("canvas")).screenshot({ path: path.join(__dirname, w + ".png") });
  }
  await b.close();
})();
