/* Business Stickman — shared canvas engine.
 * Everything is drawn as a pure function of time t (seconds), so HyperFrames
 * can seek any frame. No Date.now, no unseeded random, no rAF.
 */
(function () {
  const W = 1080, H = 1920;

  const C = {
    bgTop: "#171b24", bgBot: "#0a0c11",
    ground: "#1a1e27", groundLine: "#2a303c",
    building: "#232834", buildingDark: "#1c2029", window: "#2e3543",
    hero: "#eef1f6", other: "#9aa3b3", dim: "#6d7584",
    out: "#0d1015",
    amber: "#ffc23d", amberDeep: "#ff9f1c",
    teal: "#6fa7ac", tealDark: "#4c7f84",
    wood: "#6b4f3a", woodDark: "#4a3628",
    coral: "#ef6f5e", green: "#7fbf7a", leafDry: "#a88a4a",
    paper: "#f4f1ea", text: "#cfd5df", label: "#7d8696",
  };

  // ---------- math ----------
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const inv = (a, b, v) => clamp((v - a) / (b - a));
  const E = {
    lin: (k) => k,
    inOut: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    out: (k) => 1 - Math.pow(1 - k, 3),
    in: (k) => k * k * k,
    outQuint: (k) => 1 - Math.pow(1 - k, 5),
    back: (k) => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); },
    elastic: (k) => k === 0 ? 0 : k === 1 ? 1 : Math.pow(2, -10 * k) * Math.sin((k * 10 - 0.75) * (2 * Math.PI) / 3) + 1,
    sine: (k) => -(Math.cos(Math.PI * k) - 1) / 2,
  };
  // ease value between two times
  const tw = (t, t0, t1, ease = E.inOut) => ease(inv(t0, t1, t));
  // keyframes [[t, value], ...] (numbers or objects of numbers)
  function kf(t, keys, ease = E.inOut) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      if (t <= keys[i][0]) {
        const [t0, a] = keys[i - 1], [t1, b] = keys[i];
        const k = ease((t - t0) / (t1 - t0));
        return mix(a, b, k);
      }
    }
    return keys[keys.length - 1][1];
  }
  function mix(a, b, k) {
    if (typeof a === "number") return lerp(a, b, k);
    if (Array.isArray(a)) return a.map((v, i) => mix(v, b[i], k));
    const o = {};
    for (const key in a) o[key] = key in b ? mix(a[key], b[key], k) : a[key];
    return o;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hash = (n) => { const r = rng(n * 9973 + 17); return r(); };

  // ---------- drawing primitives ----------
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function fillOut(ctx, fill, lw = 6, out = C.out) {
    if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = out; ctx.lineJoin = "round"; ctx.stroke(); }
    ctx.fillStyle = fill; ctx.fill();
  }
  function box(ctx, x, y, w, h, r, fill, lw = 6) {
    rr(ctx, x, y, w, h, r); fillOut(ctx, fill, lw);
  }
  function circle(ctx, x, y, r, fill, lw = 6) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fillOut(ctx, fill, lw);
  }
  function glow(ctx, x, y, r, color, a = 1) {
    if (a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, withA(color, 0.55 * a));
    g.addColorStop(0.4, withA(color, 0.18 * a));
    g.addColorStop(1, withA(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function withA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function mixColor(h1, h2, k) {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const c = [16, 8, 0].map((s) => Math.round(lerp((a >> s) & 255, (b >> s) & 255, k)));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  }
  const FONT = '"Jakarta", "Plus Jakarta Sans", sans-serif';
  function label(ctx, text, x, y, opt = {}) {
    const { size = 22, color = C.label, align = "center", weight = 800, spacing = 0.22, alpha = 1 } = opt;
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    // manual letter spacing
    const chars = [...text];
    const sp = size * spacing;
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
    let cx = align === "center" ? x - total / 2 : align === "right" ? x - total : x;
    ctx.textAlign = "left";
    chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + sp; });
    ctx.restore();
    return total;
  }
  function text(ctx, str, x, y, opt = {}) {
    const { size = 40, color = C.hero, weight = 800, align = "center", alpha = 1, base = "middle" } = opt;
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  // pill badge (e.g. "DAY 120", "2024")
  function pill(ctx, str, x, y, opt = {}) {
    const { size = 34, fg = C.hero, bg = "#262b36", alpha = 1, scale = 1 } = opt;
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.font = `800 ${size}px ${FONT}`;
    const w = ctx.measureText(str).width + size * 1.3, h = size * 1.7;
    rr(ctx, -w / 2, -h / 2, w, h, h / 2);
    ctx.fillStyle = bg; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(str, 0, size * 0.04);
    ctx.restore();
  }

  // ---------- stickman rig ----------
  // Angles in radians measured from straight down; positive swings toward
  // the direction the figure faces. Limbs: [upper, lower] absolute angles.
  const BONE = { torso: 78, neck: 10, head: 27, upper: 42, fore: 40, thigh: 48, shin: 48, lw: 14 };
  const POSE = {
    stand: { lean: 0, head: 0, aB: [0.22, 0.12], aF: [-0.2, -0.1], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    slump: { lean: 0.3, head: 0.5, aB: [0.3, 0.22], aF: [0.12, 0.05], lB: [0.14, 0.02], lF: [-0.1, -0.02] },
    proud: { lean: -0.06, head: -0.12, aB: [0.25, 0.1], aF: [-0.25, -0.15], lB: [0.12, 0], lF: [-0.12, 0] },
    sit: { lean: 0.08, head: 0.05, aB: [0.35, 1.2], aF: [0.3, 1.25], lB: [1.5, 0.05], lF: [1.42, -0.05], seat: true },
    sitSlump: { lean: 0.42, head: 0.5, aB: [0.6, 1.4], aF: [0.55, 1.5], lB: [1.45, 0.1], lF: [1.38, 0.0], seat: true },
    phone: { lean: 0.1, head: 0.45, aB: [0.3, 2.1], aF: [0.45, 2.4], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    give: { lean: 0.05, head: 0.1, aB: [0.22, 0.12], aF: [1.25, 1.45], lB: [0.14, 0.02], lF: [-0.14, -0.02] },
    reach: { lean: 0.1, head: 0.15, aB: [0.15, 0.1], aF: [1.0, 1.9], lB: [0.06, 0], lF: [-0.06, 0] },
    cheer: { lean: -0.05, head: -0.25, aB: [-2.6, -2.9], aF: [2.6, 2.9], lB: [0.15, 0], lF: [-0.15, 0] },
    work: { lean: 0.2, head: 0.35, aB: [0.6, 1.6], aF: [0.75, 1.75], lB: [0.06, 0], lF: [-0.06, 0] },
    wipe: { lean: 0.25, head: 0.4, aB: [0.3, 0.2], aF: [0.95, 1.55], lB: [0.06, 0], lF: [-0.06, 0] },
  };
  function walk(phase, amt = 1) {
    const s = Math.sin(phase), c = Math.cos(phase);
    return {
      lean: 0.08 * amt, head: 0.02,
      aB: [-0.45 * s * amt, -0.45 * s * amt + 0.35 * amt],
      aF: [0.45 * s * amt, 0.45 * s * amt + 0.35 * amt],
      lB: [0.5 * s * amt, 0.5 * s * amt - Math.max(0, -c) * 0.8 * amt],
      lF: [-0.5 * s * amt, -0.5 * s * amt - Math.max(0, c) * 0.8 * amt],
      bob: Math.abs(c) * 6 * amt,
    };
  }
  const poseMix = (a, b, k) => mix(a, b, k);

  // returns joint positions in local space (feet at y=0 unless seated)
  function joints(p, s = 1) {
    const d = (len, ang) => [Math.sin(ang) * len * s, Math.cos(ang) * len * s];
    const legH = (l) => (Math.cos(l[0]) * BONE.thigh + Math.cos(l[1]) * BONE.shin) * s;
    let hipY;
    if (p.seat) hipY = 0; // seated: hip at origin (origin = seat point)
    else hipY = -Math.max(legH(p.lB), legH(p.lF)) - (p.bob ? -p.bob * s * 0 : 0);
    hipY -= (p.bob || 0) * s * 0.3;
    const hip = [0, hipY];
    const tv = d(BONE.torso, Math.PI + p.lean);
    const sh = [hip[0] + tv[0], hip[1] + tv[1]];
    const nv = d(BONE.neck + BONE.head, Math.PI + p.lean + p.head * 0.6);
    const head = [sh[0] + nv[0], sh[1] + nv[1]];
    const limb = (o, a) => { const u = d(BONE.upper, a[0]); const e = [o[0] + u[0], o[1] + u[1]]; const f = d(BONE.fore, a[1]); return [o, e, [e[0] + f[0], e[1] + f[1]]]; };
    const leg = (o, a) => { const u = d(BONE.thigh, a[0]); const e = [o[0] + u[0], o[1] + u[1]]; const f = d(BONE.shin, a[1]); return [o, e, [e[0] + f[0], e[1] + f[1]]]; };
    const shA = [sh[0] - 2 * s, sh[1] + 6 * s];
    return { hip, sh, head, aB: limb(shA, p.aB), aF: limb(shA, p.aF), lB: leg(hip, p.lB), lF: leg(hip, p.lF) };
  }
  // fig: {x, y, s, face, pose, color, alpha, glowA}
  function stickman(ctx, fig) {
    const { x, y, s = 1, face = 1, pose = POSE.stand, color = C.hero, alpha = 1, glowA = 0, squash = 0 } = fig;
    if (alpha <= 0) return null;
    const J = joints(pose, s);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.scale(face * (1 + squash * 0.12), 1 - squash * 0.12);
    if (glowA > 0) glow(ctx, J.head[0], J.sh[1] + 20 * s, 230 * s, C.amber, glowA);
    const segs = [J.aB, J.lB, [J.hip, J.sh], J.lF, J.aF];
    const pass = (lw, col, headR) => {
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = col; ctx.lineWidth = lw;
      for (const sg of segs) { ctx.beginPath(); ctx.moveTo(sg[0][0], sg[0][1]); for (let i = 1; i < sg.length; i++) ctx.lineTo(sg[i][0], sg[i][1]); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(J.head[0], J.head[1], headR, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
    };
    pass((BONE.lw + 9) * s, C.out, (BONE.head + 4.5) * s);
    pass(BONE.lw * s, color, BONE.head * s);
    // soft rim shade on head for depth
    ctx.beginPath(); ctx.arc(J.head[0], J.head[1], BONE.head * s, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.beginPath(); ctx.arc(J.head[0] - 9 * s, J.head[1] + 7 * s, BONE.head * s, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // world-space joints for prop attachment
    const w = (p) => [x + p[0] * face, y + p[1]];
    return { head: w(J.head), handF: w(J.aF[2]), handB: w(J.aB[2]), hip: w(J.hip), sh: w(J.sh) };
  }

  // ---------- props ----------
  function thought(ctx, x, y, w, h, k, from, opt = {}) {
    // k: 0..1 appear (pops with overshoot); from: [x,y] of the thinker's head
    if (k <= 0) return null;
    const { fill = C.paper, glowA = 0 } = opt;
    const sc = E.back(clamp(k));
    ctx.save();
    if (glowA > 0) glow(ctx, x, y, Math.max(w, h) * 1.3, C.amber, glowA);
    // dots
    for (let i = 0; i < 3; i++) {
      const dk = clamp(k * 3 - i * 0.6);
      if (dk <= 0) continue;
      const px = lerp(from[0], x, 0.25 + i * 0.22), py = lerp(from[1], y + h / 2, 0.25 + i * 0.22);
      circle(ctx, px, py, (5 + i * 3) * E.back(dk), fill, 4);
    }
    ctx.translate(x, y); ctx.scale(sc, sc);
    box(ctx, -w / 2, -h / 2, w, h, 26, fill, 6);
    ctx.restore();
    return { x, y, w: w * sc, h: h * sc, sc };
  }
  function bench(ctx, x, y, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -70, -50, 140, 14, 5, C.wood, 5);
    box(ctx, -60, -40, 10, 40, 3, C.woodDark, 5);
    box(ctx, 50, -40, 10, 40, 3, C.woodDark, 5);
    box(ctx, -72, -100, 10, 60, 4, C.woodDark, 5);
    box(ctx, -72, -95, 60, 12, 5, C.wood, 5);
    ctx.restore();
  }
  function tree(ctx, x, y, s, dry, t, seed = 3) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    box(ctx, -9, -150, 18, 150, 6, C.wood, 6);
    const col = mixColor(C.green, C.leafDry, dry);
    const sway = Math.sin(t * 1.3) * 2;
    const blobs = [[0, -210, 70], [-48, -170, 52], [48, -170, 52], [0, -150, 50]];
    const thin = clamp(dry * 1.2 - 0.3) * 0.25;
    ctx.translate(sway, 0);
    ctx.lineWidth = 6; ctx.strokeStyle = C.out;
    for (const [bx, by, br] of blobs) { ctx.beginPath(); ctx.arc(bx, by, br * (1 - thin), 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = col;
    for (const [bx, by, br] of blobs) { ctx.beginPath(); ctx.arc(bx, by, br * (1 - thin), 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath(); ctx.arc(10, -150, 50 * (1 - thin), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // falling leaves: deterministic per index; amount 0..1
  function leaves(ctx, x, y, s, amount, t, groundY) {
    const n = Math.floor(amount * 26);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 31 + 7);
      const period = 2.6 + r() * 1.5, off = r() * period;
      const k = ((t + off) % period) / period;
      const sx = x + (r() - 0.5) * 160 * s, sy = y - 200 * s + r() * 60 * s;
      const py = lerp(sy, groundY - 4, Math.min(1, k * 1.25));
      const px = sx + Math.sin(k * 9 + i) * 22 * s + k * 30 * s;
      ctx.save(); ctx.translate(px, py); ctx.rotate(k * 8 + i);
      ctx.fillStyle = i % 3 ? C.leafDry : "#c49a50";
      ctx.beginPath(); ctx.ellipse(0, 0, 7 * s, 3.5 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    // settled leaves on ground
    const settled = Math.floor(amount * 40);
    for (let i = 0; i < settled; i++) {
      const r = rng(i * 13 + 99);
      ctx.fillStyle = i % 2 ? C.leafDry : "#8c7340";
      ctx.beginPath(); ctx.ellipse(x + (r() - 0.5) * 300 * s, groundY - 3, 8 * s, 3 * s, r(), 0, Math.PI * 2); ctx.fill();
    }
  }
  function coin(ctx, x, y, r = 16, spin = 0, a = 1) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(Math.max(0.15, Math.abs(Math.cos(spin))), 1);
    circle(ctx, 0, 0, r, C.amber, 4);
    ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.strokeStyle = C.amberDeep; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
  }
  // glass savings jar; fill 0..1
  function jar(ctx, x, y, s, fill, t, glowA = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (glowA > 0) glow(ctx, 0, -90, 260, C.amber, glowA);
    const w = 120, h = 150;
    rr(ctx, -w / 2, -h, w, h, 28); ctx.fillStyle = "rgba(160,190,210,0.10)"; ctx.fill();
    // coins inside
    ctx.save(); rr(ctx, -w / 2 + 6, -h + 6, w - 12, h - 12, 22); ctx.clip();
    const lvl = fill * (h - 14);
    const n = Math.floor(fill * 60);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 7 + 3);
      const cy = -10 - (i / 60) * (h - 20) - r() * 8;
      if (-cy > lvl + 12) continue;
      ctx.save(); ctx.translate(-w / 2 + 18 + r() * (w - 36), cy); ctx.scale(1, 0.45);
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fillStyle = i % 4 ? C.amber : C.amberDeep; ctx.fill();
      ctx.lineWidth = 4; ctx.strokeStyle = "#b5781a"; ctx.stroke(); ctx.restore();
    }
    ctx.restore();
    rr(ctx, -w / 2, -h, w, h, 28); ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke();
    // shine
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-w / 2 + 18, -h + 30); ctx.lineTo(-w / 2 + 18, -h + 70); ctx.stroke();
    // lid with slot
    box(ctx, -w / 2 + 8, -h - 22, w - 16, 24, 8, C.teal, 6);
    box(ctx, -18, -h - 14, 36, 6, 3, C.out, 0);
    ctx.restore();
  }
  // street food cart. sign: text on glowing sign (null for none); light 0..1
  function cart(ctx, x, y, s, opt = {}) {
    const { awning = 1, sign = null, light = 0, t = 0, goods = 1 } = opt;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (light > 0) glow(ctx, 0, -120, 330, C.amber, light * 0.9);
    // wheels
    circle(ctx, -70, -26, 26, "#2b303b", 6); circle(ctx, -70, -26, 8, C.dim, 0);
    circle(ctx, 80, -16, 14, "#2b303b", 5);
    // body
    box(ctx, -120, -120, 240, 82, 10, C.teal, 6);
    box(ctx, -108, -108, 216, 20, 6, C.tealDark, 0);
    // glass case with goods
    box(ctx, -80, -175, 160, 58, 10, "rgba(200,225,235,0.18)", 6);
    for (let i = 0; i < Math.round(goods * 5); i++) circle(ctx, -55 + i * 27, -138, 11, i % 2 ? "#d9913a" : "#c97b2a", 4);
    // poles + awning
    if (awning > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(awning * 2);
      box(ctx, -112, -300, 10, 182, 3, C.woodDark, 5); box(ctx, 102, -300, 10, 182, 3, C.woodDark, 5);
      const aw = E.back(clamp(awning));
      ctx.translate(0, -300); ctx.scale(1, aw);
      const stripes = 8, sw = 270 / stripes;
      for (let i = 0; i < stripes; i++) {
        rr(ctx, -135 + i * sw, -10, sw, 42, 6);
        ctx.fillStyle = i % 2 ? C.paper : C.teal; ctx.fill();
      }
      rr(ctx, -135, -10, 270, 42, 8); ctx.lineWidth = 6; ctx.strokeStyle = C.out; ctx.stroke();
      // scallops
      for (let i = 0; i < stripes; i++) { ctx.beginPath(); ctx.arc(-135 + sw / 2 + i * sw, 32, sw / 2, 0, Math.PI); fillOut(ctx, i % 2 ? C.paper : C.teal, 5); }
      ctx.restore();
    }
    // bulb
    if (light > 0) { circle(ctx, 0, -250, 9 * clamp(awning * 2), mixColor("#555b66", C.amber, light), 4); }
    if (sign) signBoard(ctx, 0, -360, sign, light, 1);
    ctx.restore();
  }
  function signBoard(ctx, x, y, str, light, s = 1, w0 = null) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.font = `800 30px ${FONT}`;
    const w = w0 || ctx.measureText(str).width + 60;
    if (light > 0) glow(ctx, 0, 0, w * 0.9, C.amber, light);
    box(ctx, -w / 2, -28, w, 56, 14, mixColor("#3a3f4a", C.amber, light), 6);
    ctx.fillStyle = mixColor("#9aa3b3", "#3a2600", light); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(str, 0, 2);
    ctx.restore();
  }
  // shop building (bigger warung) built around a cart
  function shop(ctx, x, y, s, opt = {}) {
    const { grow = 1, sign = "SHOP", light = 1, t = 0 } = opt;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const k = E.back(clamp(grow));
    if (light > 0) glow(ctx, 40, -230, 520, C.amber, light * 0.7 * clamp(grow));
    ctx.save(); ctx.translate(0, 0); ctx.scale(1, Math.max(0.001, k));
    box(ctx, -190, -400, 420, 400, 14, "#3b3430", 6);
    box(ctx, -170, -380, 380, 40, 8, "#2e2825", 0);
    // shelves
    box(ctx, 120, -300, 90, 220, 8, "#2a2522", 5);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) box(ctx, 130 + c * 26, -285 + r * 62, 18, 40, 4, ["#e0b25a", "#c9634f", "#7fbf9a"][(r + c) % 3], 3);
    ctx.restore();
    if (grow > 0.6) signBoard(ctx, 40, -440 * k, sign, light, 1.2, 330);
    ctx.restore();
  }
  function phone(ctx, x, y, s, screenA = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (screenA > 0) glow(ctx, 0, 0, 90, "#8fc7ff", screenA * 0.6);
    box(ctx, -15, -26, 30, 52, 7, "#1d2230", 5);
    rr(ctx, -10, -20, 20, 38, 4); ctx.fillStyle = mixColor("#2a3346", "#9fd0ff", screenA); ctx.fill();
    ctx.restore();
  }
  function cup(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-18, -40); ctx.lineTo(18, -40); ctx.lineTo(13, 0); ctx.lineTo(-13, 0); ctx.closePath();
    fillOut(ctx, "#c58b5a", 5);
    box(ctx, -21, -48, 42, 10, 4, C.paper, 5);
    ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(6, -48); ctx.lineTo(12, -66); ctx.stroke();
    ctx.restore();
  }
  // icon library for bubbles (drawn centred, ~80px)
  const ICON = {
    coffee: (ctx) => cup(ctx, 0, 30, 1.2),
    shoe: (ctx) => {
      ctx.beginPath(); ctx.moveTo(-42, 18); ctx.lineTo(-40, -14); ctx.quadraticCurveTo(-20, -18, -10, -4); ctx.lineTo(30, 4); ctx.quadraticCurveTo(46, 8, 44, 18); ctx.closePath();
      fillOut(ctx, C.coral, 5); box(ctx, -44, 14, 90, 10, 4, C.paper, 5);
    },
    game: (ctx) => { box(ctx, -44, -20, 88, 44, 20, "#7d86c9", 5); circle(ctx, -20, 2, 7, C.out, 0); circle(ctx, 18, -4, 5, C.amber, 0); circle(ctx, 28, 8, 5, C.coral, 0); },
    bag: (ctx) => { box(ctx, -32, -18, 64, 54, 8, C.teal, 5); ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.beginPath(); ctx.arc(0, -18, 16, Math.PI, 0); ctx.stroke(); },
    shop: (ctx) => { box(ctx, -44, -30, 88, 64, 8, "#3b3430", 5); box(ctx, -50, -40, 100, 18, 6, C.amber, 5); },
    crowd: (ctx) => { for (let i = 0; i < 3; i++) { circle(ctx, -28 + i * 28, -12, 12, i === 1 ? C.hero : C.other, 4); box(ctx, -38 + i * 28, 2, 20, 30, 8, i === 1 ? C.hero : C.other, 4); } },
  };
  function icon(ctx, name, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ICON[name](ctx); ctx.restore(); }

  // bill / invoice card (stacks)
  function bill(ctx, x, y, s, rot, str = "PAY LATER") {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    box(ctx, -70, -44, 140, 88, 10, C.paper, 5);
    box(ctx, -70, -44, 140, 24, 10, C.coral, 0);
    rr(ctx, -70, -44, 140, 88, 10); ctx.lineWidth = 5; ctx.strokeStyle = C.out; ctx.stroke();
    ctx.font = `800 15px ${FONT}`; ctx.fillStyle = C.paper; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(str, 0, -31);
    ctx.fillStyle = "#c9c4b8"; for (let i = 0; i < 3; i++) ctx.fillRect(-52, -6 + i * 15, 70 - i * 18, 6);
    ctx.fillStyle = C.coral; ctx.font = `800 18px ${FONT}`; ctx.fillText("DUE", 40, 22);
    ctx.restore();
  }

  // ---------- atmosphere ----------
  function background(ctx, top = C.bgTop, bot = C.bgBot) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // distant city silhouette with lit windows; parallax by camX*depth
  function city(ctx, baseY, camX, depth, seed, lit = 0.25, tint = "#1d222c") {
    const r = rng(seed);
    let x = -500 - camX * depth;
    ctx.save();
    while (x < W + 400) {
      const w = 90 + r() * 140, h = 180 + r() * 420;
      ctx.fillStyle = tint; ctx.fillRect(x, baseY - h, w, h);
      for (let wy = baseY - h + 24; wy < baseY - 30; wy += 38) for (let wx = x + 16; wx < x + w - 20; wx += 30) {
        const on = r() < lit;
        ctx.fillStyle = on ? "rgba(255,200,110,0.22)" : "rgba(255,255,255,0.025)";
        ctx.fillRect(wx, wy, 14, 20);
      }
      x += w + 10 + r() * 30;
    }
    ctx.restore();
  }
  function groundStrip(ctx, y, h = 400, watermark = "") {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#1c2029"); g.addColorStop(1, "#0d0f14");
    ctx.fillStyle = g; ctx.fillRect(-200, y, W + 400, h);
    ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(-200, y, W + 400, 3);
    if (watermark) label(ctx, watermark, W / 2, y + 30, { size: 15, color: "rgba(255,255,255,0.16)", spacing: 0.5 });
  }
  function rain(ctx, t, amt = 1, seed = 5, wind = 0.18) {
    if (amt <= 0) return;
    ctx.save(); ctx.lineCap = "round";
    const n = Math.floor(220 * amt);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 17 + seed);
      const z = 0.4 + r() * 0.6, sp = 1500 * z, len = 30 * z;
      const x0 = r() * (W + 300) - 150, y0 = r() * H;
      const y = (y0 + t * sp) % (H + 100) - 50, x = x0 + (y - y0) * wind;
      ctx.strokeStyle = `rgba(190,205,225,${0.12 * z + 0.04})`; ctx.lineWidth = 2 * z;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len * wind, y + len); ctx.stroke();
    }
    ctx.restore();
  }
  function motes(ctx, t, n = 40, seed = 11, color = "#ffd27a", a = 0.5) {
    for (let i = 0; i < n; i++) {
      const r = rng(i * 23 + seed);
      const x = (r() * W + Math.sin(t * 0.3 + i) * 30), y = (r() * H - t * (10 + r() * 20) + H * 2) % H;
      const tw = 0.5 + 0.5 * Math.sin(t * (1 + r() * 2) + i);
      ctx.fillStyle = withA(color, a * tw * (0.2 + r() * 0.5));
      ctx.beginPath(); ctx.arc(x, y, 1.5 + r() * 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  function vignette(ctx, a = 0.75) {
    const g = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.5, H * 0.75);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${a})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  let grainTiles = null;
  function grain(ctx, t, a = 0.05) {
    if (!grainTiles) {
      grainTiles = [];
      for (let k = 0; k < 4; k++) {
        const c = document.createElement("canvas"); c.width = c.height = 256;
        const g = c.getContext("2d"), img = g.createImageData(256, 256), r = rng(k + 101);
        for (let i = 0; i < img.data.length; i += 4) { const v = r() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
        g.putImageData(img, 0, 0); grainTiles.push(c);
      }
    }
    const tile = grainTiles[Math.floor(t * 24) % 4];
    ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = ctx.createPattern(tile, "repeat"); ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  // camera: zoom around a focus point (fx, fy) placed at screen centre-ish
  function camera(ctx, cam) {
    const { x = W / 2, y = H / 2, z = 1, sx = W / 2, sy = H / 2, rot = 0 } = cam;
    ctx.translate(sx, sy); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-x, -y);
  }

  // ---------- driver: hooks canvas into the HyperFrames GSAP timeline ----------
  function mount(canvasId, duration, draw, tl) {
    const cv = document.getElementById(canvasId);
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    const state = { t: 0 };
    const render = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); draw(ctx, state.t); };
    tl.fromTo(state, { t: 0 }, { t: duration, duration, ease: "none", onUpdate: render }, 0);
    render();
    return render;
  }

  window.SM = { W, H, C, E, clamp, lerp, inv, tw, kf, mix, rng, hash, rr, box, circle, glow, withA, mixColor, label, text, pill,
    POSE, walk, poseMix, stickman, joints, thought, bench, tree, leaves, coin, jar, cart, signBoard, shop, phone, cup, icon, bill,
    background, city, groundStrip, rain, motes, vignette, grain, camera, mount, FONT };
})();
