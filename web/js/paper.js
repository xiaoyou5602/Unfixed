'use strict';
// 呼吸的底页：设置、WebGL、碎片图集、印刷层、碎片、调参面板

/* ---------------- 设置 ---------------- */
const DEFAULTS = { cell: 10, amp: 1, speed: 1, frags: 3, threads: 2, wave: 0.8, paper: 'white' };
const S = { ...DEFAULTS };
try { Object.assign(S, JSON.parse(localStorage.getItem('breathing-paper-tune-v2') || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem('breathing-paper-tune-v2', JSON.stringify(S)); } catch (e) {} };
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- 小工具 ---------------- */
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeInOut = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

// 位移场：和着色器里的 field() 完全同一个公式，红线端点才能跟着纸面一起漂
function field(px, py, t) {
  let qx = px * 0.0034, qy = py * 0.0034;
  const wx = Math.sin(qy * 1.7 + t * 0.11) + 0.6 * Math.sin(qx * 1.13 - qy * 0.71 + t * 0.07);
  const wy = Math.sin(qx * 1.3 - t * 0.09) + 0.6 * Math.sin(qy * 1.27 + qx * 0.53 + t * 0.13);
  qx += wx * 0.55; qy += wy * 0.55;
  let dx = Math.sin(qy * 2.3 + t * 0.21);
  let dy = 0.9 * Math.sin(qx * 1.9 - t * 0.17);
  dx += 0.7 * Math.sin(qx * 1.37 + qy * 2.11 + t * 0.13 + 1.3);
  dy += 0.7 * Math.cos(-qx * 2.41 + qy * 0.83 - t * 0.19 + 0.4);
  dx += 0.35 * Math.cos(qx * 3.7 - qy * 1.3 + t * 0.29);
  dy += 0.35 * Math.sin(qx * 0.9 + qy * 3.9 + t * 0.23 + 2.0);
  return [dx, dy];
}
const AMP_PX = 16;

/* ---------------- WebGL ---------------- */
const canvas = document.getElementById('bg');
const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
if (!gl) document.body.classList.add('no-gl');


let prog, U = {}, atlasTex, printTex = [];
function compile(type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}
function makeTex(rgba) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(rgba));
  return t;
}
function upload(t, src) {
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
}
if (gl) {
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uRes', 'uDpr', 'uTime', 'uBreath', 'uCell', 'uAmp', 'uPaper', 'uCalm', 'uAtlas', 'uPrintA', 'uPrintB', 'uPrintMix', 'uN', 'uFR', 'uFC', 'uFP', 'uWave', 'uWaveXf', 'uWaveAmt'])
      U[n] = gl.getUniformLocation(prog, n);
    gl.uniform1i(U.uAtlas, 0); gl.uniform1i(U.uPrintA, 1); gl.uniform1i(U.uPrintB, 2);
    atlasTex = makeTex([255, 255, 255, 255]);
    printTex = [makeTex([0, 0, 0, 255]), makeTex([0, 0, 0, 255])];
  } catch (e) {
    console.error(e); document.body.classList.add('no-gl');
  }
}
const glOK = () => gl && prog && !document.body.classList.contains('no-gl');

/* ---------------- 字体 ---------------- */
const CJK_SANS = '"Noto Sans SC","Source Han Sans SC","Microsoft YaHei",sans-serif';
const CJK_SERIF = '"Noto Serif SC","Source Han Serif SC","SimSun",serif';
const WIDE = 'Archivo,"Arial Black",sans-serif';
const MONO = '"JetBrains Mono",Consolas,monospace';
const canStretch = 'fontStretch' in CanvasRenderingContext2D.prototype;
function setFont(g, spec, stretch) { g.font = spec; if (canStretch) g.fontStretch = stretch || 'normal'; }
function wideWidth(g, txt, size, weight = 900) { setFont(g, `${weight} ${size}px ${WIDE}`, 'expanded'); return g.measureText(txt).width * (canStretch ? 1 : 1.22); }
function wideText(g, txt, x, y, size, align, weight = 900) {
  setFont(g, `${weight} ${size}px ${WIDE}`, 'expanded'); g.textAlign = align;
  if (canStretch) { g.fillText(txt, x, y); return; }
  g.save(); g.translate(x, y); g.scale(1.22, 1); g.fillText(txt, 0, 0); g.restore();
}
const fontsReady = Promise.race([
  Promise.all([
    document.fonts.load(`900 100px "Noto Sans SC"`, '自我探索开场浪漫'),
    document.fonts.load(`900 100px Archivo`, 'UNFIXEDAROSPECMNTIC0123'),
    document.fonts.load(`700 100px "Noto Serif SC"`, '在意我不确定'),
    document.fonts.load(`500 12px "JetBrains Mono"`, 'UNFIXED')
  ]),
  new Promise(r => setTimeout(r, 3000))
]).catch(() => {});

/* ---------------- 碎片图集：素材由 web/tools/build_fragments.py 加工好，上半是深蓝版，下半是专色版（白=有墨） ---------------- */
const ATLAS = window.FRAGMENT_ATLAS || null;
const CELL = ATLAS ? ATLAS.cell : 384, COLS = 4, ROWS = ATLAS ? ATLAS.rows : 4;
const PW = CELL * COLS, PH = CELL * ROWS;
const SPOT_CODE = { red: 1, blue: 2 };
const cellRect = cell => [(cell % COLS) * CELL, Math.floor(cell / COLS) * CELL, CELL, CELL];
const ITEMS = (ATLAS ? ATLAS.items : []).map(it => ({ ...it, aspect: it.rect[2] / it.rect[3] }));
// 素材之后的格子：页面运行时画的图和字
const DRAWN = [
  { name: 'sun', paint: paintSun, blur: 2, spot: 'red' },
  { name: 'sea', paint: paintSea, blur: 1.2 },
  { name: 'flower', paint: paintFlower, blur: 1 },
  { name: 'ripples', paint: paintRipples, blur: 1.5 },
  { name: 'scribble', paint: paintScribble, blur: 0.6, spot: 'red' },
  { name: 'night', paint: paintNight, blur: 1.2 },
];
DRAWN.forEach(d => ITEMS.push({ ...d, cell: ITEMS.length, rect: cellRect(ITEMS.length), focus: [0, 0, 1, 1], anchor: null, whole: false, aspect: 1 }));
[['在意'], ['我不', '确定']].forEach(lines => ITEMS.push({ name: lines.join(''), cell: ITEMS.length, rect: cellRect(ITEMS.length),
  focus: [0, 0, 1, 1], spot: null, anchor: null, whole: true, aspect: lines.length === 1 ? 1.5 : 1, word: lines }));
const WORD_CARE = ITEMS.findIndex(it => it.name === '在意');
const WORD_UNSURE = ITEMS.findIndex(it => it.name === '我不确定');
const PHOTO_ITEMS = ITEMS.map((it, i) => i).filter(i => !ITEMS[i].word && !ITEMS[i].texture);
const WAVE = ITEMS.find(it => it.texture);

// 波浪建筑那张图铺满屏幕当底纹：屏幕坐标 → 图内 0~1
function waveXf(W, H) {
  if (!WAVE) return null;
  const [rx, ry, rw, rh] = WAVE.rect, ia = rw / rh, z = 1.2;
  let sx, sy;
  if (W / H > ia) { sx = 1 / (W * z); sy = ia / (W * z); } else { sy = 1 / (H * z); sx = 1 / (H * z * ia); }
  return { uv: [rx / PW, ry / PH, (rx + rw) / PW, (ry + rh) / PH], xf: [sx, sy, (1 - W * sx) / 2, (1 - H * sy) / 2] };
}

async function buildAtlas() {
  const a = document.createElement('canvas'); a.width = PW; a.height = PH * 2;
  const g = a.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, a.width, a.height);
  if (ATLAS) {
    const img = new Image(); img.src = ATLAS.src;
    try { await img.decode(); g.drawImage(img, 0, 0); } catch (e) { console.warn('图集读取失败', e); }
  }
  ITEMS.forEach((it, i) => { if (it.paint) paintDrawn(g, it, i * 977 + 13); else if (it.word) paintWord(g, it); });
  return a;
}

/* ---------------- 印刷层：红通道=克莱因蓝，绿通道=红，蓝通道=深蓝 ---------------- */
const printCanvas = document.createElement('canvas');
let printZone = null;  // 大标题大致占的区域，碎片尽量避开
const INK_BLUE = '#ff0000', INK_RED = '#00ff00', INK_NAVY = '#0000ff';
function drawPrint(page) {
  const W = innerWidth, H = innerHeight, pd = Math.min(devicePixelRatio || 1, 1.5);
  if (W < 2 || H < 2) return null;
  printCanvas.width = Math.round(W * pd); printCanvas.height = Math.round(H * pd);
  const g = printCanvas.getContext('2d');
  g.setTransform(pd, 0, 0, pd, 0, 0);
  g.globalCompositeOperation = 'source-over'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'lighter';
  const m = Math.max(16, W * 0.035);
  const pr = page.print;

  if (page.kind === 'cover') {
    setFont(g, `900 100px ${CJK_SANS}`);
    const F2 = Math.min(H * 0.25, 100 * (W * 0.62) / (g.measureText(pr.big).width * 1.06));
    const F1 = Math.min(H * 0.2, 100 * (W - m * 2) / wideWidth(g, pr.latin, 100));
    g.fillStyle = INK_BLUE;
    g.save(); g.translate(m - F2 * 0.03, H + F2 * 0.04); g.scale(1.06, 1);
    setFont(g, `900 ${F2}px ${CJK_SANS}`); g.textAlign = 'left'; g.textBaseline = 'ideographic'; g.fillText(pr.big, 0, 0); g.restore();
    g.textBaseline = 'alphabetic';
    const yL = H + F2 * 0.04 - F2 * 0.93 - F1 * 0.1;
    printZone = { x: 0, y: yL - F1 * 0.8, w: W, h: H - (yL - F1 * 0.8) };
    wideText(g, pr.latin, m - F1 * 0.04, yL, F1, 'left');
    g.fillStyle = INK_NAVY; setFont(g, `500 11px ${MONO}`); g.textAlign = 'left';
    g.fillText('SELF-EXPLORATION TEST · 自我探索测试 · SHEET 00', m, yL - F1 * 0.78 - 14);
  } else {
    const F = Math.min(H * 0.4, W * 0.34);
    g.fillStyle = INK_BLUE;
    g.save(); g.translate(W - m + F * 0.02, H + F * 0.05); g.scale(1.08, 1);
    setFont(g, `900 ${F}px ${CJK_SANS}`); g.textAlign = 'right'; g.textBaseline = 'ideographic'; g.fillText(pr.big, 0, 0); g.restore();
    g.textBaseline = 'alphabetic';
    const L = Math.max(14, F * 0.15), yL = H + F * 0.05 - F * 0.95 - L * 0.35;
    printZone = { x: W - m - F * 2.25, y: yL - L, w: F * 2.25 + m, h: H - (yL - L) };
    wideText(g, pr.latin, W - m, yL, L, 'right', 800);
    g.fillStyle = INK_RED;
    const lw = wideWidth(g, pr.latin, L, 800);
    wideText(g, pr.no, W - m - lw - L * 0.6, yL, L, 'right', 800);
  }

  // 角标、套准标记、色条、竖排小字
  g.strokeStyle = INK_NAVY; g.lineWidth = 1;
  const cm = (x, y, sx, sy) => { g.beginPath(); g.moveTo(x, y + sy * 8); g.lineTo(x, y + sy * 22); g.moveTo(x + sx * 8, y); g.lineTo(x + sx * 22, y); g.stroke(); };
  cm(10, 10, 1, 1); cm(W - 10, 10, -1, 1); cm(10, H - 10, 1, -1); cm(W - 10, H - 10, -1, -1);
  const rx = W - 22, ry = H * 0.5;
  g.beginPath(); g.arc(rx, ry, 7, 0, 6.3); g.moveTo(rx - 12, ry); g.lineTo(rx + 12, ry); g.moveTo(rx, ry - 12); g.lineTo(rx, ry + 12); g.stroke();
  [INK_BLUE, INK_RED, INK_NAVY].forEach((c, i) => { g.fillStyle = c; g.fillRect(12, H * 0.38 + i * 13, 9, 9); });
  g.fillStyle = INK_NAVY;
  for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(13.5 + (i % 3) * 3, H * 0.38 + 39 + 1.5 + Math.floor(i / 3) * 3, 1, 0, 6.3); g.fill(); }
  g.save(); g.translate(W - 14, ry + 30); g.rotate(Math.PI / 2);
  setFont(g, `500 9px ${MONO}`); g.textAlign = 'left'; g.fillText('UNFIXED · SELF-EXPLORATION · BREATHING SHEET', 0, 0); g.restore();
  return printCanvas;
}
let printCur = 0, printMix = 0, printAnim = null;
function finishPrint() { if (printAnim) { printCur = 1 - printCur; printMix = 0; printAnim = null; } }
function setPrint(page, animate) {
  if (!glOK()) return;
  finishPrint();
  const src = drawPrint(page);
  if (!src) return;
  if (!animate) { upload(printTex[printCur], src); return; }
  upload(printTex[1 - printCur], src);
  printAnim = { t0: performance.now(), dur: reduceMotion ? 300 : 1400 };
}

/* ---------------- 碎片 ---------------- */
const MAXF = 10, IN_MS = 3600, OUT_MS = 4200;
const frags = [];
const slipWrap = document.getElementById('slipWrap');
let nextAmbient = 0;
const narrow = () => innerWidth < 700;

function overlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function overlapArea(a, b) { return Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)); }
function inflate(r, d) { return { x: r.x - d, y: r.y - d, w: r.w + 2 * d, h: r.h + 2 * d }; }
// 名词库打开时纸条藏起来了，网点安静区和碎片避让改按名词库那张纸算
function slipRect() { const r = (slipWrap.hidden ? document.getElementById('lexWrap') : slipWrap).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, right: r.right, bottom: r.bottom }; }

// 找位置：试一批候选，挑离已有碎片最远、少压大标题的那个；挤不下就不放
function findSpot(w, h, pref, minGap) {
  const W = innerWidth, H = innerHeight, top = 58, mg = 14, sr = inflate(slipRect(), 26);
  if (W - w - mg < mg || H - h - mg < top) return null;
  const others = frags.filter(f => f.phase !== 'out');
  let best = null, bestScore = -Infinity, bestGap = -Infinity;
  for (let i = 0; i < 70; i++) {
    let x, y;
    if (pref && i < 45 && pref.x1 - pref.x0 > w) {
      x = rand(pref.x0, pref.x1 - w);
      y = pref.y != null ? clamp(pref.y + rand(-260, 260) - h / 2, top, H - h - mg) : rand(top, H - h - mg);
    } else { x = rand(mg, W - w - mg); y = rand(top, H - h - mg); }
    const r = { x, y, w, h };
    if (overlap(r, sr)) continue;
    let gap = 400;
    for (const f of others) gap = Math.min(gap, Math.max(f.x - (x + w), x - (f.x + f.w), f.y - (y + h), y - (f.y + f.h)));
    const title = printZone ? overlapArea(r, printZone) / (w * h) : 0;
    const score = Math.min(gap, 220) - title * 140 + Math.random() * 25;
    if (score > bestScore) { bestScore = score; best = r; bestGap = gap; }
  }
  return best && bestGap >= minGap ? best : null;
}
// 取景：在图的重点区域里随机截一块，比例跟碎片一致
function makeCrop(it, aspect) {
  const [rx, ry, rw, rh] = it.rect;
  let x0, y0, cw, ch;
  if (it.whole) {
    cw = rw; ch = cw / aspect; if (ch > rh) { ch = rh; cw = ch * aspect; }
    x0 = rx + (rw - cw) / 2; y0 = ry + (rh - ch) / 2;
  } else {
    const [a0, b0, a1, b1] = it.focus;
    const fx = rx + a0 * rw, fy = ry + b0 * rh, fw = (a1 - a0) * rw, fh = (b1 - b0) * rh;
    cw = rand(0.62, 1) * Math.min(fw, fh * aspect); ch = cw / aspect;
    x0 = rand(fx, fx + fw - cw); y0 = rand(fy, fy + fh - ch);
    if (it.anchor && Math.random() < 0.75) {
      // 让图里红线伸出画面的那一点落在取景里，页面上的线才能从那里接出去
      const ax = rx + it.anchor[0] * rw, ay = ry + it.anchor[1] * rh;
      x0 = clamp(ax - cw * rand(0.1, 0.4), rx, rx + rw - cw); y0 = clamp(ay - ch * rand(0.3, 0.7), ry, ry + rh - ch);
    }
  }
  return { uv: [x0 / PW, y0 / PH, (x0 + cw) / PW, (y0 + ch) / PH], px: [x0, y0, cw, ch] };
}
function pickItem() {
  const shown = new Set(frags.filter(f => f.phase !== 'out').map(f => f.item));
  // 字在小碎片上会糊成一团，窄屏就不出
  if (!narrow() && Math.random() < 0.12 && !shown.has(WORD_CARE)) return WORD_CARE;
  let pool = PHOTO_ITEMS.filter(i => !shown.has(i));
  if (!pool.length) pool = PHOTO_ITEMS.length ? PHOTO_ITEMS : [WORD_CARE];
  return pool[Math.floor(Math.random() * pool.length)];
}
function spawn({ item = pickItem(), pref = null, minGap = 30, lifeAhead = 0 } = {}) {
  if (innerWidth < 200 || innerHeight < 200 || item < 0) return null;
  const it = ITEMS[item];
  const aspect = it.whole ? it.aspect : clamp(it.aspect * rand(0.8, 1.15), 0.6, 1.6);
  // 尺寸跟着屏幕走：大约是屏幕"边长"的 14%~21%，按面积算，竖屏也不会大
  const side = Math.sqrt(innerWidth * innerHeight) * rand(0.14, 0.21) * (it.word ? 1.1 : 1);
  const w = side * Math.sqrt(aspect), h = side / Math.sqrt(aspect);
  const spot = findSpot(w, h, pref, minGap);
  if (!spot) return null;
  if (frags.length >= MAXF) { const i = frags.findIndex(f => f.phase === 'out'); frags.splice(i >= 0 ? i : 0, 1); }
  const crop = makeCrop(it, aspect);
  const f = { ...spot, item, crop: crop.uv, seed: Math.random() * 10, spot: SPOT_CODE[it.spot] || 0,
    phase: 'in', t0: performance.now() - lifeAhead, hold: rand(8000, 14000), life: 0 };
  if (it.anchor) {
    const [x0, y0, cw, ch] = crop.px;
    const u = (it.rect[0] + it.anchor[0] * it.rect[2] - x0) / cw, v = (it.rect[1] + it.anchor[1] * it.rect[3] - y0) / ch;
    const dir = { left: Math.PI, right: 0, up: -Math.PI / 2, down: Math.PI / 2 }[it.anchor[2]] ?? Math.PI;
    if (u > 0.04 && u < 0.96 && v > 0.04 && v < 0.96) f.anchor = { x: f.x + u * f.w, y: f.y + v * f.h, dir };
  }
  frags.push(f);
  return f;
}
function fragLife(f, now) {
  if (f.phase === 'in') {
    const k = (now - f.t0) / IN_MS;
    if (k >= 1) { f.phase = 'hold'; f.t0 = now; return 0.5; }
    return 0.5 * k;
  }
  if (f.phase === 'hold') {
    if (now - f.t0 > f.hold) { f.phase = 'out'; f.t0 = now; }
    return 0.5;
  }
  const k = (now - f.t0) / OUT_MS;
  if (k >= 1) { f.dead = true; return 1; }
  return 0.72 + 0.28 * k;
}
function ambient(now) {
  const n = frags.filter(f => f.phase !== 'out').length;
  if (n >= (narrow() ? Math.min(S.frags, 2) : S.frags) || now < nextAmbient) return;
  let pref = null;
  if (PAGES[cur].kind === 'cover') { const sr = slipRect(); if (sr.x > 260) pref = { x0: 16, x1: sr.x - 30, y: null }; }
  spawn({ pref });
  nextAmbient = now + rand(2600, 5200);
}
// 勾选一项时，在纸条旁边显影一块碎片（不牵线）；没地方就不放
function pulse(el, item) {
  const sr = slipRect(), W = innerWidth, er = el.getBoundingClientRect();
  const y = er.top + er.height / 2;
  let pref = null;
  if (W - sr.right > 200) pref = { x0: sr.right + 40, x1: W - 16, y };
  else if (sr.x > 200) pref = { x0: 16, x1: sr.x - 40, y };
  spawn({ item: item ?? pickItem(), pref, minGap: 8 });
}

/* ---------------- 调参面板 ---------------- */
const tune = document.getElementById('tune'), tuneBtn = document.getElementById('tuneBtn');
tuneBtn.addEventListener('click', () => { tune.hidden = !tune.hidden; tuneBtn.setAttribute('aria-expanded', String(!tune.hidden)); });
const sliders = { cell: v => v.toFixed(1) + 'px', amp: v => v.toFixed(2) + '×', speed: v => v.toFixed(2) + '×', frags: v => String(v), threads: v => String(v), wave: v => Math.round(v * 100) + '%' };
function syncTune() {
  for (const k in sliders) { document.getElementById('t-' + k).value = S[k]; document.getElementById('o-' + k).textContent = sliders[k](+S[k]); }
  document.documentElement.dataset.paper = S.paper;
  tune.querySelectorAll('[data-paper]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.paper === S.paper)));
}
for (const k in sliders) document.getElementById('t-' + k).addEventListener('input', e => { S[k] = +e.target.value; syncTune(); save(); });
tune.querySelectorAll('[data-paper]').forEach(b => b.addEventListener('click', () => { S.paper = b.dataset.paper; syncTune(); save(); }));
document.getElementById('t-bgonly').addEventListener('change', e => document.body.classList.toggle('bg-only', e.target.checked));
document.getElementById('t-reset').addEventListener('click', () => { Object.assign(S, DEFAULTS); syncTune(); save(); });
syncTune();
