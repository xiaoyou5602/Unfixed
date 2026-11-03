'use strict';
// 下载 PDF：不少手机浏览器点打印没有反应，这里在本机把结果页按打印样式画成图，再一页页写进 PDF。
// 版面就是直接打印的版面：同一份 handbook-print.css，A4 四边留 10 毫米，每章从新的一页开始，长的章只在两行字之间分页。
// 画图在 html2canvas 复制出来的页面副本里做，正在看的页面和结果页上的选择都不动。
// PDF 是图片版，文字不能选中复制。两个依赖随站点提供（assets/vendor），点按钮时才加载；回答和结果不离开这台设备。
window.HandbookPDF = (() => {
  const base = document.currentScript.src;
  const FILES = { html2canvas: 'html2canvas.min.js', jspdf: 'jspdf.umd.min.js' };
  // A4 去掉页边后的内容区，按 96 dpi 换成 CSS 像素（718 × 1047）：打印时页面就按这个宽度排版
  const A4 = { w: 210, h: 297, margin: 10 }, PX = 96 / 25.4;
  const WIDTH = Math.round((A4.w - 2 * A4.margin) * PX), HEIGHT = Math.floor((A4.h - 2 * A4.margin) * PX);
  const loading = {};
  let busy = false, downloadURL;

  function load(name) {
    if (window[name]) return Promise.resolve(window[name]);
    if (loading[name]) return loading[name];
    return loading[name] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { clearTimeout(timer); script.remove(); delete loading[name]; reject(new Error('PDF 组件加载失败，请检查网络后重试。')); };
      const timer = setTimeout(fail, 20000);
      script.src = new URL(`../assets/vendor/${FILES[name]}`, base).href;
      script.onload = () => { clearTimeout(timer); if (window[name]) resolve(window[name]); else fail(); };
      script.onerror = fail;
      document.head.appendChild(script);
    });
  }

  // 打印样式的原文：副本里直接插一份 <style>。只把副本里 <link> 的 media 改成 all 时，安卓 Edge 不重排，
  // 画出来还是网页版式（背景发黄、留着按钮、每章只有 632px 宽），再拉到 A4 宽就成了扁字。本地 file:// 读不到原文时才退回改 media
  async function printCSS() {
    const link = document.querySelector('link[href*="handbook-print.css"]');
    if (!link) throw new Error('页面缺少打印样式。');
    try { return [...link.sheet.cssRules].map(r => r.cssText).join('\n'); } catch (e) {}
    try { const r = await fetch(link.href); if (r.ok) return await r.text(); } catch (e) {}
    return null;
  }

  // 副本里打开打印样式，展开全部特征和体验举例（和直接打印前一样），等新露出来的字的字体到齐，再按打印宽度量封面的词
  async function printLayout(doc, css) {
    const link = doc.querySelector('link[href*="handbook-print.css"]');
    if (!link) throw new Error('页面缺少打印样式。');
    if (css) {
      const style = doc.createElement('style');
      style.textContent = css;
      doc.head.appendChild(style);
    } else {
      link.media = 'all';
      if (!link.sheet) await new Promise(resolve => { link.addEventListener('load', resolve, { once: true }); link.addEventListener('error', resolve, { once: true }); });
    }
    doc.querySelectorAll('.hb-more').forEach(d => { d.open = true; });
    void doc.body.offsetHeight;
    await doc.fonts.ready;
    Handbook.fit(doc.querySelector('.hb'));
  }

  // 每行字和每个图形占的上下范围（相对这一章顶端）；分页线不能落在这些范围里面
  function spansOf(el) {
    const doc = el.ownerDocument, top = el.getBoundingClientRect().top, spans = [];
    const add = r => { if (r.height) spans.push([r.top - top, r.bottom - top]); };
    const range = doc.createRange(), walker = doc.createTreeWalker(el, 4 /* 只看文字 */);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      range.selectNodeContents(n);
      [...range.getClientRects()].forEach(add);
    }
    el.querySelectorAll('svg,img,canvas').forEach(x => add(x.getBoundingClientRect()));
    return spans;
  }

  // 把一章切成若干页：每页尽量排满，分页线往上挪到两行字之间；一块东西比一页还高时才硬切
  function cutsOf(spans, total, page) {
    const cuts = [0];
    while (total - cuts[cuts.length - 1] > page) {
      const start = cuts[cuts.length - 1];
      let y = start + page, moved = true;
      while (moved) {
        moved = false;
        for (const [a, b] of spans) if (a > start && a < y && y < b) { y = a; moved = true; }
      }
      cuts.push(y - start < page / 3 ? start + page : y);
    }
    cuts.push(total);
    return cuts;
  }

  async function create(book, progress) {
    const [html2canvas, { jsPDF }] = await Promise.all([load('html2canvas'), load('jspdf')]);
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    pdf.setProperties({ title: 'Unfixed 自我探索手册', creator: 'Unfixed' });
    const chapters = [...book.querySelectorAll('.hb-page')];
    if (!chapters.length) throw new Error('没有找到可导出的结果。');
    const sheet = document.createElement('canvas'), ctx = sheet.getContext('2d');
    if (!ctx) throw new Error('当前浏览器无法生成页面图像。');
    const css = await printCSS(), contentW = A4.w - 2 * A4.margin;
    let pages = 0;
    try {
      for (let i = 0; i < chapters.length; i++) {
        let spans = [], total = 0, width = WIDTH;
        // 清晰度取 2 倍；很长的一章按手机画布的面积上限降一点，免得画不出来
        const scale = Math.min(2, Math.sqrt(16e6 / (WIDTH * chapters[i].offsetHeight * 2)));
        const shot = await html2canvas(chapters[i], {
          backgroundColor: '#fff', scale, logging: false, scrollX: 0, scrollY: 0,
          windowWidth: WIDTH, windowHeight: HEIGHT,
          ignoreElements: el => el.id === 'bg' || el.id === 'threads' || el.classList.contains('px-layer'),
          onclone: async (doc, el) => {
            await printLayout(doc, css); spans = spansOf(el);
            ({ width, height: total } = el.getBoundingClientRect());
          }
        });
        // 比例按宽度算，放进 PDF 时宽高同比缩放：版式万一没按打印宽度排，也只是留白不同，字不会被拉变形
        const k = shot.width / width, cuts = cutsOf(spans, total, HEIGHT * width / WIDTH);
        for (let j = 1; j < cuts.length; j++) {
          const y = Math.round(cuts[j - 1] * k), h = Math.min(Math.round(cuts[j] * k), shot.height) - y;
          if (h <= 0) continue;
          sheet.width = shot.width; sheet.height = h;
          ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, sheet.width, h);
          ctx.drawImage(shot, 0, y, shot.width, h, 0, 0, shot.width, h);
          if (pages++) pdf.addPage();
          pdf.addImage(sheet.toDataURL('image/jpeg', 0.92), 'JPEG', A4.margin, A4.margin, contentW, contentW * h / shot.width);
        }
        shot.width = shot.height = 0;
        progress(i + 1, chapters.length);
      }
      return pdf.output('blob');
    } finally { sheet.width = sheet.height = 0; }
  }

  async function download(button) {
    if (busy) return;
    const book = button.closest('.hb');
    if (!book) return;
    let status = book.querySelector('.hb-pdf-status');
    if (!status) {
      status = document.createElement('p'); status.className = 'hb-sec-p hb-pdf-status';
      status.setAttribute('role', 'status'); button.closest('.hb-actions').after(status);
    }
    busy = true; button.disabled = true; status.textContent = '正在生成 PDF，请稍候…';
    try {
      PixelReveal.finishAll();
      const blob = await create(book, (done, total) => { status.textContent = `正在生成 PDF：${done} / ${total} 章`; });
      if (downloadURL) URL.revokeObjectURL(downloadURL);
      downloadURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL; link.download = `Unfixed-${book.dataset.serial || 'handbook'}.pdf`;
      link.textContent = '点此下载 PDF'; link.target = '_blank'; link.rel = 'noopener';
      status.textContent = 'PDF 已生成。若未出现下载提示，'; status.append(link);
      status.append('。PDF 是图片版，文字不能选中复制。');
      // 链接留在页面上：有的手机浏览器要再手动点一次才肯下载
      link.click();
    } catch (error) {
      status.textContent = `${error.message || 'PDF 生成失败。'} 请点“下载 PDF”重试。`;
    } finally { busy = false; button.disabled = false; }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-hb-pdf]');
    if (button) download(button);
  });
  return { create };
})();
