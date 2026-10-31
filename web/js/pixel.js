'use strict';
// 结果页（探索手册）的进场过渡：只在跳进结果页时播一次，播完就是普通的、可以正常阅读的页面
// 第一屏的纸页（data-px="page"）先是闪烁的大像素块，再一级级变细，最后换回真正的页面；
// 接着第一屏的正文（data-px="text"）从块状字符逐字显影。改选项重画、第一屏以外的内容都直接显示；减少动态效果时整页直接显示
window.PixelReveal = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 闪烁用问卷原有的颜色：群青、朱红、深蓝墨、网点青
  const FLICK = ['#1d33e0', '#e0392c', '#1b2340', '#1f86b8'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
  const running = new Set();
  let layer = null, token = 0;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // 确定的伪随机：同一个格子在同一帧总是同一个结果，闪烁不会糊成噪点
  const hash = (a, b, c) => {
    let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1442695041) | 0;
    h = Math.imul(h ^ h >>> 13, 1274126177);
    return ((h ^ h >>> 16) >>> 0) / 4294967296;
  };
  const show = el => el.classList.remove('px-wait');
  const rgba = s => { const m = String(s).match(/[\d.]+/g) || [0, 0, 0, 0]; return [+m[0], +m[1], +m[2], m[3] == null ? 1 : +m[3]]; };
  const nearest = (tones, r, g, b) => {
    let best = tones[0], bd = Infinity;
    for (const t of tones) { const d = (t[0] - r) ** 2 + (t[1] - g) ** 2 + (t[2] - b) ** 2; if (d < bd) { bd = d; best = t; } }
    return best;
  };

  /* ---------- 纸页：从像素块里拼出来 ---------- */
  const STRETCH = [[56, 'ultra-condensed'], [69, 'extra-condensed'], [81, 'condensed'], [94, 'semi-condensed'], [106, 'normal'],
    [119, 'semi-expanded'], [138, 'expanded'], [1e9, 'extra-expanded']];
  // 按每个字在页面上的实际位置画到画布上，换行、混排中英文都对得上；等着逐字显影的正文不画。顺手记下用到的字色
  function paintChars(g, el, ox, oy, tones) {
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), range = document.createRange(), seen = new Set();
    g.textBaseline = 'middle'; g.textAlign = 'left';
    for (let n; (n = walk.nextNode());) {
      const host = n.parentElement;
      if (host.closest('.px-wait') !== el || !n.data.trim()) continue;
      const cs = getComputedStyle(host), s = n.data, upper = cs.textTransform === 'uppercase';
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('fontStretch' in g) g.fontStretch = (STRETCH.find(([p]) => parseFloat(cs.fontStretch) <= p) || [0, 'normal'])[1];
      g.fillStyle = cs.color;
      if (!seen.has(cs.color)) { seen.add(cs.color); tones.push(rgba(cs.color)); }
      for (let i = 0; i < s.length; i++) {
        if (/\s/.test(s[i])) continue;
        const w = s.codePointAt(i) > 0xffff ? 2 : 1, ch = s.substr(i, w);
        range.setStart(n, i); range.setEnd(n, i + w);
        const b = range.getBoundingClientRect();
        if (b.width) g.fillText(upper ? ch.toUpperCase() : ch, b.left - ox, b.top + b.height / 2 - oy);
        i += w - 1;
      }
    }
  }
  function block(el, delay) {
    return new Promise(done => {
      const host = layer.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) { show(el); done(); return; }
      const d = Math.min(devicePixelRatio || 1, 2), pad = 8, W = Math.ceil(r.width) + pad * 2, H = Math.ceil(r.height) + pad * 2;
      // 先把纸页最终的样子（纸色 + 每个字）画到离屏画布上，每一帧从它取样
      const full = document.createElement('canvas'); full.width = W * d; full.height = H * d;
      const g = full.getContext('2d'); g.scale(d, d);
      const bg = getComputedStyle(el).backgroundColor, tones = [];
      if (rgba(bg)[3] > 0) { g.fillStyle = bg; g.fillRect(pad, pad, r.width, r.height); tones.push(rgba(bg)); }
      paintChars(g, el, r.left - pad, r.top - pad, tones);
      const cv = document.createElement('canvas'); cv.className = 'px-canvas'; cv.width = W * d; cv.height = H * d;
      Object.assign(cv.style, { left: `${r.left - host.left - pad}px`, top: `${r.top - host.top - pad}px`, width: `${W}px`, height: `${H}px` });
      layer.appendChild(cv);
      const ctx = cv.getContext('2d'), small = document.createElement('canvas'), sg = small.getContext('2d', { willReadFrequently: true });
      // 每个格子只取纸色或某一种字色，像素字才是干净的
      const base = clamp(Math.min(r.width, r.height) / 16, 10, 36), steps = [base, base * 0.62, base * 0.4, base * 0.25, Math.max(3, base * 0.13), 2];
      const dur = 1150, t0 = performance.now() + delay;
      let raf = 0, last = -1;
      const job = { finish: () => end() };
      const end = () => {
        if (!running.delete(job)) return;
        cancelAnimationFrame(raf); cv.remove(); show(el); done();
      };
      running.add(job);
      const tick = now => {
        raf = requestAnimationFrame(tick);
        const t = (now - t0) / dur;
        if (t < 0) return;
        if (t >= 1) { end(); return; }
        // 像素先大后小；闪烁按约 16 帧每秒换一次，不跟着刷新率狂闪
        const si = Math.min(steps.length - 1, Math.floor(t * steps.length)), frame = Math.floor((now - t0) / 60);
        if (frame === last) return;
        last = frame;
        const p = steps[si], cw = Math.ceil(W / p), ch = Math.ceil(H / p);
        small.width = cw; small.height = ch;
        sg.imageSmoothingEnabled = true; sg.imageSmoothingQuality = 'high';
        sg.drawImage(full, 0, 0, cw * p * d, ch * p * d, 0, 0, cw, ch);
        const img = sg.getImageData(0, 0, cw, ch), px = img.data;
        const appear = clamp(t * 2.6, 0, 1), flick = Math.max(0, 0.16 - t * 0.2);
        for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
          const k = (j * cw + i) * 4;
          let c = px[k + 3] > 90 ? nearest(tones, px[k], px[k + 1], px[k + 2]) : null;
          if (hash(i, j, si) > appear) c = null;
          const f = hash(i, j, frame + 101);
          if (c && f < flick) c = f < flick * 0.4 ? null : FLICK[(i * 7 + j * 13 + frame) % FLICK.length];
          if (c) { px[k] = c[0]; px[k + 1] = c[1]; px[k + 2] = c[2]; px[k + 3] = 255; } else px[k + 3] = 0;
        }
        sg.putImageData(img, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height); ctx.imageSmoothingEnabled = false;
        ctx.drawImage(small, 0, 0, cw, ch, 0, 0, cw * p * d, ch * p * d);
      };
      raf = requestAnimationFrame(tick);
    });
  }

  /* ---------- 正文：从块状字符逐字显影 ---------- */
  const BLOCKS = '▖▗▘▝▚▞▙▟▛▜▄▀▌▐█▓▒░', LATIN = 'ABCDEFGHKMNPRSTUVWXYZ0123456789#+*/=';
  const glyph = (ch, n) => /[⺀-鿿＀-￯　-〿]/.test(ch) ? BLOCKS[n % BLOCKS.length]
    : /[A-Za-z0-9]/.test(ch) ? LATIN[n % LATIN.length] : ch;
  // 显影前沿的几个字是乱码块，后面的字还没出现；高度先按最终高度占住，页面不会跳
  function decode(el, delay) {
    const parts = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode());) parts.push({ n, s: n.data });
    const total = parts.reduce((a, x) => a + x.s.length, 0);
    if (!total) { show(el); return Promise.resolve(); }
    el.style.minHeight = `${el.getBoundingClientRect().height}px`;
    const rate = clamp(total / 0.8, 70, 1100), t0 = performance.now() + delay;
    let raf = 0, done;
    const job = { finish: () => end() };
    const end = () => {
      if (!running.delete(job)) return;
      cancelAnimationFrame(raf); parts.forEach(x => { x.n.data = x.s; }); el.style.minHeight = ''; show(el); done();
    };
    const paint = (shown, salt) => {
      let left = shown;
      for (const x of parts) {
        if (left >= x.s.length) x.n.data = x.s;
        else if (left < 0) x.n.data = '';
        else {
          let out = x.s.slice(0, left);
          for (let q = 0; q < 3 && left + q < x.s.length; q++) out += glyph(x.s[left + q], Math.floor(hash(left + q, salt, 3) * 97));
          x.n.data = out;
        }
        left -= x.s.length;
      }
    };
    running.add(job);
    paint(0, 0); show(el);
    const tick = now => {
      raf = requestAnimationFrame(tick);
      const ms = now - t0;
      if (ms < 0) return;
      const shown = Math.floor(ms / 1000 * rate);
      if (shown >= total) end(); else paint(shown, Math.floor(ms / 45));
    };
    raf = requestAnimationFrame(tick);
    return new Promise(r => { done = r; });
  }

  /* ---------- 挂载 ---------- */
  // entering：刚跳进结果页。只有这时、只对第一屏播；进场时页面会滚回顶部，所以按文档里的位置判断在不在第一屏
  // 过渡进行中，手册带着 px-playing，放完或被打断时去掉
  let playing = null;
  function mount(root, entering) {
    finishAll();
    layer = root.querySelector('.px-layer');
    if (!entering || reduce || !layer) return;
    playing = root; root.classList.add('px-playing');
    const my = token, first = el => el.getClientRects().length && el.getBoundingClientRect().top + scrollY < innerHeight;
    const pages = [...root.querySelectorAll('[data-px="page"]')].filter(first);
    const texts = [...root.querySelectorAll('[data-px="text"]')].filter(first);
    [...pages, ...texts].forEach(el => el.classList.add('px-wait'));
    // 字体还在下载（中文字体按字分片）就稍等，最多 0.7 秒，否则像素字和最后换上的文字对不上
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 700))])
      .then(() => my === token && Promise.all(pages.map((el, i) => block(el, i * 140))))
      .then(() => my === token && Promise.all(texts.map((el, i) => decode(el, Math.min(i, 10) * 70))))
      .then(() => { if (my === token) { root.classList.remove('px-playing'); playing = null; } });
  }
  // 直接放完：点一下页面、跳到某一章、打印、重画之前都会调用
  function finishAll() {
    token++;
    [...running].forEach(j => j.finish());
    document.querySelectorAll('.px-wait').forEach(show);
    playing?.classList.remove('px-playing'); playing = null;
  }

  return { mount, finishAll };
})();
