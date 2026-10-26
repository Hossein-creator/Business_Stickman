/* Business Stickman — cinematic effects layer.
 * Particles, light, camera life and springs. Pure functions of time (seeded),
 * so any frame renders on its own. Load after stickman.js.
 */
(function () {
  const SM = window.SM;
  const { W, H, C, clamp, lerp, rng, glow, withA } = SM;

  // closed-form damped spring 0 -> 1 starting at t0 (zeta 0.4 playful .. 0.85 premium)
  function spring(t, t0, freq = 2.2, zeta = 0.55) {
    const x = t - t0;
    if (x <= 0) return 0;
    const w = freq * 2 * Math.PI, wd = w * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w * x) * (Math.cos(wd * x) + (zeta * w / wd) * Math.sin(wd * x));
  }
  // smooth pseudo noise from summed sines (deterministic)
  const noise = (t, s = 0) => Math.sin(t * 1.3 + s) * 0.5 + Math.sin(t * 2.7 + s * 1.7) * 0.3 + Math.sin(t * 5.1 + s * 2.3) * 0.2;
  // gentle hand-held camera life
  function handheld(t, amt = 1) { return { dx: noise(t * 0.6, 1) * 6 * amt, dy: noise(t * 0.5, 4) * 5 * amt, rot: noise(t * 0.4, 9) * 0.004 * amt }; }

  // radial burst of sparks / coins / snow from (x, y) at t0
  function burst(ctx, x, y, t, t0, opt = {}) {
    const { n = 40, speed = 900, life = 1.4, gravity = 1400, colors = [C.amber, "#ffe29a", "#fff4d6"], size = 7, seed = 1, kind = "spark", spread = Math.PI * 2, dir = -Math.PI / 2 } = opt;
    const k = t - t0;
    if (k < 0 || k > life) return;
    for (let i = 0; i < n; i++) {
      const r = rng(i * 13 + seed);
      const a = dir + (r() - 0.5) * spread, v = speed * (0.35 + r() * 0.65);
      const px = x + Math.cos(a) * v * k, py = y + Math.sin(a) * v * k + 0.5 * gravity * k * k;
      const fade = 1 - k / life;
      ctx.save(); ctx.globalAlpha *= fade;
      if (kind === "coin") SM.coin(ctx, px, py, size * 2, k * 12 + i, 1);
      else if (kind === "bill") { ctx.translate(px, py); ctx.rotate(k * 6 + i); SM.box(ctx, -20, -11, 40, 22, 4, "#9fd39a", 3); }
      else { ctx.fillStyle = colors[i % colors.length]; ctx.beginPath(); ctx.arc(px, py, size * (0.4 + r() * 0.8) * (0.4 + fade * 0.6), 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
  }
  // confetti rain over the frame starting at t0
  function confetti(ctx, t, t0, opt = {}) {
    const { n = 90, life = 3.2, seed = 7, colors = [C.amber, C.coral, C.teal, "#7d86c9", "#fff4d6", "#9ad48f"] } = opt;
    const k = t - t0;
    if (k < 0 || k > life) return;
    const fade = clamp((life - k) / 0.8);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 7 + seed);
      const delay = r() * 0.5, kk = k - delay;
      if (kk < 0) continue;
      const x0 = r() * W, vy = 380 + r() * 420;
      const x = x0 + Math.sin(kk * (2 + r() * 3) + i) * 40, y = -40 - r() * 300 + vy * kk;
      ctx.save(); ctx.globalAlpha *= fade; ctx.translate(x, y); ctx.rotate(kk * (4 + r() * 6) + i);
      ctx.scale(Math.cos(kk * (5 + r() * 5) + i), 1);
      ctx.fillStyle = colors[i % colors.length]; ctx.fillRect(-9, -5, 18, 10);
      ctx.restore();
    }
  }
  // falling bills / coins over the frame (money rain)
  function moneyRain(ctx, t, t0, opt = {}) {
    const { n = 26, life = 3, seed = 3 } = opt;
    const k = t - t0;
    if (k < 0 || k > life) return;
    const fade = clamp((life - k) / 0.6);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 19 + seed), kk = k - r() * 0.6;
      if (kk < 0) continue;
      const x = r() * W + Math.sin(kk * 2 + i) * 60, y = -80 + kk * (300 + r() * 260);
      ctx.save(); ctx.globalAlpha *= fade; ctx.translate(x, y); ctx.rotate(Math.sin(kk * 2.5 + i) * 0.8);
      ctx.scale(1, Math.cos(kk * 3 + i) * 0.5 + 0.6);
      SM.box(ctx, -34, -17, 68, 34, 5, "#8fcf86", 4);
      ctx.fillStyle = "#5f9a58"; ctx.font = `800 20px ${SM.FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("$", 0, 1);
      ctx.restore();
    }
  }
  // rotating god rays from (x, y)
  function rays(ctx, x, y, t, a = 1, color = "#ffd27a", n = 14, len = 1400) {
    if (a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.15); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2, wdt = 0.07 + (i % 3) * 0.03;
      const g = ctx.createLinearGradient(0, 0, Math.cos(ang) * len, Math.sin(ang) * len);
      g.addColorStop(0, withA(color, 0.22 * a)); g.addColorStop(1, withA(color, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.arc(0, 0, len, ang - wdt, ang + wdt); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  // anamorphic lens flare streak
  function flare(ctx, x, y, a = 1, color = "#ffd27a", w = 900) {
    if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    const g = ctx.createLinearGradient(x - w, y, x + w, y);
    g.addColorStop(0, withA(color, 0)); g.addColorStop(0.5, withA(color, 0.55 * a)); g.addColorStop(1, withA(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - w, y - 3, w * 2, 6);
    glow(ctx, x, y, 140, color, a);
    for (let i = 1; i <= 3; i++) { ctx.fillStyle = withA(color, 0.08 * a); ctx.beginPath(); ctx.arc(x + (W / 2 - x) * i * 0.5, y + (H / 2 - y) * i * 0.5, 18 + i * 14, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // expanding shockwave ring
  function ring(ctx, x, y, t, t0, opt = {}) {
    const { life = 0.8, r1 = 520, color = "#fff4d6", width = 10 } = opt;
    const k = (t - t0) / life;
    if (k < 0 || k > 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - k;
    ctx.strokeStyle = color; ctx.lineWidth = width * (1 - k) + 1;
    ctx.beginPath(); ctx.arc(x, y, r1 * (1 - Math.pow(1 - k, 3)), 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  // snow with depth: far flakes small/sharp, near flakes big/soft (bokeh)
  function snow(ctx, t, amt = 1, wind = 0.3, seed = 2) {
    const n = Math.floor(160 * amt);
    for (let i = 0; i < n; i++) {
      const r = rng(i * 29 + seed), z = r();
      const sp = 60 + z * 220, size = 1.5 + z * z * 10;
      const x = ((r() * (W + 200) + t * sp * wind + Math.sin(t * (0.5 + r()) + i) * 30) % (W + 200) + W + 200) % (W + 200) - 100;
      const y = ((r() * H + t * sp) % (H + 60)) - 30;
      if (z > 0.8) { const g = ctx.createRadialGradient(x, y, 0, x, y, size); g.addColorStop(0, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.fillStyle = g; }
      else ctx.fillStyle = `rgba(235,242,255,${0.25 + z * 0.5})`;
      ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
    }
  }
  // speed lines toward a vanishing point (for fast spins / zooms)
  function speedLines(ctx, cx, cy, t, a = 1, seed = 4) {
    if (a <= 0) return;
    const r = rng(Math.floor(t * 30) + seed);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineCap = "round";
    for (let i = 0; i < 40; i++) {
      const ang = r() * Math.PI * 2, r0 = 380 + r() * 400, len = 120 + r() * 300;
      ctx.lineWidth = 1 + r() * 3;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0); ctx.lineTo(cx + Math.cos(ang) * (r0 + len), cy + Math.sin(ang) * (r0 + len)); ctx.stroke();
    }
    ctx.restore();
  }
  // whole-frame grade: desaturate (0..1) and tint
  function grade(ctx, desat = 0, tint = null, tintA = 0) {
    if (desat > 0) { ctx.save(); ctx.globalCompositeOperation = "saturation"; ctx.fillStyle = `rgba(128,128,128,${desat})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (tint && tintA > 0) { ctx.save(); ctx.globalCompositeOperation = "soft-light"; ctx.fillStyle = withA(tint, tintA); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }
  // cached, optionally blurred layer (depth of field for static backdrops)
  const layers = {};
  function layer(key, w, h, blur, paint) {
    if (layers[key]) return layers[key];
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d");
    if (blur) {
      const tmp = document.createElement("canvas"); tmp.width = w; tmp.height = h;
      paint(tmp.getContext("2d"));
      g.filter = `blur(${blur}px)`; g.drawImage(tmp, 0, 0);
    } else paint(g);
    return (layers[key] = c);
  }
  // soft light leak at a frame edge
  function leak(ctx, t, a = 0.3, color = "#ff9f5a") {
    if (a <= 0) return;
    const x = W * (0.85 + noise(t * 0.3, 3) * 0.1), y = H * (0.15 + noise(t * 0.25, 6) * 0.08);
    ctx.save(); ctx.globalCompositeOperation = "screen"; glow(ctx, x, y, 700, color, a); ctx.restore();
  }

  SM.fx = { spring, noise, handheld, burst, confetti, moneyRain, rays, flare, ring, snow, speedLines, grade, layer, leak };
})();
