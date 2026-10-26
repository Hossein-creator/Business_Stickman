/* Business Stickman — extra props and poses (rooms, desk work, garden, growth).
 * Load after stickman.js. Same rule: everything is a pure function of time.
 */
(function () {
  const SM = window.SM;
  const { C, E, clamp, lerp, rng, box, circle, rr, glow, mixColor, withA, FONT } = SM;

  Object.assign(SM.POSE, {
    sitPhone: { lean: 0.22, head: 0.55, aB: [0.5, 2.4], aF: [0.7, 2.6], lB: [1.5, 0.05], lF: [1.42, -0.05], seat: true },
    sitWork: { lean: 0.12, head: 0.2, aB: [0.75, 1.55], aF: [0.95, 1.6], lB: [1.5, 0.05], lF: [1.42, -0.05], seat: true },
    water: { lean: 0.15, head: 0.35, aB: [0.25, 0.15], aF: [1.05, 1.5], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    lookUp: { lean: -0.12, head: -0.75, aB: [0.25, 0.15], aF: [-0.15, -0.05], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    point: { lean: -0.05, head: -0.05, aB: [0.3, 0.6], aF: [1.9, 2.0], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    laugh: { lean: -0.2, head: -0.35, aB: [0.6, 1.9], aF: [0.5, 1.8], lB: [0.16, 0.02], lF: [-0.12, -0.02] },
  });

  // ---- rooms ----
  // window with a sky: night 0..1 -> dawn (amber) via `dawn`
  function windowSky(ctx, x, y, w, h, t, dawn = 0, rain = 0) {
    box(ctx, x - 8, y - 8, w + 16, h + 16, 10, "#2b303b", 6);
    ctx.save(); rr(ctx, x, y, w, h, 6); ctx.clip();
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, mixColor("#141a2a", "#ff9f5a", dawn * 0.85));
    g.addColorStop(1, mixColor("#1f2638", "#ffd27a", dawn));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    if (dawn < 1) { ctx.globalAlpha = 1 - dawn; circle(ctx, x + w * 0.7, y + h * 0.3, 16, "#f3ecd2", 0); ctx.globalAlpha = 1; }
    if (dawn > 0) { SM.glow(ctx, x + w * 0.5, y + h, w, "#ffd27a", dawn); circle(ctx, x + w * 0.5, y + h - 10 + (1 - dawn) * 40, 26, "#ffe29a", 0); }
    // skyline
    ctx.fillStyle = mixColor("#0e121b", "#5a3a2a", dawn * 0.5);
    const r = rng(41); let bx = x - 10;
    while (bx < x + w) { const bw = 18 + r() * 26, bh = 20 + r() * 60; ctx.fillRect(bx, y + h - bh, bw, bh); bx += bw + 3; }
    if (rain > 0) {
      ctx.strokeStyle = `rgba(200,215,235,${0.35 * rain})`; ctx.lineWidth = 2;
      for (let i = 0; i < 18; i++) { const rr2 = rng(i + 3); const ry = (rr2() * h + t * 600) % h; const rx = x + rr2() * w; ctx.beginPath(); ctx.moveTo(rx, y + ry); ctx.lineTo(rx - 4, y + ry + 14); ctx.stroke(); }
    }
    ctx.restore();
    // cross bars
    ctx.fillStyle = "#2b303b"; ctx.fillRect(x + w / 2 - 3, y, 6, h); ctx.fillRect(x, y + h / 2 - 3, w, 6);
  }
  function bed(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -150, -70, 300, 50, 10, "#5c6a8a", 6);          // mattress + blanket
    box(ctx, -150, -86, 90, 30, 12, C.paper, 6);             // pillow
    box(ctx, -160, -110, 18, 110, 6, C.woodDark, 6);         // headboard
    box(ctx, -160, -26, 320, 18, 6, C.wood, 6);              // frame
    box(ctx, -150, -10, 14, 10, 3, C.woodDark, 0); box(ctx, 136, -10, 14, 10, 3, C.woodDark, 0);
    ctx.restore();
  }
  function desk(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -130, -110, 260, 18, 6, C.wood, 6);
    box(ctx, -120, -94, 14, 94, 4, C.woodDark, 5); box(ctx, 106, -94, 14, 94, 4, C.woodDark, 5);
    box(ctx, 40, -92, 66, 50, 6, C.woodDark, 5);
    ctx.restore();
  }
  function chair(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -40, -62, 80, 14, 5, "#3b4252", 5);
    box(ctx, -6, -48, 12, 40, 3, "#2b303b", 4);
    box(ctx, -34, -10, 68, 10, 4, "#2b303b", 4);
    box(ctx, -46, -150, 14, 100, 5, "#3b4252", 5);
    ctx.restore();
  }
  // laptop on a desk top at (x, y = desk surface); screen glow; facing left (towards the worker)
  function laptop(ctx, x, y, s = 1, screenA = 0.6, color = "#8fc7ff") {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (screenA > 0) glow(ctx, -10, -50, 160, color, screenA * 0.6);
    ctx.beginPath(); ctx.moveTo(-8, -6); ctx.lineTo(22, -92); ctx.lineTo(34, -88); ctx.lineTo(8, -2); ctx.closePath();
    ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#3a4152"; ctx.fill();
    box(ctx, -70, -10, 90, 10, 4, "#4a5266", 5);
    ctx.restore();
  }
  function deskLamp(ctx, x, y, s = 1, on = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (on > 0) glow(ctx, -40, 0, 260, C.amber, on * 0.8);
    box(ctx, -20, -8, 40, 8, 3, "#2b303b", 4);
    ctx.lineWidth = 7; ctx.strokeStyle = C.out; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(10, -70); ctx.lineTo(-30, -100); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = "#3b4252"; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-58, -92); ctx.lineTo(-20, -116); ctx.lineTo(-10, -96); ctx.closePath();
    ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = mixColor("#4a5266", C.amber, on * 0.6); ctx.fill();
    ctx.restore();
  }
  function books(ctx, x, y, n, s = 1) {
    const cols = ["#c9634f", "#6fa7ac", "#e0b25a", "#7d86c9", "#7fbf7a"];
    for (let i = 0; i < n; i++) { const r = rng(i * 3 + 1); box(ctx, x - 34 + (r() - 0.5) * 8, y - (i + 1) * 13 * s, 68 * s, 12 * s, 3, cols[i % 5], 4); }
  }
  // wall board with a line chart; prog 0..1 reveals points; glowA for the payoff
  function chartBoard(ctx, x, y, w, h, prog, glowA = 0) {
    box(ctx, x, y, w, h, 10, "#e9e5da", 6);
    ctx.save(); rr(ctx, x + 12, y + 12, w - 24, h - 24, 6); ctx.clip();
    const n = 9, pts = [];
    for (let i = 0; i < n; i++) { const k = i / (n - 1); const r = rng(i + 7); pts.push([x + 22 + k * (w - 44), y + h - 24 - (Math.pow(k, 1.8) * 0.85 + r() * 0.05) * (h - 48)]); }
    const upto = prog * (n - 1);
    ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = glowA > 0 ? mixColor("#2f6a70", C.amberDeep, glowA) : "#2f6a70";
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= Math.floor(upto); i++) ctx.lineTo(pts[i][0], pts[i][1]);
    const fi = Math.floor(upto), fk = upto - fi;
    if (fi < n - 1) ctx.lineTo(lerp(pts[fi][0], pts[fi + 1][0], fk), lerp(pts[fi][1], pts[fi + 1][1], fk));
    ctx.stroke();
    ctx.restore();
  }
  function heart(ctx, x, y, s, a = 1, col = C.coral) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-22, -8, -10, -24, 0, -12); ctx.bezierCurveTo(10, -24, 22, -8, 0, 8); ctx.closePath();
    ctx.lineWidth = 4; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = col; ctx.fill();
    ctx.restore();
  }
  // notification card (e.g. "NEW ORDER +$49")
  function toast(ctx, x, y, str, k, opt = {}) {
    if (k <= 0) return;
    const { col = C.amber, w = 300 } = opt;
    const sc = E.back(clamp(k));
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
    glow(ctx, 0, 0, w * 0.7, col, 0.5 * clamp(k));
    box(ctx, -w / 2, -34, w, 68, 18, "#232834", 5);
    circle(ctx, -w / 2 + 36, 0, 16, col, 4);
    ctx.font = `800 26px ${FONT}`; ctx.fillStyle = C.hero; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText(str, -w / 2 + 64, 2);
    ctx.restore();
  }
  // speech bubble with text (rounded, tail toward `from`)
  function say(ctx, x, y, str, k, from, opt = {}) {
    if (k <= 0) return;
    const { size = 28, fill = C.paper, color = "#1d2230" } = opt;
    ctx.save();
    ctx.font = `800 ${size}px ${FONT}`;
    const w = ctx.measureText(str).width + 44, h = size + 36;
    const sc = E.back(clamp(k));
    ctx.translate(x, y); ctx.scale(sc, sc);
    ctx.beginPath(); ctx.moveTo(-10, h / 2 - 4); ctx.lineTo((from[0] - x) * 0.35, (from[1] - y) * 0.35); ctx.lineTo(14, h / 2 - 4); ctx.closePath();
    ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = fill; ctx.fill();
    box(ctx, -w / 2, -h / 2, w, h, h / 2, fill, 6);
    ctx.beginPath(); ctx.moveTo(-8, h / 2 - 6); ctx.lineTo((from[0] - x) * 0.35, (from[1] - y) * 0.35); ctx.lineTo(12, h / 2 - 6); ctx.fillStyle = fill; ctx.fill();
    ctx.fillStyle = color; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(str, 0, 2);
    ctx.restore();
  }

  // ---- garden / growth ----
  function wateringCan(ctx, x, y, s = 1, tilt = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.scale(s, s);
    box(ctx, -26, -24, 52, 44, 10, C.teal, 5);
    ctx.lineWidth = 9; ctx.strokeStyle = C.out; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(22, 4); ctx.lineTo(58, -22); ctx.stroke();
    ctx.lineWidth = 4; ctx.strokeStyle = C.tealDark; ctx.stroke();
    box(ctx, 52, -32, 16, 14, 4, C.tealDark, 4);
    ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.arc(-4, -26, 16, Math.PI, 0); ctx.stroke();
    ctx.restore();
  }
  // bamboo stalk from (x, groundY) up to height h; leaves fill in with growth
  function bamboo(ctx, x, groundY, h, t, glowA = 0) {
    if (h <= 2) return;
    const seg = 120, w = 30;
    ctx.save();
    if (glowA > 0) glow(ctx, x, groundY - Math.min(h, 900) * 0.5, 600, "#b7f0a0", glowA * 0.5);
    const sway = (yy) => Math.sin(t * 1.4 + yy * 0.004) * Math.min(1, (groundY - yy) / 1500) * 18;
    // stalk as stacked segments
    for (let y0 = groundY, i = 0; y0 > groundY - h; y0 -= seg, i++) {
      const y1 = Math.max(groundY - h, y0 - seg);
      const sx0 = x + sway(y0), sx1 = x + sway(y1);
      const ww = w * (1 - (groundY - y0) / 9000);
      ctx.beginPath(); ctx.moveTo(sx0 - ww / 2, y0); ctx.lineTo(sx1 - ww / 2 + 1, y1); ctx.lineTo(sx1 + ww / 2 - 1, y1); ctx.lineTo(sx0 + ww / 2, y0); ctx.closePath();
      ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = i % 2 ? "#8fcf86" : "#86c77d"; ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(sx0 + ww * 0.1, y1, ww * 0.35, y0 - y1);
      if (y1 > groundY - h + 2) box(ctx, sx1 - ww / 2 - 4, y1 - 5, ww + 8, 10, 4, "#5f9a58", 4);
      // leaves on upper nodes
      if (i >= 2) {
        const r = rng(i * 11 + 5), side = i % 2 ? 1 : -1, lk = clamp((groundY - y1 - 200) / 300);
        for (let L = 0; L < 2; L++) {
          ctx.save(); ctx.translate(sx1 + side * ww / 2, y1 + 4); ctx.rotate(side * (0.5 + L * 0.35 + Math.sin(t * 2 + i) * 0.06)); ctx.scale(side * lk, lk);
          ctx.beginPath(); ctx.ellipse(48, 0, 50, 13, 0, 0, Math.PI * 2);
          ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = L ? "#7fbf7a" : "#9ad48f"; ctx.fill();
          ctx.restore();
        }
      }
    }
    // tip shoot
    const tx = x + sway(groundY - h), ty = groundY - h;
    ctx.beginPath(); ctx.moveTo(tx - 12, ty + 4); ctx.quadraticCurveTo(tx, ty - 50, tx + 6, ty - 64); ctx.quadraticCurveTo(tx + 6, ty - 20, tx + 12, ty + 4); ctx.closePath();
    ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#a6dc98"; ctx.fill();
    ctx.restore();
  }
  // root network below (x, groundY); prog 0..1 reveals branches; glow 0..1
  let rootCache = null;
  function buildRoots() {
    const segs = [], r = rng(77);
    function grow(x, y, ang, len, w, depth, order) {
      if (depth > 6 || len < 12) return;
      const nx = x + Math.sin(ang) * len, ny = y + Math.cos(ang) * len;
      segs.push({ x, y, nx, ny, w, order });
      const kids = depth < 2 ? 3 : 2;
      for (let k = 0; k < kids; k++) grow(nx, ny, ang + (r() - 0.5) * 1.3, len * (0.68 + r() * 0.2), w * 0.72, depth + 1, order + 1 + r() * 0.5);
    }
    for (let k = 0; k < 5; k++) grow(0, 0, (k - 2) * 0.5, 80 + r() * 30, 14, 0, 0);
    const maxO = Math.max(...segs.map((s) => s.order));
    segs.forEach((s) => (s.order /= maxO));
    return segs;
  }
  function roots(ctx, x, groundY, prog, glowA = 0, s = 1) {
    if (prog <= 0) return;
    rootCache = rootCache || buildRoots();
    ctx.save(); ctx.translate(x, groundY); ctx.scale(s, s); ctx.lineCap = "round";
    ctx.beginPath(); ctx.rect(-3000, 0, 6000, 3000); ctx.clip();   // never above ground
    if (glowA > 0) glow(ctx, 0, 220, 520, C.amber, glowA * 0.6);
    for (const pass of [0, 1]) for (const sg of rootCache) {
      const k = clamp((prog - sg.order * 0.85) / 0.15);
      if (k <= 0) continue;
      ctx.beginPath(); ctx.moveTo(sg.x, sg.y); ctx.lineTo(lerp(sg.x, sg.nx, k), lerp(sg.y, sg.ny, k));
      ctx.lineWidth = pass ? sg.w : sg.w + 7; ctx.strokeStyle = pass ? mixColor("#c9a46a", C.amber, glowA) : C.out; ctx.stroke();
    }
    ctx.restore();
  }
  function soil(ctx, groundY, depth = 900) {
    const g = ctx.createLinearGradient(0, groundY, 0, groundY + depth);
    g.addColorStop(0, "#2a2219"); g.addColorStop(1, "#140f0b");
    ctx.fillStyle = g; ctx.fillRect(-2000, groundY, 5000, depth);
    const r = rng(12);
    for (let i = 0; i < 70; i++) { ctx.fillStyle = `rgba(255,220,170,${0.03 + r() * 0.05})`; ctx.beginPath(); ctx.ellipse(-200 + r() * 1500, groundY + 30 + r() * depth, 4 + r() * 10, 3 + r() * 5, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#3a2e22"; ctx.fillRect(-2000, groundY, 5000, 14);
    ctx.fillStyle = "#5a7a4a"; ctx.fillRect(-2000, groundY - 6, 5000, 8);
  }
  function mound(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.ellipse(0, 0, 70, 22, 0, Math.PI, 0); ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = "#4a3a2a"; ctx.fill();
    ctx.restore();
  }
  function drops(ctx, x0, y0, x1, y1, t, a = 1) {
    if (a <= 0) return;
    for (let i = 0; i < 6; i++) {
      const k = ((t * 2.2 + i / 6) % 1);
      const x = lerp(x0, x1, k), y = lerp(y0, y1, k) + Math.sin(k * Math.PI) * -10;
      ctx.fillStyle = withA("#8fd0ff", a * (1 - k * 0.3));
      ctx.beginPath(); ctx.ellipse(x, y, 4, 7, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---- vehicles ----
  // side-view motor scooter facing right; feet on ground y; returns the seat point
  function scooter(ctx, x, y, s = 1, opt = {}) {
    const { col = "#3fa36b", box: hasBox = false, t = 0 } = opt;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (const wx of [-95, 105]) { circle(ctx, wx, -34, 34, "#1d2230", 7); circle(ctx, wx, -34, 12, "#9aa3b3", 4); }
    // body + floor
    ctx.beginPath(); ctx.moveTo(-140, -60); ctx.quadraticCurveTo(-150, -120, -80, -128); ctx.lineTo(10, -128); ctx.lineTo(30, -70); ctx.lineTo(70, -70); ctx.lineTo(90, -60); ctx.closePath();
    ctx.lineWidth = 7; ctx.strokeStyle = C.out; ctx.stroke(); ctx.fillStyle = col; ctx.fill();
    // front shield + handlebar
    ctx.beginPath(); ctx.moveTo(70, -70); ctx.lineTo(96, -190); ctx.lineTo(122, -190); ctx.lineTo(120, -60); ctx.closePath(); ctx.stroke(); ctx.fill();
    box(ctx, 88, -214, 56, 14, 6, "#2b303b", 5);
    box(ctx, 120, -176, 18, 14, 5, "#ffe29a", 0);
    // seat
    box(ctx, -110, -146, 120, 22, 10, "#2b303b", 5);
    if (hasBox) { box(ctx, -170, -250, 110, 104, 12, col, 6); SM.text(ctx, "GO", -115, -198, { size: 30, color: C.paper }); }
    ctx.restore();
    return [x - 40 * s, y - 146 * s];
  }
  // bicycle facing right with a coffee rack on the back
  function bicycle(ctx, x, y, s = 1, opt = {}) {
    const { rack = true, steam = 0, t = 0 } = opt;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const wx of [-110, 110]) { ctx.beginPath(); ctx.arc(wx, -52, 52, 0, Math.PI * 2); ctx.lineWidth = 16; ctx.strokeStyle = C.out; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = "#3b4252"; ctx.stroke(); circle(ctx, wx, -52, 6, "#9aa3b3", 0); }
    const fr = (pts, w = 9) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) ctx.lineTo(q[0], q[1]); ctx.lineWidth = w + 7; ctx.strokeStyle = C.out; ctx.stroke(); ctx.lineWidth = w; ctx.strokeStyle = C.coral; ctx.stroke(); };
    fr([[-110, -52], [-20, -52], [60, -150], [-50, -150], [-110, -52]]);
    fr([[-20, -52], [-50, -150], [-58, -176]]);
    fr([[110, -52], [72, -190], [96, -200]]);
    box(ctx, -86, -186, 60, 16, 7, "#2b303b", 5);
    if (rack) {
      // crate with two thermoses
      box(ctx, -236, -160, 140, 18, 4, "#4a3628", 5);
      box(ctx, -232, -250, 124, 92, 10, "#6b4f3a", 6);
      for (const tx of [-200, -140]) { box(ctx, tx - 18, -320, 36, 76, 10, "#c9d2de", 5); box(ctx, tx - 12, -334, 24, 16, 5, "#3b4252", 4); }
      SM.text(ctx, "KOPI", -170, -204, { size: 24, color: C.paper });
      if (steam > 0) for (let i = 0; i < 3; i++) { const k = ((t * 0.7 + i / 3) % 1); ctx.strokeStyle = withA("#ffffff", steam * 0.5 * (1 - k)); ctx.lineWidth = 6; ctx.beginPath(); const sx = -170 + (i - 1) * 22, sy = -340 - k * 90; ctx.moveTo(sx, sy + 30); ctx.quadraticCurveTo(sx + 14 * Math.sin(t * 3 + i), sy + 15, sx, sy); ctx.stroke(); }
    }
    ctx.restore();
    return [x - 56 * s, y - 186 * s];
  }
  // food delivery bag
  function foodBag(ctx, x, y, s = 1, col = "#3fa36b") {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -40, -30, 80, 66, 10, col, 5);
    ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.arc(0, -30, 18, Math.PI, 0); ctx.stroke();
    box(ctx, -24, -6, 48, 18, 5, C.paper, 0);
    ctx.restore();
  }

  Object.assign(SM, { scooter, bicycle, foodBag, windowSky, bed, desk, chair, laptop, deskLamp, books, chartBoard, heart, toast, say, wateringCan, bamboo, roots, soil, mound, drops });
})();
