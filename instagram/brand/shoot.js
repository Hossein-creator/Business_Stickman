// Render the brand kit PNGs: node instagram/brand/shoot.js
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const w of ["avatar", "start", "ideas", "breakdowns", "habits"]) {
    await p.goto("file://" + path.join(__dirname, "brand.html") + "?which=" + w);
    await p.waitForSelector("body[data-ready]");
    await (await p.$("canvas")).screenshot({ path: path.join(__dirname, w + ".png") });
  }
  await b.close();
})();
