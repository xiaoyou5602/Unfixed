'use strict';
// 散落的红线：从一边进、从对面出，跟着纸面一起漂

/* ---------------- 散落的红线 ---------------- */
const svg = document.getElementById('threads');
const SVGNS = 'http://www.w3.org/2000/svg';
const STEP = 10;
const loose = [];
let nextThread = 0;

function edgePoint(W, H, o, side = Math.floor(Math.random() * 4)) {
  if (side === 0) return { side, x: -o, y: rand(0.12, 0.88) * H, dir: rand(-0.5, 0.5) };
  if (side === 1) return { side, x: W + o, y: rand(0.12, 0.88) * H, dir: Math.PI + rand(-0.5, 0.5) };
  if (side === 2) return { side, x: rand(0.12, 0.88) * W, y: -o, dir: Math.PI / 2 + rand(-0.5, 0.5) };
  return { side, x: rand(0.12, 0.88) * W, y: H + o, dir: -Math.PI / 2 + rand(-0.5, 0.5) };
}
// 一根长线从一边进、从对面出，中途最多经过一个落点、打一个小圈。
// 最后一个落点是屏幕外的出口：真走出屏幕才算数，走不出去就返回 null，免得线头停在页面中间
function walk(start, dir, targets) {
  const W = innerWidth, H = innerHeight, maxN = Math.round((W + H) * 1.8 / STEP), M = 60;
  // 手机屏幕窄，一个圈就占了快三分之一，看着像原地转晕，所以手机上不打圈
  const maxLoops = narrow() ? 0 : 1;
  let x = start.x, y = start.y, th = dir, kappa = 0, loop = 0, loopN = 0, loopDir = 1, loopTurns = [], ti = 0, since = 0, loops = 0;
  const pts = [[x, y]];
  for (let i = 0; i < maxN; i++) {
    const tg = targets[ti], exit = ti === targets.length - 1;
    let d = Math.atan2(tg.y - y, tg.x - x) - th; d = Math.atan2(Math.sin(d), Math.cos(d));
    th += d * (loop > 0 ? 0.008 : 0.035);
    if (exit) { if (i > 20 && (x < -M || x > W + M || y < -M || y > H + M)) return pts; }
    // 中途的落点走近了或者走了太久就换下一个，免得围着一个点打转
    else if (Math.hypot(tg.x - x, tg.y - y) < 110 || ++since > 110) { ti++; since = 0; }
    if (loop > 0) { th += loopDir * loopTurns[loopN - loop]; loop--; }
    else if (i > 20 && loops < maxLoops && Math.random() < 0.005) {
      // 像草书的 l：先走直，再急转一圈压过自己。转弯集中在偏一头的位置，圈是歪的水滴形，不是正圆
      loopN = Math.round(rand(20, 32)); loop = loopN; loopDir = kappa >= 0 ? 1 : -1; loops++;
      const e = Math.log(0.5) / Math.log(rand(0.3, 0.7)), total = Math.PI * 2 * rand(0.9, 1.08), wts = [];
      for (let j = 0; j < loopN; j++) wts.push(Math.pow(Math.sin(Math.PI * Math.pow((j + 0.5) / loopN, e)), 4) + 0.01);
      const sum = wts.reduce((a, b) => a + b, 0);
      loopTurns = wts.map(w => total * w / sum);
    }
    kappa = kappa * 0.93 + (Math.random() - 0.5) * 0.03; th += kappa;
    x += Math.cos(th) * STEP; y += Math.sin(th) * STEP;
    pts.push([x, y]);
  }
  return null;
}
const OPPOSITE = [1, 0, 3, 2];
// 手机屏幕又细又长，上进下出的线几乎是笔直的竖线，两根并排像栏杆。
// 所以手机上斜着穿：lean=1 从左上进、右下出，lean=-1 左右镜像，两根各取一边就交叉成 X
function slantEnds(W, H, lean) {
  const top = Math.random() < 0.5;
  const start = top ? { side: 2, x: rand(0.08, 0.45) * W, y: -30 } : { side: 0, x: -30, y: rand(0.06, 0.32) * H };
  // 上进下出在细长的屏幕上还是太竖，所以上边进的一定从右边出
  const exit = top || Math.random() < 0.5 ? { side: 1, x: W + 140, y: rand(0.62, 0.9) * H } : { side: 3, x: rand(0.6, 0.95) * W, y: H + 140 };
  if (lean < 0) for (const p of [start, exit]) { p.x = W - p.x; if (p.side < 2) p.side = 1 - p.side; }
  start.dir = Math.atan2(exit.y - start.y, exit.x - start.x) + rand(-0.3, 0.3);
  return { start, exit };
}
function spawnThread({ from = null, ahead = 0, lean = 0 } = {}) {
  const W = innerWidth, H = innerHeight;
  if (W < 200 || H < 200) return;
  // 偶尔走不出屏幕，换个走法重来几次；都不行就这次不放线
  let pts = null;
  for (let tries = 0; !pts && tries < 6; tries++) {
    let start, exit;
    if (from) { start = { ...from.anchor, side: 1 }; exit = edgePoint(W, H, 140, 0); }
    else if (lean) ({ start, exit } = slantEnds(W, H, lean));
    else { start = edgePoint(W, H, 30); exit = edgePoint(W, H, 140, OPPOSITE[start.side]); }
    const dir = from ? from.anchor.dir + rand(-0.3, 0.3) : start.dir;
    const targets = [];
    let live = frags.filter(f => f.phase !== 'out' && f !== from);
    // 斜穿的线只去绕斜线附近的图，离得远的图会把线拽回竖直
    if (lean) live = live.filter(f => Math.abs((exit.x - start.x) * (f.y + f.h / 2 - start.y) - (exit.y - start.y) * (f.x + f.w / 2 - start.x))
      / Math.hypot(exit.x - start.x, exit.y - start.y) < 0.22 * W);
    if (live.length && Math.random() < 0.5) {
      const f = live[Math.floor(Math.random() * live.length)];
      targets.push({ x: f.x + f.w * rand(0.3, 0.7), y: f.y + f.h * rand(0.3, 0.7) });
    } else if (lean) targets.push({ x: (start.x + exit.x) / 2 + rand(-0.12, 0.12) * W, y: (start.y + exit.y) / 2 + rand(-0.08, 0.08) * H });
    else if (!from) targets.push({ x: rand(0.2, 0.8) * W, y: rand(0.2, 0.8) * H });
    targets.push(exit);
    pts = walk(start, dir, targets);
  }
  if (!pts) return;
  const path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('pathLength', '1'); path.style.strokeWidth = rand(0.9, 1.3).toFixed(2);
  svg.append(path);
  loose.push({ pts, path, from, lean, state: 'lay', t0: performance.now() - ahead,
    layMs: clamp(pts.length * STEP / 170 * 1000, 3500, 12000), rest: rand(18000, 34000), pullMs: 6500, phase: Math.random() * 10 });
}
function threadTick(now) {
  // 手机上正在被抽走的线也算数，免得旧线还没抽干净新线就出来，同屏挤三根
  const mine = loose.filter(t => !t.from && (narrow() || t.state !== 'pull'));
  if (mine.length < S.threads && now > nextThread) {
    // 手机上新线跟还在的那根反着斜，两根交叉
    const other = mine.find(t => t.state !== 'pull' && t.lean);
    const lean = narrow() ? (other ? -other.lean : (Math.random() < 0.5 ? 1 : -1)) : 0;
    spawnThread({ lean }); nextThread = now + rand(5000, 9000);
  }
  // 缠线的那张图显影出来时，从图里红线伸出的地方接一根线出去
  for (const f of frags) if (f.anchor && f.phase === 'hold' && !f.threaded) { f.threaded = true; spawnThread({ from: f }); }
}
function catmull(p) {
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)} ${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)} ${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return d;
}
function drawLoose(now, simT, ampPx) {
  for (const t of loose) {
    let off = 0;
    if (t.state === 'lay') {
      const k = (now - t.t0) / t.layMs;
      if (k >= 1) { t.state = 'rest'; t.t0 = now; } else off = 1 - easeInOut(k);
    } else if (t.state === 'rest') {
      if (now - t.t0 > t.rest || (t.from && t.from.phase === 'out')) { t.state = 'pull'; t.t0 = now; }
    }
    if (t.state === 'pull') {
      const k = (now - t.t0) / t.pullMs;
      if (k >= 1) { t.dead = true; continue; }
      // 从图里接出来的线收回图里，散落的线从一头被抽走
      off = t.from ? easeInOut(k) : -easeInOut(k);
    }
    const P = t.pts, n = P.length, q = new Array(n);
    for (let i = 0; i < n; i++) {
      const [bx, by] = P[i], d = field(bx, by, simT);
      // 线浮在纸面上，比网点多漂一点；从图里接出来的那一段先跟着图走
      const k = t.from && i < 14 ? 0.55 + 0.35 * i / 14 : 0.9;
      const a = P[Math.min(n - 1, i + 1)], b = P[Math.max(0, i - 1)];
      const tx = a[0] - b[0], ty = a[1] - b[1], tl = Math.hypot(tx, ty) || 1;
      // 两道沿线走的波：短的细细抖，长的慢慢往反方向荡，线才不像钉在纸上
      const wob = (Math.sin(i * 0.33 + simT * 0.9 + t.phase) * 2.4 + Math.sin(i * 0.11 - simT * 0.5 + t.phase * 1.7) * 3.4) * Math.min(1, i / 6);
      q[i] = [bx - d[0] * ampPx * k - ty / tl * wob, by - d[1] * ampPx * k + tx / tl * wob];
    }
    t.path.setAttribute('d', catmull(q));
    t.path.style.strokeDashoffset = off.toFixed(4);
  }
  for (let i = loose.length - 1; i >= 0; i--) if (loose[i].dead) { loose[i].path.remove(); loose.splice(i, 1); }
}
