'use strict';
// 页面运行时画进图集的图和字：太阳、海、花、水纹、线团、月夜，以及"在意""我不确定"两个字

// 画的图按"黑墨白纸"画在 512 的小画布上，翻成"白=有墨"再缩进格子；带专色的整张印在专色版
function paintDrawn(g, it, seed) {
  const T = document.createElement('canvas'); T.width = T.height = 512;
  const x = T.getContext('2d');
  it.paint(x, 512, mulberry(seed));
  const d = x.getImageData(0, 0, 512, 512), px = d.data;
  for (let i = 0; i < px.length; i += 4) { const v = 255 - px[i]; px[i] = px[i + 1] = px[i + 2] = v; px[i + 3] = 255; }
  x.putImageData(d, 0, 0);
  const [cx, cy] = it.rect;
  g.save(); g.filter = `blur(${(it.blur * CELL / 512).toFixed(2)}px)`;
  g.drawImage(T, cx, cy + (it.spot ? PH : 0), CELL, CELL); g.restore();
}
function lin(x, x0, y0, x1, y1, stops) { const gr = x.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
function rad(x, cx, cy, r0, r1, stops, fx, fy) { const gr = x.createRadialGradient(fx ?? cx, fy ?? cy, r0, cx, cy, r1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
function paintSun(x, C, r) {
  x.fillStyle = lin(x, 0, 0, 0, C, [[0, '#e6e6e6'], [1, '#fbfbfb']]); x.fillRect(0, 0, C, C);
  x.translate(C / 2, C / 2); x.fillStyle = '#5a5a5a';
  const n = 20;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + r() * 0.08, r0 = 92, r1 = 170 + r() * 60, w = 0.07 + r() * 0.05;
    x.beginPath(); x.moveTo(Math.cos(a - w) * r0, Math.sin(a - w) * r0);
    x.quadraticCurveTo(Math.cos(a) * r1 * 0.72 + (r() - 0.5) * 22, Math.sin(a) * r1 * 0.72 + (r() - 0.5) * 22, Math.cos(a) * r1, Math.sin(a) * r1);
    x.quadraticCurveTo(Math.cos(a) * r1 * 0.72 + (r() - 0.5) * 22, Math.sin(a) * r1 * 0.72 + (r() - 0.5) * 22, Math.cos(a + w) * r0, Math.sin(a + w) * r0);
    x.fill();
  }
  x.fillStyle = rad(x, 0, 0, 6, 100, [[0, '#b4b4b4'], [1, '#2c2c2c']], -30, -30);
  x.beginPath(); x.arc(0, 0, 96, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#ededed'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath();
  for (let k = 0; k < 120; k++) { const a = k * 0.15, rr = 4 + k * 0.62; const px = Math.cos(a) * rr, py = Math.sin(a) * rr; k ? x.lineTo(px, py) : x.moveTo(px, py); }
  x.stroke();
}
function paintSea(x, C, r) {
  const H0 = C * 0.56;
  x.fillStyle = lin(x, 0, 0, 0, H0, [[0, '#9a9a9a'], [0.7, '#d6d6d6'], [1, '#efefef']]); x.fillRect(0, 0, C, H0);
  const sx = C * 0.62;
  x.fillStyle = rad(x, sx, H0 - 30, 0, 110, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,.9)'], [1, 'rgba(255,255,255,0)']]);
  x.fillRect(0, 0, C, H0);
  x.fillStyle = '#fbfbfb'; x.beginPath(); x.arc(sx, H0 - 26, 36, 0, Math.PI * 2); x.fill();
  x.fillStyle = lin(x, 0, H0, 0, C, [[0, '#4a4a4a'], [1, '#1a1a1a']]); x.fillRect(0, H0, C, C - H0);
  x.lineCap = 'round';
  for (let y = H0 + 4; y < C; y += 4 + (y - H0) * 0.07) {
    const k = (y - H0) / (C - H0);
    for (let s = 0; s < 7; s++) {
      const x0 = r() * C, len = 20 + r() * 90 * (1 + k * 2);
      const near = Math.abs(x0 + len / 2 - sx) < 14 + k * 90;
      x.strokeStyle = near ? '#ececec' : (r() < 0.5 ? '#8c8c8c' : '#6a6a6a');
      x.lineWidth = 1 + k * 4;
      x.beginPath(); x.moveTo(x0, y);
      x.quadraticCurveTo(x0 + len / 2, y - 2 - k * 4, x0 + len, y); x.stroke();
    }
  }
}
function paintFlower(x, C, r) {
  x.fillStyle = rad(x, C / 2, C / 2, 20, C * 0.7, [[0, '#fafafa'], [1, '#dedede']]); x.fillRect(0, 0, C, C);
  x.translate(C * 0.5, C * 0.53); x.rotate(r() * 6.28);
  for (let i = 0; i < 5; i++) {
    x.rotate(Math.PI * 2 / 5);
    x.fillStyle = rad(x, 0, 0, 0, 200, [[0, '#0e0e0e'], [0.22, '#4a4a4a'], [1, '#c4c4c4']]);
    x.beginPath(); x.moveTo(0, 0);
    x.bezierCurveTo(-105, -48, -136, -180, -8, -196);
    x.quadraticCurveTo(8, -186, 26, -200);
    x.bezierCurveTo(140, -180, 105, -48, 0, 0); x.fill();
    x.strokeStyle = 'rgba(30,30,30,.55)'; x.lineWidth = 1.6;
    for (let v = -2; v <= 2; v++) { x.beginPath(); x.moveTo(0, -20); x.quadraticCurveTo(v * 18, -110, v * 34, -200); x.stroke(); }
  }
  x.strokeStyle = '#1e1e1e'; x.lineWidth = 7; x.lineCap = 'round';
  x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(40, -90, 96, -168); x.stroke();
  x.fillStyle = '#0c0c0c';
  for (let i = 0; i < 7; i++) { x.beginPath(); x.arc(96 + Math.cos(i) * 18, -168 + Math.sin(i * 1.7) * 16, 7, 0, 6.3); x.fill(); }
}
function paintRipples(x, C, r) {
  x.fillStyle = rad(x, C / 2, C * 0.55, 10, C * 0.75, [[0, '#8a8a8a'], [1, '#f2f2f2']]); x.fillRect(0, 0, C, C);
  const cx = C * 0.5, cy = C * 0.55;
  for (let k = 1; k <= 14; k++) {
    const rx = k * 24 + r() * 5;
    x.globalAlpha = 1 - k / 16; x.lineWidth = 7 - k * 0.3;
    x.strokeStyle = k % 2 ? '#f2f2f2' : '#262626';
    x.beginPath(); x.ellipse(cx, cy, rx, rx * 0.42, 0, 0, Math.PI * 2); x.stroke();
  }
  x.globalAlpha = 1; x.fillStyle = '#111'; x.beginPath(); x.arc(cx, cy, 9, 0, 6.3); x.fill();
}
function paintScribble(x, C, r) {
  x.fillStyle = '#efefef'; x.fillRect(0, 0, C, C);
  x.strokeStyle = '#151515'; x.lineWidth = 4; x.lineCap = 'round'; x.lineJoin = 'round';
  let px = C * 0.52, py = C * 0.45; x.beginPath(); x.moveTo(px, py);
  for (let i = 0; i < 70; i++) {
    const a = r() * 6.28, d = 40 + r() * 150;
    const nx = C * 0.52 + Math.cos(a) * d, ny = C * 0.45 + Math.sin(a) * d * 0.8;
    x.bezierCurveTo(px + (r() - 0.5) * 160, py + (r() - 0.5) * 160, nx + (r() - 0.5) * 160, ny + (r() - 0.5) * 160, nx, ny);
    px = nx; py = ny;
  }
  x.bezierCurveTo(px - 60, py + 120, C * 0.2, C * 0.8, -10, C * 0.96);
  x.stroke();
}
function paintNight(x, C, r) {
  x.fillStyle = lin(x, 0, 0, 0, C, [[0, '#3a3a3a'], [1, '#c8c8c8']]); x.fillRect(0, 0, C, C);
  const m = document.createElement('canvas'); m.width = m.height = C; const mx = m.getContext('2d');
  mx.fillStyle = '#f7f7f7'; mx.beginPath(); mx.arc(C * 0.62, C * 0.32, 86, 0, 6.3); mx.fill();
  mx.globalCompositeOperation = 'destination-out'; mx.beginPath(); mx.arc(C * 0.62 + 36, C * 0.32 - 20, 78, 0, 6.3); mx.fill();
  x.drawImage(m, 0, 0);
  x.fillStyle = '#f5f5f5';
  const star = (sx, sy, s) => { x.beginPath(); x.moveTo(sx, sy - s); x.quadraticCurveTo(sx, sy, sx + s, sy); x.quadraticCurveTo(sx, sy, sx, sy + s); x.quadraticCurveTo(sx, sy, sx - s, sy); x.quadraticCurveTo(sx, sy, sx, sy - s); x.fill(); };
  for (let i = 0; i < 9; i++) star(40 + r() * (C - 80), 30 + r() * C * 0.55, 8 + r() * 26);
  for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(r() * C, r() * C * 0.7, 1 + r() * 2.5, 0, 6.3); x.fill(); }
  x.fillStyle = '#141414'; x.beginPath(); x.moveTo(0, C * 0.82);
  x.bezierCurveTo(C * 0.3, C * 0.7, C * 0.55, C * 0.9, C, C * 0.76); x.lineTo(C, C); x.lineTo(0, C); x.fill();
}
function paintWord(g, it) {
  const [x0, y0] = it.rect, lines = it.word, k = CELL / 384;
  g.save(); g.translate(x0, y0);
  g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(0, 0, CELL, CELL);
  g.translate(CELL / 2, CELL / 2); g.rotate(-0.04);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const size = (lines.length === 1 ? 158 : 134) * k;
  g.font = `700 ${size}px ${CJK_SERIF}`;
  const lh = size * 1.06, top = -(lines.length - 1) * lh / 2;
  lines.forEach((l, i) => g.fillText(l, 0, top + i * lh + 5 * k));
  g.strokeStyle = '#e8e8e8'; g.lineWidth = 5 * k; g.lineCap = 'round';
  const uy = top + (lines.length - 1) * lh + size * 0.62;
  g.beginPath(); g.moveTo(-size * 0.95, uy); g.bezierCurveTo(-size * 0.3, uy + 8 * k, size * 0.3, uy - 6 * k, size * 0.98, uy + 3 * k); g.stroke();
  g.restore();
}
