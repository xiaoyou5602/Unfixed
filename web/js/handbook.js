'use strict';
// 结果页：把计分结果排成一本微型探索手册（05 第 12 节；结果页上的选择见 06 的 14.11）
// 结果每次从 window.getQuestionnaireResult 重新算，这里只管呈现和选择；不显示置信度、冲突，也不写参与者缺了什么（12.1）
// 词条的中文名、定义从 assets/scoring.js 的 terms 读（scoring_data.py 从 02、03 生成），这里不抄定义
// 来源核到什么程度是写词条的人用的，结果页不显示（文案标准第三节）
// 每个词链到名词库的词条页（#term/<ID>），词名到 ID 的对照由 lexicon_data.py 生成在 assets/lexicon.js 的 resultLinks 里
// 进场过渡在 pixel.js：只在跳进结果页时播，第一屏的纸页（data-px="page"）从像素块拼出来，正文（data-px="text"）逐字显影；播完就是普通页面
window.Handbook = (() => {
  const { text, esc } = QuestionView;
  const TERMS = (window.SCORING_RULES || {}).terms || {};
  const LEX = (window.LEXICON || {}).resultLinks || {};
  // 词卡的大标题和词条页标题一致（RA 写作 Relationship anarchy）；简写、并列选择仍用计分的名字
  const LEX_NAME = {}, LEX_EN = {};
  ((window.LEXICON || {}).groups || []).forEach(g => g.parts.forEach(p => p.entries.forEach(e => { LEX_NAME[e.id] = e.name; LEX_EN[e.id] = e.en; })));
  const titleOf = id => LEX_NAME[LEX[id]] || id;
  const LEX_ENTRY = {};
  ((window.LEXICON || {}).groups || []).forEach(g => g.parts.forEach(p => p.entries.forEach(e => { LEX_ENTRY[e.id] = e; })));
  // 中文大标题下面那行英文：标题是缩写（QPR、CNM / ENM）时写词条的英文全称
  const enOf = id => /^[A-Z]{2,}( \/ [A-Z]{2,})*$/.test(titleOf(id)) && /[a-z]/.test(LEX_EN[LEX[id]] || '') ? LEX_EN[LEX[id]] : titleOf(id);
  // 不拆分浪漫与性时，整体吸引的词写成前缀（quoi-、flux、aspec），定义和词条都记在浪漫侧的原词上，这里借原词的
  const WHOLE = { flux: 'Aroflux', spike: 'Arospike' };
  const origin = id => WHOLE[id] || (/^[a-z]+-$/.test(id) ? id[0].toUpperCase() + id.slice(1, -1) + 'romantic' : id);
  // 词条 ID：先按计分的名字对，对不上按原词，aspec 这类本身就是词条 ID 的直接用
  const lexId = id => LEX[id] || LEX[origin(id)] || (LEX_NAME[id] ? id : '');
  // 选择只存在这台设备的浏览器里
  const STORE = 'arospec-result-choices-v1';
  const DEFAULTS = { granularity: 'main', pick: {}, exits: [], include: [], directions: false, overallName: '' };
  const GRANS = ['umbrella', 'main', 'all'];
  let choices = { ...DEFAULTS }, env = null, result = null, slip = null;
  const opened = new Map();  // 点开、收起过哪些词卡的特征和体验举例；改选择重画时照样保持，不存进浏览器
  try { Object.assign(choices, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) {}
  // 旧版存过的"不要标签"已经去掉，回到默认
  if (!GRANS.includes(choices.granularity)) choices.granularity = DEFAULTS.granularity;
  delete choices.edited;
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(choices)); } catch (e) {} };
  const options = () => ({ granularity: choices.granularity, pick: choices.pick, exits: choices.exits,
    includeInShorthand: choices.include, includeDirections: choices.directions, overallName: choices.overallName.trim() });

  const question = id => env.bank.questions.find(q => q.id === id);
  // 英文词名两边留空格，中文词名不留："属于 Greyromantic，在 Aro-spec 范围内"
  const nm = s => /^[⺀-鿿]/.test(s) ? text(s) : ` ${text(s)} `;

  /* ---------------- 小部件 ---------------- */
  const md = s => esc(s).replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '$1');
  const zh = s => text(s).replace(/（拟）/g, '<i class="hb-ni">拟译</i>');
  const sec = (title, body, note = '') => body ? `<div class="hb-sec"><h3 class="hb-sec-h">${text(title)}</h3>
    ${note ? `<p class="hb-sec-p">${text(note)}</p>` : ''}${body}</div>` : '';
  const toggle = (kind, value, on, label) => `<label class="hb-toggle"><input type="checkbox" data-hb-toggle="${kind}" value="${esc(value)}" ${on ? 'checked' : ''}><span>${text(label)}</span></label>`;
  const includeToggle = id => toggle('include', id, choices.include.includes(id), '加进结果卡');
  // 链到名词库：词卡底下一行；正文里的词名直接做成链接，对不上词条的照常只显示文字
  // 有的词条只有基本信息，链接不许诺"详细解释"
  const lexTo = tid => tid ? `<a class="hb-lex" href="#term/${esc(tid)}">在名词库里查这个词 →</a>` : '';
  const lexMore = id => lexTo(lexId(id));
  const lexName = (id, html) => lexId(id) ? `<a class="hb-lex-name" href="#term/${esc(lexId(id))}">${html}</a>` : html;
  // 重点的词（主结果、"可能"、其他吸引）在词卡里就能点开名词库的核心特征和体验举例，正文是 lexicon_data.py 生成好的 HTML，这里不抄
  const MORE = ['核心特征', '体验举例'];
  // 性、浪漫（没分开时是整体吸引）两章的主结果默认展开，其余默认收起
  const OPEN_FIRST = ['romantic', 'sexual', 'overall'];
  function more(c, kind, where) {
    const e = LEX_ENTRY[lexId(c.id)], parts = e ? MORE.map(t => e.sections.find(s => s.title === t)).filter(Boolean) : [];
    if (!parts.length) return '';
    const key = `${where}:${c.id}`;
    const open = opened.has(key) ? opened.get(key) : kind === 'primary' && OPEN_FIRST.includes(where);
    return `<details class="hb-more" data-hb-more="${esc(key)}"${open ? ' open' : ''}><summary>${text(parts.map(s => s.title).join('和'))}</summary>
      <div class="hb-more-body">${parts.map(s => `<h4>${text(s.title)}</h4><div class="lx-prose">${s.html}</div>`).join('')}</div></details>`;
  }
  function card(c, kind, where, extra = '') {
    const t = TERMS[origin(c.id)] || {}, def = c.definition || t.definition;
    const sub = c.label && c.label !== c.id ? c.label : t.zh || (t.term && !t.term.startsWith(c.id) ? t.term : '');
    // 有中文名时中文当大标题、英文退到下面一行，没接触过这些词的人先看懂意思
    const cn = /^[⺀-鿿]/.test(sub);
    return `<div class="hb-card is-${kind}" data-id="${esc(c.id)}">
      ${kind === 'maybe' ? '<span class="hb-tag">可能</span>' : ''}
      <div class="hb-label">${cn ? zh(sub) : text(titleOf(c.id))}</div>
      ${cn ? `<p class="hb-en">${text(enOf(c.id))}</p>` : sub ? `<p class="hb-zh">${zh(sub)}</p>` : ''}
      ${def ? `<p class="hb-def" data-px="text">${md(def)}</p>` : ''}
      ${kind === 'primary' || kind === 'maybe' || kind === 'near' || where === 'other' ? more(c, kind, where) : ''}
      ${lexMore(c.id)}
      ${extra}</div>`;
  }
  // 所属范围：从最上一层往下排成台阶，最后一级是主结果
  function path(d) {
    const steps = [...d.parents].reverse().concat(d.primary.map(c => c.id).join(' / ')), n = steps.length;
    const step = (s, i) => `class="hb-step${i === n - 1 ? ' is-now' : ''}" style="--i:${i}">${text(s)}`;
    const spec = d.parents.find(p => /spec$/i.test(p)), rest = d.parents.filter(p => p !== spec);
    const say = `${rest.length ? `属于${rest.map(nm).join('、').trimEnd()}` : ''}${rest.length && spec ? '，' : ''}${spec ? `在${nm(spec)}范围内` : ''}。`;
    // 台阶上的上级可以点进名词库；最后一级是主结果，词卡底下已经有链接
    return `<div class="hb-path">${steps.map((s, i) => i < n - 1 && lexId(s) ? `<a href="#term/${esc(lexId(s))}" ${step(s, i)}</a>` : `<span ${step(s, i)}</span>`).join('')}</div>
      <p class="hb-sec-p">${say}这里的上下级是这份测试的组织方式，不代表所有人都这样归类。</p>`;
  }
  function pick(slot, list, legend) {
    const cur = list.some(c => c.id === choices.pick[slot]) ? choices.pick[slot] : '';
    return `<fieldset class="hb-choice"><legend>${text(legend)}</legend>${[['', '并列'], ...list.map(c => [c.id, `只用 ${c.id}`])].map(([v, l]) =>
      `<label class="hb-pill"><input type="radio" name="hb-pick-${slot}" data-hb-pick="${slot}" value="${esc(v)}" ${cur === v ? 'checked' : ''}><span>${text(l)}</span></label>`).join('')}</fieldset>`;
  }
  // alico 出口：落在光谱内、子类都不贴切时由本人选择（12.2）。它本身是一个身份词，按词条介绍，不写成"测不准时的备用项"
  function alico(id) {
    const t = TERMS[origin(id)] || {};
    return `<div class="hb-exit"><p class="hb-exit-h">还没找到合适的叫法？</p>
      <p class="hb-exit-term"><b>${text(id)}</b>${t.zh ? `<span>${zh(t.zh)}</span>` : ''}</p>
      ${t.definition ? `<p>${md(t.definition)}。</p>` : ''}
      <p class="hb-exit-note">有人用这个词称呼自己，但是否使用这个词永远由你自己决定。</p>
      ${lexMore(id)}
      ${toggle('exit', id, choices.exits.includes(id), '用这个词，加进结果卡')}</div>`;
  }
  const nothing = '<p class="hb-sec-p">这一部分的回答没有对应到具体的词。</p>';
  const EXT_NOTE = '这些词用的人比较少，各处的说法也不完全一样，放在这里供你对照。';

  /* ---------------- 各章 ---------------- */
  function attraction(slot, d) {
    const g = choices.granularity;
    let h = '';
    if (slot === 'overall') h += `<label class="hb-name"><span>你想怎么称呼这种整体的吸引体验？写下的叫法会放进最后的结果卡，可以空着。</span>
      <input type="text" data-hb-name value="${esc(choices.overallName)}" placeholder="你自己的叫法"></label>`;
    if (g === 'umbrella') {
      const top = d.parents[d.parents.length - 1];
      h += top ? sec('只看伞', card({ id: top, label: top, basis: [] }, 'primary', slot), '这里只写最上一层的所属范围。想看更细的词，在手册开头换成"主树标签"。')
        : sec('和你的回答最接近的词', d.primary.map(c => card(c, 'primary', slot)).join(''));
      return h;
    }
    h += sec('和你的回答最接近的词', d.primary.map(c => card(c, 'primary', slot, c.id === '探索中'
      ? `<p class="hb-sec-p">"探索中"是正式的结果，不是测试失败。${d.possible.length ? '下面列出和你的回答有接近之处的词，可以自己对照。' : ''}</p>` : '')).join(''),
      slot === 'overall' ? '这一章的定义借用对应的浪漫倾向词条，读的时候把"浪漫吸引"换成你整体的吸引体验。' : '');
    if (d.primary.length === 2 && slot !== 'overall') h += pick(slot, d.primary, '两个词都和你的回答接近，可以并列。放进结果卡时：');
    if (d.parents.length) h += sec('所属范围', path(d));
    h += sec('可以一起用的词', d.modifiers.map(c => card(c, 'mod', slot)).join(''), '它们描述态度或意愿，可以和上面的词一起用。');
    h += sec('可能也接近，可以自己对照', d.possible.map(c => card(c, 'maybe', slot)).join(''),
      '你的回答里有几处接近这些词。题目未必对得上每个人的体验，看过定义，你自己更清楚哪部分符合。');
    // 相邻的词（15.17）：不看证据，前面哪题没太明白时也有路可退
    h += sec('挨得最近的词', (d.adjacent || []).map(c => card(c, 'near', slot)).join(''),
      '前面有哪道题当时拿不准、没太明白的话，结果可能就偏到了旁边。这几个词在分类上和上面的结果挨得最近，也可以看看哪个更贴切。');
    if (g === 'all') h += sec('你可能也会想了解', d.extensions.map(c => card(c, 'ext', slot, includeToggle(c.id))).join(''), EXT_NOTE);
    if (d.optionalExit) h += alico(d.optionalExit);
    return h;
  }
  function other(d) {
    const g = choices.granularity;
    // 吸引类型只是描述；aplatonic、asensual 这类身份性的词可以由本人写进简写（12.3）
    const cards = d.details.map(c => card(c, 'detail', 'other', / attraction$/.test(c.id) ? '' : includeToggle(c.id))).join('');
    let h = sec('你描述到的吸引', cards, '这些吸引和浪漫、性分开来看，可以同时存在。') || nothing;
    if (g === 'all') h += sec('你可能也会想了解', d.extensions.map(c => card(c, 'ext', 'other', includeToggle(c.id))).join(''), EXT_NOTE);
    return h;
  }
  function directions() {
    if (!result.directions.length) return null;
    const named = result.directions.some(x => x.choices.some(c => c.short));
    return result.directions.map(x => sec(question(x.question).title, x.choices.map(c => {
      const [name, ...rest] = c.text.split('：'), k = `dir:${x.question}:${c.value}`;
      return `<div class="hb-card is-detail"><div class="hb-label">${text(c.short || name)}</div>
        ${rest.length ? `<p class="hb-def" data-px="text">${text(rest.join('：'))}</p>` : ''}</div>`;
    }).join('') + (x.follow ? `<p class="hb-basis">${text(x.follow)}</p>` : ''))).join('')
      + (named ? toggle('directions', '1', choices.directions, '把方向的叫法加进结果卡') : '');
  }
  function elements(el) {
    const cols = (question('Q4-04').row_options || []).filter(o => el[o.value]);
    if (!cols.length) return '';
    return sec('关系里想要哪些', `<div class="hb-matrix">${cols.map((o, i) => `<div class="hb-col c${i}"><h4>${text(o.text)}</h4>
      <ul>${el[o.value].map(e => `<li title="${esc(e.text)}">${text(e.id)}${e.exclusive ? '<i>只想和一个人</i>' : ''}</li>`).join('')}</ul></div>`).join('')}</div>`);
  }
  function relationship(d) {
    const g = choices.granularity;
    let h = '';
    if (g === 'umbrella' && d.parents.length) h += sec('只看伞', card({ id: d.parents[d.parents.length - 1], label: d.parents[d.parents.length - 1], basis: [] }, 'primary', 'rel'));
    else {
      h += sec('想要的关系', d.primary.map(c => card(c, 'primary', 'rel')).join('')) || nothing;
      // QPR 与柏拉图伴侣并列时，叫法由本人选（第 11 节）
      if (d.primary.length === 2) h += pick('relationship', d.primary, `${d.primary.map(c => c.id).join(' 和 ')}都和你的回答接近，叫法由你选。放进结果卡时：`);
      if (d.parents.length) h += sec('所属范围', path(d));
      h += sec('也想要的关系', [...d.modifiers, ...(g === 'all' ? d.extensions : [])].map(c => card(c, 'mod', 'rel')).join(''));
      h += sec('可能也接近，可以自己对照', d.possible.map(c => card(c, 'maybe', 'rel')).join(''));
    }
    return h + elements(d.elements);
  }
  function structure(d) {
    const g = choices.granularity;
    let h = '';
    if (g === 'umbrella' && d.parents.length) h += sec('只看伞', card({ id: d.parents[0], label: d.parents[0], basis: [] }, 'primary', 'str'));
    else {
      const shown = new Set([...d.primary, ...d.modifiers].map(c => c.id).concat(d.parents));
      h += sec('关系的组织方式', d.primary.map(c => card(c, 'primary', 'str')).join('')) || nothing;
      if (d.parents.length) h += sec('所属范围', path(d));
      h += sec('也和你的回答接近的理念', d.modifiers.map(c => card(c, 'mod', 'str')).join(''));
      h += sec('也接近的结构', d.details.filter(c => !shown.has(c.id)).map(c => card(c, 'detail', 'str')).join(''));
      if (d.hierarchy) {
        // 层级式不是计分的标签，计分数据里没有它的定义，直接链到名词库的 hierarchy 词条
        const t = TERMS['层级式 / 非层级式'] || {};
        h += sec('多段关系之间', `<p class="hb-def"><b>${text(d.hierarchy)}</b>。${t.definition ? md(t.definition) : ''}</p>${lexTo('hierarchy')}`);
      }
      h += sec('可能也接近，可以自己对照', d.possible.map(c => card(c, 'maybe', 'str')).join(''));
      if (g === 'all') h += sec('你可能也会想了解', d.extensions.map(c => card(c, 'ext', 'str')).join(''));
    }
    return h;
  }

  /* ---------------- 前后几页 ---------------- */
  const serialOf = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
  const today = () => { const t = new Date(); return `${t.getFullYear()}.${String(t.getMonth() + 1).padStart(2, '0')}.${String(t.getDate()).padStart(2, '0')}`; };
  // 封面字号按字数算：中文一个字约 1em，拉丁字母约 0.6em
  const wordLen = w => [...w].reduce((n, ch) => n + (/[⺀-鿿＀-￯]/.test(ch) ? 1.05 : /[A-Z]/.test(ch) ? 0.72 : 0.6), 0) + 0.5;
  // 封面的词错落排成台阶，像海报上的排字
  const STAIR = [0, 0.62, 1, 0.42, 0.08, 0.78, 0.3];
  function cover(chapters, serial) {
    // 封面的词从简写拆出来，但和词卡大标题一样写词条全称（RA 写作 Relationship anarchy）；简写本身不变
    const words = result.shorthand ? result.shorthand.split(' · ').flatMap(s => s.split(' / ')).map(titleOf).slice(0, 7) : ['探索', '手册'];
    return `<div class="hb-meta"><span>UNFIXED · FIELD NOTES</span><span>No. ${serial}</span><span>${today()}</span></div>
      <p class="hb-cover-sub" data-px="text">一本按你的回答拼出来的微型探索手册</p>
      <h1 class="hb-stair" aria-label="${esc(words.join(' · '))}">${words.map((w, i) =>
        `<span class="hb-word${i % 2 ? ' alt' : ''}" style="--t:${STAIR[i % STAIR.length]};--len:${wordLen(w).toFixed(2)}">${text(w)}</span>`).join('')}</h1>
      <p class="hb-motto" data-px="text">标签只是代称，一切由你自己的最终体验决定。</p>
      <div class="hb-cover-foot">
        <nav class="hb-toc" aria-label="目录">${chapters.map(c => c.skipped ? `<span class="is-off"><b>${c.no}</b>${text(c.big)} · 跳过了</span>`
          : `<button type="button" data-hb-jump="hb-${c.id}"><b>${c.no}</b>${text(c.big)}</button>`).join('')}</nav>
      </div>`;
  }
  const GRAN = [['umbrella', '只看伞'], ['main', '主树标签'], ['all', '加上延伸区']];
  const howto = () => `<p class="hb-kicker">怎么读这本手册</p>
    <p class="hb-body" data-px="text">每一章对应问卷的一部分：写出和你的回答最接近的词和它的定义。测试只能说到"你描述的体验和哪些词的定义接近"，不替你决定身份。</p>
    <fieldset class="hb-choice" aria-label="想看多细">${GRAN.map(([v, l]) =>
      `<label class="hb-pill"><input type="radio" name="hb-gran" data-hb-gran value="${v}" ${choices.granularity === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>`;
  function short() {
    const pieces = result.shorthand ? result.shorthand.split(' · ') : [];
    let h = '<p class="hb-sec-p">结果卡把各章里你选用的词连成一行，方便复制下来。</p>';
    if (!pieces.length) h += '<p class="hb-body">这一次还没有可以放进结果卡的词。</p>';
    else h += `<div class="hb-shorthand">${pieces.map(p => `<span>${text(p)}</span>`).join('<i aria-hidden="true">·</i>')}</div>
      <div class="hb-actions"><button type="button" class="hb-btn" data-hb-act="copy-short">复制结果卡</button><span class="hb-copied" aria-live="polite"></span></div>`;
    return h + '<p class="hb-sec-p">默认只放每一章里和你的回答最接近的词。</p>';
  }
  const end = () => `<p class="hb-lede" data-px="text">标签只是代称，一切由你自己的最终体验决定。</p>
    <p class="hb-body" data-px="text">aspec 社群欢迎还在探索的人。这本手册只说明你描述的体验和哪些词的定义接近，不替你决定身份。</p>
    ${env.missing.length ? `<p class="hb-sec-p">这几道题没有作答，想补的话点题号回去：</p>
      <div class="jump">${env.missing.map(q => `<button type="button" data-q="${esc(q.id)}">${text(q.id)} · ${text(q.title)}</button>`).join('')}</div>` : ''}
    <p class="hb-sec-p">回答和这里的选择只保存在这台设备的浏览器里。回去改了前面的回答，手册会按新的回答重新拼。</p>
    <div class="hb-actions hb-end-nav"><button type="button" class="hb-btn ghost" data-step="-1">← 回去改回答</button>
      <button type="button" class="hb-btn ghost" data-hb-act="print">打印或存成 PDF</button><button type="button" class="hb-btn" data-go="0">回到开头 ↺</button></div>
    ${repo() ? `<p class="hb-sec-p hb-star">觉得这本手册有帮助的话，可以去 <a href="${esc(repo())}" target="_blank" rel="noopener">GitHub</a> 给项目点个 star ☆</p>` : ''}`;
  // 仓库地址只写在页面头部，空着就不出链接
  const repo = () => document.querySelector('meta[name="repo"]')?.content.trim();
  const head = (no, latin, big, k) => `<header class="hb-head"><div class="hb-head-row"><span class="hb-no">${text(no)}</span>
    <span class="hb-latin">${text(latin)}</span></div><h2 class="hb-title">${text(big)}</h2></header>`;

  /* ---------------- 整本 ---------------- */
  // e：bank、answers、flow（当前出题路径）、missing（没作答的题）、prints（各部分的编号与英文名）
  function html(e) {
    env = e;
    result = window.getQuestionnaireResult(options());
    const d = result.dimensions, P = e.prints, serial = serialOf(JSON.stringify(e.answers)).toString(16).toUpperCase().padStart(8, '0').slice(0, 4);
    const chapters = [], add = (id, pr, big, body, note) => chapters.push({ id, no: pr.no, big, skipped: body == null,
      inner: body == null ? '' : head(pr.no, pr.latin, big, id) + (note ? `<p class="hb-lead">${text(note)}</p>` : '') + body });
    if (d.overall) add('overall', { no: P.Q1.no, latin: 'WHOLE' }, '整体吸引', attraction('overall', d.overall), d.overall.note);
    else add('romantic', P.Q1, P.Q1.big, attraction('romantic', d.romantic));
    if (!d.overall) add('sexual', P.Q2, P.Q2.big, d.sexual ? attraction('sexual', d.sexual)
      + (result.combined ? `<p class="hb-combined">浪漫和性两边合在一起，你的回答也和 <b>${lexName(result.combined, text(result.combined))}</b> 描述的组合接近。</p>` : '') : null);
    add('other', P.Q3, '其他吸引', other(d.other));
    const dir = directions();
    if (dir) add('direction', P.QM, '吸引方向', dir);
    add('relationship', P.Q4, P.Q4.big, relationship(d.relationship));
    add('structure', P.Q5, '结构与理念', structure(d.structure));
    const pages = [['cover', 'hb-cover', cover(chapters, serial)], ['howto', 'hb-howto', howto()],
      ...chapters.filter(c => !c.skipped).map(c => [c.id, 'hb-ch', c.inner]),
      ['short', 'hb-ch', head('§', 'RESULT CARD', '结果卡', 'short') + short()],
      ['end', 'hb-ch hb-end', head('∎', 'LAST PAGE', '最后', 'end') + end()]];
    return `<article class="hb" data-gran="${esc(choices.granularity)}" data-serial="${serial}"><div class="px-layer" aria-hidden="true"></div>
      ${pages.map(([pid, cls, inner], i) => `<section class="hb-page ${cls}" id="hb-${pid}"><div class="hb-sheet" data-px="page">${inner}
        <span class="hb-folio">No. ${serial} — ${String(i + 1).padStart(2, '0')}</span></div></section>`).join('')}
    </article>`;
  }
  // entering：刚跳进结果页，播进场过渡；改选择重画时不播
  function mount(el, entering) {
    slip = el;
    const hb = el.querySelector('.hb');
    if (!hb) return;
    PixelReveal.mount(hb, entering);
    env.onResult?.(result);
  }
  // 改了选择：重画整本，保持刚才操作的那一页在屏幕上的位置和光标
  function refresh(target) {
    const pg = target.closest('.hb-page'), id = pg && pg.id, top = pg ? pg.getBoundingClientRect().top : 0;
    // 单选按 name 找回，勾选框按 data-hb-toggle 找回，叫法输入框只有一个
    const v = CSS.escape(target.value || ''), kind = target.dataset.hbToggle;
    const again = target.matches('[data-hb-name]') ? '[data-hb-name]' : kind ? `[data-hb-toggle="${CSS.escape(kind)}"][value="${v}"]`
      : target.name ? `input[name="${CSS.escape(target.name)}"][value="${v}"]` : null;
    slip.innerHTML = html(env);
    mount(slip, false);
    const page = id && document.getElementById(id);
    if (page) scrollBy(0, page.getBoundingClientRect().top - top);
    if (again) slip.querySelector(again)?.focus({ preventScroll: true });
  }
  async function copy(s, btn) {
    let ok = false;
    try { await navigator.clipboard.writeText(s); ok = true; } catch (e) {
      const t = document.createElement('textarea');
      t.value = s; t.style.cssText = 'position:fixed;left:-9999px;opacity:0'; document.body.appendChild(t); t.select();
      try { ok = document.execCommand('copy'); } catch (e2) {}
      t.remove();
    }
    const note = btn.parentElement.querySelector('.hb-copied');
    if (note) { note.textContent = ok ? '已复制' : '复制不了，请手动选中复制'; clearTimeout(note.timer); note.timer = setTimeout(() => { note.textContent = ''; }, 2400); }
  }
  function bind(el) {
    const inBook = e => e.target.closest && e.target.closest('.hb');
    el.addEventListener('change', e => {
      if (!inBook(e)) return;
      const t = e.target;
      if (t.dataset.hbGran != null) choices.granularity = t.value;
      else if (t.dataset.hbPick) { if (t.value) choices.pick = { ...choices.pick, [t.dataset.hbPick]: t.value }; else { const { [t.dataset.hbPick]: _, ...rest } = choices.pick; choices.pick = rest; } }
      else if (t.dataset.hbToggle === 'directions') choices.directions = t.checked;
      else if (t.dataset.hbToggle) {
        const list = t.dataset.hbToggle === 'exit' ? 'exits' : 'include';
        choices[list] = t.checked ? [...new Set([...choices[list], t.value])] : choices[list].filter(x => x !== t.value);
      } else if (t.dataset.hbName != null) choices.overallName = t.value;
      else return;
      save(); refresh(t);
    });
    el.addEventListener('click', e => {
      if (!inBook(e)) return;
      const jump = e.target.closest('[data-hb-jump]'), act = e.target.closest('[data-hb-act]');
      if (jump) { PixelReveal.finishAll(); document.getElementById(jump.dataset.hbJump)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return; }
      if (!act) return;
      const a = act.dataset.hbAct;
      if (a === 'copy-short') copy(result.shorthand, act);
      else if (a === 'print') { PixelReveal.finishAll(); print(); }
    });
    // 点一下手册就让进场过渡直接放完，不用干等
    el.addEventListener('pointerdown', e => { if (inBook(e)) PixelReveal.finishAll(); });
    // 点开、收起特征和体验举例时记下来；toggle 不冒泡，在捕获阶段听
    el.addEventListener('toggle', e => {
      const k = e.target.dataset && e.target.dataset.hbMore;
      if (k) opened.set(k, e.target.open);
    }, true);
    // 打印时全部展开
    addEventListener('beforeprint', () => { PixelReveal.finishAll(); slip.querySelectorAll('.hb-more').forEach(d => { d.open = true; }); });
  }
  bind(document.getElementById('slip'));
  return { html, mount, get result() { return result; } };
})();
