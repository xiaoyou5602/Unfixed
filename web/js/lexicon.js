'use strict';
// 左上三条杠打开的侧栏，和名词库的维度页、词条页
// 词条全部从 assets/lexicon.js 读（tools/lexicon_data.py build 从 lexicon/ 生成），这里不抄词条
// 地址用 # 记：#lexicon/<维度> 是维度页，#term/<词条 ID> 是词条页，没有 # 就是测试本身；浏览器的后退照常能用

window.Lexicon = (() => {
  const DATA = window.LEXICON;
  const GROUPS = DATA.groups;
  const ENTRIES = [];  // 按侧栏顺序排好的全部词条，带上所属维度和分区，给上一条／下一条用
  GROUPS.forEach(g => g.parts.forEach(p => p.entries.forEach(e => ENTRIES.push({ ...e, group: g, part: p.title }))));
  const byId = Object.fromEntries(ENTRIES.map(e => [e.id, e]));
  // 组合标签不属于某一个维度，只写名称
  const labelOf = g => g.dim ? `${g.dim} · ${g.title}` : g.title;
  const countOf = g => g.parts.reduce((n, p) => n + p.entries.length, 0);
  // 背后的大字沿用问卷各部分的写法，大字不超过两个字
  const BIG = { romantic: '浪漫', sexual: '性', combined: '组合', other: '吸引', relationship: '关系', structure: '结构' };
  const printOf = g => ({ kind: 'lex', print: g ? { no: g.no, latin: 'LEXICON', big: BIG[g.id] } : { no: 'L', latin: 'LEXICON', big: '词库' } });

  const { text, esc } = QuestionView;
  const btn = document.getElementById('menuBtn'), drawer = document.getElementById('drawer'), mask = document.getElementById('drawerMask');
  const wrap = document.getElementById('lexWrap');
  const BRAND = document.querySelector('.brand b').textContent;  // 测试名只写在顶栏一处，网页标题照着读；侧栏顶上单独写 BEYOND LABELS
  const repo = () => document.querySelector('meta[name="repo"]')?.content.trim();  // 仓库地址只写在页面头部，空着就不出链接
  let route = null, print = null, lexOpen = true;  // 名词库那一块展开没有；默认展开，点名词库可以收起
  let homeY = 0;  // 从测试（或结果手册）进名词库时滚到了哪里，回来时回到原处
  const openGroups = new Set();

  /* ---------------- 侧栏 ---------------- */
  function drawerHTML() {
    return `<button class="dr-test" data-home>
        <b>BEYOND LABELS</b><span>自我探索测试</span><em>${route ? '回到测试 →' : '当前页面'}</em>
      </button>
      <button class="dr-lex" data-lex aria-expanded="${lexOpen}">
        <span>名词库</span><i>${ENTRIES.length}</i>
      </button>
      <ol class="dr-dims"${lexOpen ? '' : ' hidden'}>${GROUPS.map(groupHTML).join('')}</ol>
      ${repo() ? `<a class="dr-star" href="${esc(repo())}" target="_blank" rel="noopener">
        <span>GitHub ☆</span><small>觉得有用的话，可以去点个 star</small></a>` : ''}`;
  }
  function groupHTML(g) {
    const open = openGroups.has(g.id);
    return `<li>
        <button class="dr-dim" data-group="${g.id}" aria-expanded="${open}">
          <b>${text(g.no)}</b><span>${text(labelOf(g))}</span><i>${countOf(g)}</i>
        </button>
        <ol class="dr-terms"${open ? '' : ' hidden'}>${g.parts.map(p => (p.title ? `<li class="dr-part">${text(p.title)}</li>` : '')
          + p.entries.map(e => `<li><a href="#term/${e.id}"${route && route.entry && route.entry.id === e.id ? ' aria-current="page"' : ''}>
              <span>${text(e.name)}</span>${e.zh ? `<small>${text(e.zh)}</small>` : ''}</a></li>`).join('')).join('')}</ol>
      </li>`;
  }
  function drawDrawer() {
    const top = drawer.scrollTop;
    drawer.innerHTML = drawerHTML();
    drawer.scrollTop = top;
  }
  function setDrawer(open) {
    document.body.classList.toggle('drawer-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
    drawer.inert = !open; mask.hidden = !open;
    if (open) {
      drawDrawer();
      // 打开时把当前所在的那一条滚进视野
      (drawer.querySelector('[aria-current="page"]') || drawer.querySelector('button')).focus({ preventScroll: true });
      drawer.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
    }
  }
  const isDrawerOpen = () => document.body.classList.contains('drawer-open');

  btn.addEventListener('click', () => setDrawer(!isDrawerOpen()));
  mask.addEventListener('click', () => { setDrawer(false); btn.focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && isDrawerOpen()) { setDrawer(false); btn.focus(); } });
  drawer.addEventListener('click', e => {
    const t = e.target.closest('[data-home],[data-lex],[data-group],a[href^="#term/"]');
    if (!t) return;
    if (t.dataset.home != null) { setDrawer(false); goHome(); btn.focus(); }
    else if (t.dataset.lex != null) { lexOpen = !lexOpen; drawDrawer(); drawer.querySelector('[data-lex]').focus(); }
    else if (t.dataset.group) {
      // 点维度：只展开或收起它下面的词条，不跳页；点词条才跳
      const id = t.dataset.group;
      if (openGroups.has(id)) openGroups.delete(id); else openGroups.add(id);
      drawDrawer();
      drawer.querySelector(`[data-group="${id}"]`).focus();
    } else setDrawer(false);  // 点词条：链接自己会跳，侧栏收起来看词条
  });

  /* ---------------- 页面 ---------------- */
  const crumb = (g, part) => `<nav class="lx-crumb" aria-label="所在位置">
      <span>名词库</span><a href="#lexicon/${g.id}">${text(labelOf(g))}</a>${part ? `<span>${text(part)}</span>` : ''}
    </nav>`;
  const draftNote = `<p class="lx-draft">名词库还是草稿，词条尚待人工审校。</p>`;
  // 从结果手册点进来的，按钮写"回到结果手册"
  const backFoot = () => `<div class="lx-foot"><button class="hb-btn ghost" data-home>${PAGES[cur].kind === 'done' ? '回到结果手册' : '回到测试'}</button></div>`;
  const zhOf = e => e.zh ? `<span class="lx-zh">${text(e.zh)}${e.zhStatus ? `<i>${text(e.zhStatus === '拟' ? '拟译' : e.zhStatus)}</i>` : ''}</span>` : '';

  function groupPage(g) {
    return `<article class="lx-sheet">
        <div class="hb-head-row"><span class="hb-no">${text(g.no)}</span><span class="hb-latin">LEXICON</span>${g.dim ? `<span>${text(g.dim)}</span>` : ''}</div>
        <h1 class="hb-title">${text(g.title)}</h1>
        <p class="lx-count">${countOf(g)} 个词条</p>
        ${draftNote}
        ${g.parts.map(p => `<section class="lx-part">
            ${p.title ? `<h2 class="hb-sec-h">${text(p.title)} · ${p.entries.length}</h2>` : ''}
            <ul class="lx-list">${p.entries.map(e => `<li><a href="#term/${e.id}">
                <span class="lx-name">${text(e.name)}</span>${zhOf(e)}
                ${e.summary ? `<span class="lx-sum">${text(e.summary)}</span>` : `<span class="lx-sum is-empty">目前只有基本信息</span>`}
              </a></li>`).join('')}</ul>
          </section>`).join('')}
        ${backFoot()}
      </article>`;
  }
  function entryPage(e) {
    const i = ENTRIES.indexOf(e), prev = ENTRIES[i - 1], next = ENTRIES[i + 1];
    const near = (x, dir) => x && x.group === e.group
      ? `<a class="lx-near is-${dir}" href="#term/${x.id}"><small>${dir === 'prev' ? '← 上一条' : '下一条 →'}</small><span>${text(x.name)}</span></a>` : '<span></span>';
    return `<article class="lx-sheet">
        <div class="hb-head-row"><span class="hb-no">${text(e.group.no)}</span><span class="hb-latin">LEXICON</span>${crumb(e.group, e.part)}</div>
        <h1 class="lx-title">${text(e.name)}</h1>
        ${zhOf(e)}
        ${e.summary ? `<p class="lx-lede">${text(e.summary)}</p>` : `<p class="lx-draft">这个词条目前只有基本信息，释义还在补。</p>`}
        <section class="lx-sec"><h2 class="hb-sec-h">基本信息</h2>
          <dl class="lx-facts">${e.facts.map(([k, v]) => `<dt>${text(k)}</dt><dd>${v}</dd>`).join('')}</dl>
        </section>
        ${e.sections.map(s => `<section class="lx-sec"><h2 class="hb-sec-h">${text(s.title)}</h2><div class="lx-prose">${s.html}</div></section>`).join('')}
        <nav class="lx-nav" aria-label="同一维度的其他词条">${near(prev, 'prev')}${near(next, 'next')}</nav>
        ${backFoot()}
      </article>`;
  }
  function homePage() {
    return `<article class="lx-sheet">
        <div class="hb-head-row"><span class="hb-no">L</span><span class="hb-latin">LEXICON</span><span>名词库</span></div>
        <h1 class="hb-title">名词库</h1>
        ${draftNote}
        <ul class="lx-list">${GROUPS.map(g => `<li><a href="#lexicon/${g.id}">
            <span class="lx-name">${text(labelOf(g))}</span><span class="lx-zh">${countOf(g)} 个词条</span>
          </a></li>`).join('')}</ul>
        ${backFoot()}
      </article>`;
  }

  /* ---------------- 地址 ---------------- */
  function parse() {
    const h = decodeURIComponent(location.hash.replace(/^#/, ''));
    let m;
    if (h === 'lexicon') return { type: 'home' };
    if ((m = h.match(/^lexicon\/(.+)$/))) { const g = GROUPS.find(x => x.id === m[1]); return g ? { type: 'group', group: g } : { type: 'home' }; }
    if ((m = h.match(/^term\/(.+)$/))) { const e = byId[m[1]]; return e ? { type: 'entry', entry: e, group: e.group } : { type: 'home' }; }
    return null;
  }
  function show(animate) {
    const was = route;
    route = parse();
    if (route && !was) homeY = scrollY;
    document.body.classList.toggle('lex-open', !!route);
    wrap.hidden = !route; slipWrap.hidden = !!route;
    const next = route ? printOf(route.group) : null;
    if (route) {
      if (route.group) openGroups.add(route.group.id);
      if (route.type !== 'home') lexOpen = true;
      wrap.innerHTML = route.type === 'entry' ? entryPage(route.entry) : route.type === 'group' ? groupPage(route.group) : homePage();
      document.title = `${route.entry ? route.entry.name : route.group ? route.group.title : '名词库'} · 名词库 · ${BRAND}`;
      window.scrollTo(0, 0);
    } else {
      document.title = TITLE;
      if (was) window.scrollTo(0, homeY);
    }
    // 背后的大字只在换了维度、或进出名词库时重画
    if (!next !== !print || (next && print.print.big !== next.print.big)) setPrint(next || PAGES[cur], animate);
    print = next;
    if (isDrawerOpen()) drawDrawer();
  }
  // 回到测试：去掉地址里的 #，回到刚才那一题
  function goHome() {
    if (!route) return;
    history.pushState(null, '', location.pathname + location.search);
    show(true);
  }
  const TITLE = document.title;
  wrap.addEventListener('click', e => { if (e.target.closest('[data-home]')) goHome(); });
  addEventListener('hashchange', () => show(true));
  addEventListener('popstate', () => { if (!location.hash && route) show(true); });

  drawer.inert = true;
  show(false);
  // 背后的大字现在该画哪一页：名词库打开时画名词库的，否则画当前这道题的
  return { printPage: () => print || PAGES[cur], isOpen: () => !!route };
})();
