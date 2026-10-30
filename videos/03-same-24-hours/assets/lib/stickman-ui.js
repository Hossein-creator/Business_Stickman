/* Business Stickman — clean infographic UI: topic chip, steps, cost rows,
 * counters and simple object icons. Load after stickman.js.
 */
(function () {
  const SM = window.SM;
  const { C, E, clamp, lerp, box, circle, rr, glow, mixColor, withA, FONT } = SM;

  // persistent topic chip so the viewer always knows what the video is about
  function topic(ctx, str, y, a = 1, opt = {}) {
    if (a <= 0) return;
    const { size = 26, bg = "rgba(255,255,255,0.08)", fg = C.text, dot = C.amber } = opt;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.font = `800 ${size}px ${FONT}`;
    const w = ctx.measureText(str).width + size * 2.4, h = size * 2;
    const x = SM.W / 2 - w / 2;
    rr(ctx, x, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.10)"; ctx.stroke();
    circle(ctx, x + size * 0.95, y, size * 0.26, dot, 0);
    ctx.fillStyle = fg; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText(str, x + size * 1.55, y + 1);
    ctx.restore();
  }
  // "STEP 1" badge with a title
  function step(ctx, n, title, x, y, k) {
    if (k <= 0) return;
    const sc = E.back(clamp(k));
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.font = `800 26px ${FONT}`;
    const tw = ctx.measureText(title).width;
    const w = 120 + tw + 40;
    rr(ctx, -w / 2, -34, w, 68, 34); ctx.fillStyle = "#1d222d"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.stroke();
    rr(ctx, -w / 2 + 8, -26, 104, 52, 26); ctx.fillStyle = C.amber; ctx.fill();
    ctx.fillStyle = "#2a1c00"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `800 22px ${FONT}`;
    ctx.fillText("STEP " + n, -w / 2 + 60, 1);
    ctx.fillStyle = C.hero; ctx.font = `800 26px ${FONT}`; ctx.textAlign = "left";
    ctx.fillText(title, -w / 2 + 128, 1);
    ctx.restore();
  }
  // a cost/label row: colour swatch, label on the left, amount on the right
  function row(ctx, x, y, w, label, amount, color, k, opt = {}) {
    if (k <= 0) return;
    const { size = 30, strong = false } = opt;
    const e = E.outQuint(clamp(k));
    ctx.save(); ctx.globalAlpha *= clamp(k * 1.6); ctx.translate((1 - e) * 60, 0);
    rr(ctx, x, y - 32, w, 64, 18); ctx.fillStyle = strong ? withA(color, 0.18) : "rgba(255,255,255,0.05)"; ctx.fill();
    if (strong) { ctx.lineWidth = 3; ctx.strokeStyle = withA(color, 0.8); ctx.stroke(); }
    circle(ctx, x + 32, y, 12, color, 0);
    ctx.font = `800 ${size}px ${FONT}`; ctx.textBaseline = "middle";
    ctx.fillStyle = strong ? color : C.text; ctx.textAlign = "left"; ctx.fillText(label, x + 58, y + 1);
    ctx.fillStyle = strong ? color : C.hero; ctx.textAlign = "right"; ctx.fillText(amount, x + w - 22, y + 1);
    ctx.restore();
  }
  // big centred number with a small caption
  function bigNumber(ctx, str, caption, x, y, a, opt = {}) {
    if (a <= 0) return;
    const { size = 96, color = C.amber, glowA = 0.5 } = opt;
    ctx.save(); ctx.globalAlpha *= a;
    if (glowA > 0) glow(ctx, x, y, size * 3, color, glowA * a);
    SM.text(ctx, str, x, y, { size, color });
    if (caption) SM.label(ctx, caption, x, y + size * 0.72, { size: 22, color: C.label });
    ctx.restore();
  }
  // icons for cost layers etc. (drawn centred, about 60px)
  const ICO = {
    beans: (ctx) => { for (const [dx, dy, r] of [[-12, 4, 15], [12, -6, 15]]) { ctx.save(); ctx.translate(dx, dy); ctx.rotate(0.5); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.75, r, 0, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#7a4a2a"; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.quadraticCurveTo(-5, 0, 0, r * 0.8); ctx.strokeStyle = "#4a2a14"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); } },
    milk: (ctx) => { box(ctx, -16, -18, 32, 42, 4, C.paper, 4); ctx.beginPath(); ctx.moveTo(-16, -18); ctx.lineTo(0, -30); ctx.lineTo(16, -18); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#cfe3f2"; ctx.fill(); box(ctx, -10, -2, 20, 12, 3, "#6fa7ac", 0); },
    cup: (ctx) => { ctx.beginPath(); ctx.moveTo(-16, -20); ctx.lineTo(16, -20); ctx.lineTo(11, 22); ctx.lineTo(-11, 22); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = C.paper; ctx.fill(); box(ctx, -19, -28, 38, 9, 3, "#9aa3b3", 4); },
    shop: (ctx) => { box(ctx, -24, -6, 48, 30, 4, "#3b4252", 4); box(ctx, -28, -22, 56, 16, 5, C.teal, 4); box(ctx, -7, 6, 14, 18, 2, C.amber, 0); },
    staff: (ctx) => { circle(ctx, 0, -14, 10, C.hero, 4); box(ctx, -12, -2, 24, 26, 8, C.hero, 4); },
    bolt: (ctx) => { ctx.beginPath(); ctx.moveTo(4, -26); ctx.lineTo(-14, 4); ctx.lineTo(0, 4); ctx.lineTo(-4, 26); ctx.lineTo(14, -6); ctx.lineTo(0, -6); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#b7a6ff"; ctx.fill(); },
    coin: (ctx) => SM.coin(ctx, 0, 0, 20, 0, 1),
    bucket: (ctx) => { ctx.beginPath(); ctx.moveTo(-24, -18); ctx.lineTo(24, -18); ctx.lineTo(18, 24); ctx.lineTo(-18, 24); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#5b8fd0"; ctx.fill(); ctx.beginPath(); ctx.arc(0, -18, 22, Math.PI, 0); ctx.stroke(); },
    soap: (ctx) => { box(ctx, -14, -12, 28, 38, 8, "#ef8fb5", 4); box(ctx, -6, -24, 12, 14, 3, "#9aa3b3", 4); box(ctx, -8, 0, 16, 10, 3, C.paper, 0); },
    sponge: (ctx) => { box(ctx, -24, -14, 48, 28, 9, "#ffd166", 4); for (let i = 0; i < 5; i++) circle(ctx, -14 + i * 7, -2 + (i % 2) * 6, 2.5, "#c99a2a", 0); },
    cloth: (ctx) => { ctx.save(); ctx.rotate(-0.15); box(ctx, -26, -16, 52, 32, 6, "#6fa7ac", 4); ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-20 + i * 12, -12); ctx.lineTo(-20 + i * 12, 12); ctx.stroke(); } ctx.restore(); },
    spray: (ctx) => { box(ctx, -12, -6, 24, 32, 7, "#7fbf7a", 4); box(ctx, -8, -18, 20, 12, 3, "#3b4252", 4); box(ctx, 10, -18, 12, 6, 2, "#3b4252", 3); },
    play: (ctx) => { box(ctx, -24, -18, 48, 36, 8, "#c9634f", 4); ctx.beginPath(); ctx.moveTo(-6, -9); ctx.lineTo(10, 0); ctx.lineTo(-6, 9); ctx.closePath(); ctx.fillStyle = C.paper; ctx.fill(); },
    scooter: (ctx) => { circle(ctx, -16, 14, 9, "#2b303b", 4); circle(ctx, 18, 14, 9, "#2b303b", 4); box(ctx, -20, -4, 40, 14, 6, C.coral, 4); box(ctx, -26, -20, 22, 18, 4, "#7fbf7a", 4); },
    dumbbell: (ctx) => { box(ctx, -22, -4, 44, 8, 3, "#9aa3b3", 4); box(ctx, -30, -14, 12, 28, 4, "#3b4252", 4); box(ctx, 18, -14, 12, 28, 4, "#3b4252", 4); },
    phoneApp: (ctx) => { box(ctx, -16, -26, 32, 52, 7, "#1d2230", 4); for (let i = 0; i < 4; i++) box(ctx, -10 + (i % 2) * 12, -16 + Math.floor(i / 2) * 14, 8, 8, 2, ["#7d86c9", C.amber, C.teal, C.coral][i], 0); },
    thermos: (ctx) => { box(ctx, -14, -18, 28, 44, 8, "#c9d2de", 4); box(ctx, -10, -28, 20, 12, 4, "#3b4252", 4); box(ctx, -14, 0, 28, 8, 0, C.coral, 0); },
    crate: (ctx) => { box(ctx, -26, -18, 52, 38, 6, "#6b4f3a", 4); ctx.strokeStyle = "#4a3628"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.stroke(); },
    bag: (ctx) => SM.foodBag(ctx, 0, 0, 0.6),
    rider: (ctx) => { circle(ctx, -16, 16, 9, "#2b303b", 4); circle(ctx, 18, 16, 9, "#2b303b", 4); box(ctx, -20, 0, 40, 12, 6, "#3fa36b", 4); circle(ctx, -4, -24, 9, C.hero, 4); box(ctx, -10, -14, 14, 16, 5, C.hero, 0); box(ctx, -30, -18, 18, 18, 4, "#3fa36b", 4); },
    brush: (ctx) => { ctx.save(); ctx.rotate(-0.25); box(ctx, -26, -14, 52, 18, 7, "#a0714a", 4); ctx.strokeStyle = "#3b2a1c"; ctx.lineWidth = 3; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(-21 + i * 6, 6); ctx.lineTo(-21 + i * 6, 20); ctx.stroke(); } ctx.restore(); },
    sign: (ctx) => { ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.moveTo(-16, 26); ctx.lineTo(-8, -6); ctx.moveTo(16, 26); ctx.lineTo(8, -6); ctx.stroke(); box(ctx, -26, -26, 52, 30, 5, C.paper, 4); ctx.font = `800 16px ${SM.FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#2f5a2a"; ctx.fillText("$5", 0, -10); },
    soilbag: (ctx) => { ctx.beginPath(); ctx.moveTo(-22, -24); ctx.lineTo(22, -24); ctx.lineTo(26, 26); ctx.lineTo(-26, 26); ctx.closePath(); ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#7a5a3c"; ctx.fill(); box(ctx, -14, -6, 28, 18, 4, C.green, 0); },
    leaf: (ctx) => { ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.moveTo(0, 26); ctx.lineTo(0, -6); ctx.stroke(); for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 13, -10, 15, 8, d * -0.5, 0, Math.PI * 2); ctx.fillStyle = C.green; ctx.fill(); ctx.stroke(); } },
    tray: (ctx) => { box(ctx, -30, -4, 60, 18, 4, "#3b4252", 4); for (let i = 0; i < 4; i++) box(ctx, -26 + i * 14, -14, 10, 12, 3, "#5a4330", 0); },
    can: (ctx) => { box(ctx, -18, -12, 30, 32, 6, C.teal, 4); ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.moveTo(12, -2); ctx.lineTo(30, -18); ctx.stroke(); ctx.beginPath(); ctx.arc(-3, -12, 12, Math.PI, 0); ctx.stroke(); },
    tag: (ctx) => { ctx.save(); ctx.rotate(-0.2); box(ctx, -24, -14, 48, 28, 6, C.paper, 4); circle(ctx, -14, 0, 4, C.out, 0); ctx.restore(); },
    late: (ctx) => { circle(ctx, 0, 0, 22, C.paper, 4); ctx.lineWidth = 4; ctx.strokeStyle = C.coral; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -13); ctx.moveTo(0, 0); ctx.lineTo(10, 5); ctx.stroke(); },
  };
  function ico(ctx, name, x, y, s = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ICO[name](ctx); ctx.restore(); }

  // shine glint sweeping across a rectangle (for "clean" / "new" moments)
  function glint(ctx, x, y, w, h, k) {
    if (k <= 0 || k >= 1) return;
    ctx.save(); rr(ctx, x, y, w, h, 20); ctx.clip();
    const gx = lerp(x - w * 0.4, x + w * 1.2, k);
    const g = ctx.createLinearGradient(gx - 80, 0, gx + 80, 0);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,0.65)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.translate(gx, y + h / 2); ctx.rotate(0.35); ctx.translate(-gx, -(y + h / 2));
    ctx.fillStyle = g; ctx.fillRect(gx - 80, y - h, 160, h * 3);
    ctx.restore();
  }

  Object.assign(SM, { ui: { topic, step, row, bigNumber, ico, glint } });
})();
