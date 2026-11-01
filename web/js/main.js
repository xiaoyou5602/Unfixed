'use strict';
// 尺寸、主循环和启动。放在最后加载，前面几个文件都要用到

/* ---------------- 尺寸与主循环 ---------------- */
let dpr = 1;
function resize() {
  if (!glOK()) return;
  const W = canvas.clientWidth, H = canvas.clientHeight;
  dpr = Math.min(devicePixelRatio || 1, 2);
  const area = W * H;
  if (area * dpr * dpr > 3.6e6) dpr = Math.max(0.75, Math.sqrt(3.6e6 / area));
  const width = Math.max(1, Math.round(W * dpr)), height = Math.max(1, Math.round(H * dpr));
  // 即使赋相同值也会清空 WebGL 画布；只在确实变化时调整。
  if (canvas.width === width && canvas.height === height) return;
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  setPrint(Lexicon.printPage(), false);
}
let resizeQueued = true;
addEventListener('resize', () => { resizeQueued = true; });

const PAPER = { cream: [0.949, 0.933, 0.894], white: [0.969, 0.969, 0.961] };
const FR = new Float32Array(40), FC = new Float32Array(40), FP = new Float32Array(40);
let simT = 37, lastNow = performance.now(), lastDraw = 0;
function frame(now) {
  requestAnimationFrame(frame);
  if (now - lastDraw < 31) return;
  // 手机地址栏伸缩会连续触发 resize。清空和重画必须在同一帧内完成，
  // 不能在独立回调里清空后被上面的限帧跳过，留下不透明黑帧。
  if (resizeQueued) { resizeQueued = false; resize(); }
  const dt = Math.min(0.1, (now - lastNow) / 1000); lastNow = now; lastDraw = now;
  simT += dt * S.speed * (reduceMotion ? 0.15 : 1);
  const breath = reduceMotion ? 0 : Math.sin(now / 1000 * Math.PI * 2 / 9.5);
  const ampPx = S.amp * AMP_PX;

  if (printAnim) { printMix = clamp((now - printAnim.t0) / printAnim.dur, 0, 1); if (printMix >= 1) finishPrint(); }
  for (const f of frags) f.life = fragLife(f, now);
  for (let i = frags.length - 1; i >= 0; i--) if (frags[i].dead) frags.splice(i, 1);
  if (texturesReady) { ambient(now); threadTick(now); }
  drawLoose(now, simT, ampPx);

  if (!glOK()) return;
  const W = canvas.width / dpr, H = canvas.height / dpr;
  const n = Math.min(frags.length, MAXF);
  for (let i = 0; i < n; i++) {
    const f = frags[i];
    FR.set([f.x, f.y, f.w, f.h], i * 4); FC.set(f.crop, i * 4); FP.set([f.life, f.seed, 0, f.spot], i * 4);
  }
  const sr = slipRect(), bgOnly = document.body.classList.contains('bg-only');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(U.uRes, W, H); gl.uniform1f(U.uDpr, dpr); gl.uniform1f(U.uTime, simT); gl.uniform1f(U.uBreath, breath);
  // 网点也跟着屏幕大小缩放
  gl.uniform1f(U.uCell, S.cell * clamp(Math.sqrt(W * H) / 1000, 0.75, 1.2)); gl.uniform1f(U.uAmp, ampPx); gl.uniform3fv(U.uPaper, PAPER[S.paper] || PAPER.white);
  gl.uniform4f(U.uCalm, sr.x, sr.y, bgOnly ? 0 : sr.w, sr.h);
  gl.uniform1f(U.uPrintMix, printMix); gl.uniform1i(U.uN, n);
  gl.uniform4fv(U.uFR, FR); gl.uniform4fv(U.uFC, FC); gl.uniform4fv(U.uFP, FP);
  const wx = waveXf(W, H);
  gl.uniform4fv(U.uWave, wx ? wx.uv : [0, 0, 0, 0]); gl.uniform4fv(U.uWaveXf, wx ? wx.xf : [0, 0, 0, 0]);
  gl.uniform1f(U.uWaveAmt, wx && texturesReady ? S.wave : 0);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, atlasTex);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, printTex[printCur]);
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, printTex[1 - printCur]);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

let texturesReady = false;
render();
fontsReady.then(async () => {
  if (glOK()) { upload(atlasTex, await buildAtlas()); setPrint(Lexicon.printPage(), false); }
  texturesReady = true;
  // 一打开就有碎片在显影途中、有线已经落在纸上
  const now = performance.now(), sr = slipRect();
  const left = sr.x > 260 ? { x0: 16, x1: sr.x - 30, y: null } : null;
  if (S.frags > 0) spawn({ lifeAhead: IN_MS * 0.85, pref: left });
  if (S.frags > 1) spawn({ lifeAhead: IN_MS * 0.4 });
  // 手机上两根一左一右地斜，交叉成 X
  for (let i = 0; i < Math.min(2, S.threads); i++) spawnThread({ ahead: 1e6, lean: narrow() ? (i % 2 ? -1 : 1) : 0 });
  nextAmbient = now + 1800; nextThread = now + 4000;
});
let refontTimer = 0;
document.fonts.addEventListener?.('loadingdone', () => {
  clearTimeout(refontTimer);
  refontTimer = setTimeout(async () => { if (texturesReady && glOK()) { upload(atlasTex, await buildAtlas()); setPrint(Lexicon.printPage(), false); } }, 400);
});
requestAnimationFrame(frame);
