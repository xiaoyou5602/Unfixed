'use strict';
// 题目页：封面、按回答出题、作答、翻页和保存
// 题目原文全部从 assets/questions.js 读（tools/qbank.py build 生成），这里不抄题；出不出题由 flow.js 按"出现"条件判断

/* ---------------- 题目与回答 ---------------- */
const BANK = window.QUESTION_BANK;
const PARTS = Object.fromEntries(BANK.parts.map(p => [p.id, p]));
// 纸上大标题，每部分一张；大字不超过两个字，排版按两个字留位置
const PRINTS = {
  Q0: { no: '00', latin: 'OPENING', big: '开场' }, Q1: { no: '01', latin: 'ROMANTIC', big: '浪漫' },
  Q2: { no: '02', latin: 'SEXUAL', big: '性' }, Q3: { no: '03', latin: 'ATTRACTION', big: '吸引' },
  QM: { no: 'M', latin: 'DIRECTION', big: '方向' }, Q4: { no: '04', latin: 'RELATIONSHIP', big: '关系' },
  Q5: { no: '05', latin: 'STRUCTURE', big: '结构' }
};
const KINDS = { '单选': 'single', '单选或自填': 'single', '多选': 'multi', '多选或自填': 'multi', '多选并排序': 'multi', '逐行': 'rows' };  // 题库出现新题型时先显示占位，可以跳过

// 回答只存在这台设备的浏览器里；读写失败（无痕窗口等）时照常作答，只是不保存
const STORE = 'arospec-answers-v1';
let answers = {}, savedAt = null;
// 结果页统一从这个入口取当前回答的计算结果；不持久化派生结果，避免改答案后读到旧标签。
window.getQuestionnaireResult = options => window.QuestionScoring.score(BANK, answers, options);
let RESULT = null;
try {
  const s = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (s && s.answers) { answers = s.answers; savedAt = s.at || null; }
} catch (e) {}
const persist = () => { try { localStorage.setItem(STORE, JSON.stringify({ answers, at: savedAt })); } catch (e) {} };
// sel：选中的选项 id（排序题按排好的先后，没动手排过时按选项顺序）；ranked：排序题动手排过；rows：逐行题每行的取值；extra：每行的附加勾选；text：自填内容；follow：追问
const answerOf = id => {
  const a = (answers[id] ||= {});
  a.sel ||= []; a.exit ??= null; a.rows ||= {}; a.extra ||= {}; a.text ||= {}; a.follow ??= '';
  return a;
};

/* ---------------- 匿名统计 ---------------- */
// 只在线上打开（页面头部的 stats 地址由 deploy_site.py 填上）：从封面进题记一次开始，进结果页记一次完成和各维度的主标签。
// 只带这台浏览器生成的随机作答编号，不发回答；清空回答就换一个编号。发不出去时什么也不影响
const STATS = document.querySelector('meta[name="stats"]')?.content.trim() || '';
const ATTEMPT = 'arospec-attempt-v1';
let attempt = null;
try { attempt = localStorage.getItem(ATTEMPT); } catch (e) {}
function report(type, labels) {
  if (!STATS) return;
  if (!attempt) {
    attempt = crypto.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    try { localStorage.setItem(ATTEMPT, attempt); } catch (e) {}
  }
  fetch(STATS, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, attempt, labels }) }).catch(() => {});
}
// 其他吸引没有主标签，算它列出的词
const labelsOf = r => [...Object.entries(r.dimensions).flatMap(([d, x]) => x ? (d === 'other' ? x.details : x.primary).map(c => [d, c.id]) : []),
  ...(r.combined ? [['combined', r.combined]] : [])];
function forgetAttempt() { attempt = null; try { localStorage.removeItem(ATTEMPT); } catch (e) {} }

/* ---------------- 页面列表 ---------------- */
// PAGES：封面 + 按当前回答会出现的题 + 答完页。改了回答就重排，当前题之前的页不会变（条件只看前面的题）
let PAGES = [], FLOW = null;
function buildPages() {
  FLOW = QuestionFlow.path(BANK, answers);
  const firstOfPart = new Set();
  PAGES = [{ kind: 'cover', print: { latin: 'ARO-SPEC', big: '自我探索' } }];
  FLOW.list.forEach((q, i) => {
    const intro = !firstOfPart.has(q.part);
    firstOfPart.add(q.part);
    PAGES.push({ kind: 'q', q: q.id, index: i + 1, intro, print: PRINTS[q.part] });
  });
  PAGES.push({ kind: 'done', print: { no: '::', latin: 'FIELD NOTES', big: '手册' } });
}
const pageOf = id => PAGES.findIndex(p => p.q === id);
// 显示序号按当前作答路线连续编号；固定题号仍用于回答、条件和跳转。
const questionLabel = id => `第 ${PAGES[pageOf(id)].index} 题`;

// 题库里的一道题 → 渲染器要的样子。只列条件成立的选项和行，回答里的选项 id 换成序号
function viewOf(pg) {
  const q = BANK.questions.find(x => x.id === pg.q), ctx = FLOW.ctx;
  const opts = QuestionFlow.visibleOptions(q, ctx), kind = KINDS[q.response] || null;
  const v = {
    id: q.id, label: questionLabel(q.id), title: q.title, part: PARTS[q.part].title, kind, response: q.response,
    stem: q.stem, note: q.note || '', intro: pg.intro && q.part !== 'Q0' ? QuestionFlow.intro(PARTS[q.part], ctx) : '',
    definitions: q.definitions || [],
    options: opts.map(o => o.text), ids: opts.map(o => o.id),
    exclusive: opts.map((o, i) => (q.exclusive || []).includes(o.value) ? i : -1).filter(i => i >= 0),
    free: new Set(opts.map((o, i) => o.free_text ? i : -1).filter(i => i >= 0)),
    rank: q.response === '多选并排序',
    // 追问写的是一句说明；它提到的取值就是触发它的选项
    followUp: q.follow_up ? { text: q.follow_up, ids: opts.filter(o => q.follow_up.includes(o.value)).map(o => o.id) } : null,
    exits: q.exits || []
  };
  if (kind === 'rows') {
    // 逐行题按行提供"不确定"；整题跳过、整题不确定仍在下面
    const unsure = v.exits.filter(x => x.value === '不确定').map(x => ({ text: x.text, value: x.value, exit: true }));
    v.rows = QuestionFlow.visibleRows(q, ctx).map(r => {
      const rc = QuestionFlow.recap(r, ctx);
      return { id: r.id, text: r.text, ask: r.ask || '', category: r.category,
        quote: rc ? rc.quote : r.quotes ? quoteOf(r.quotes, ctx) : '',
        options: [...q.row_options.map(o => ({ text: QuestionFlow.rowLabel(o, rc), value: o.value })), ...unsure] };
    });
    v.rowOptions = [...q.row_options.map(o => ({ text: o.text, value: o.value })), ...unsure];
    v.rowExtra = q.row_extra || '';
  }
  v.state = stateOf(v, answerOf(q.id));
  return v;
}
function stateOf(v, a) {
  const order = a.sel.map(id => v.ids.indexOf(id)).filter(i => i >= 0);
  // 排序题没动手排过就按选项顺序列，和计分一致（07 15.11）
  if (v.rank && !a.ranked) order.sort((x, y) => x - y);
  if (v.followUp) v.followUp.show = a.sel.some(id => v.followUp.ids.includes(id));
  return { sel: new Set(order), order, exit: a.exit, rows: a.rows, extra: a.extra, follow: a.follow,
    text: Object.fromEntries(v.ids.map((id, i) => [i, a.text[id] || ''])) };
}
// 逐行题引用前面的回答：列出那道题选了什么；只引用部分取值的，只列这几项
function quoteOf(ref, ctx) {
  const src = BANK.questions.find(x => x.id === ref.question), a = answers[ref.question];
  if (!QuestionFlow.answered(a)) return '你之前没有作答这题';
  if (a.exit) return `你之前的回答：${((src.exits || []).find(x => x.value === a.exit) || { text: a.exit }).text}`;
  const picked = QuestionFlow.visibleOptions(src, ctx).filter(o => a.sel.includes(o.id) && (!ref.values || ref.values.includes(o.value)));
  return picked.length ? `你之前的回答：${picked.map(o => o.text).join('；')}` : '你之前的回答里没有选这一类';
}

/* ---------------- 页面 ---------------- */
const main = document.getElementById('main');
const slip = document.getElementById('slip');
const { text, esc } = QuestionView;
let cur = 0, busy = false;

const hasProgress = () => FLOW.list.some(q => QuestionFlow.answered(answers[q.id]));
function coverHTML() {
  // 开场的引导语：第一句当大字，其余当正文
  const opening = QuestionFlow.intro(PARTS.Q0, FLOW.ctx), cut = opening.indexOf('。') + 1;
  const resume = hasProgress() && pageOf(savedAt) > 0 ? pageOf(savedAt) : savedAt === 'done' ? PAGES.length - 1 : -1;
  return `<div class="slip-head"><span class="qid">00</span><span>开始之前</span><span class="kind">测试版</span></div>
    <p class="lede">${text(opening.slice(0, cut))}</p>
    <p class="body">${text(opening.slice(cut).trimStart())}</p>
    ${resume > 0 ? `<button class="next" data-go="${resume}">继续作答 →</button>
      <button class="restart" data-restart>清空回答，重新开始</button>`
    : `<button class="next" data-go="1">开始 →</button>`}
    <p class="sample-note">${text(coverNote())}</p>`;
}
// 封面小字写在开场分册的"封面小字"表里
function coverNote() {
  const notes = PARTS.Q0.cover || [], note = notes.find(n => n.when === 'plain');
  return (note ? note.text : '').replaceAll('{题数}', FLOW.list.length);
}
function footHTML(pg) {
  const last = cur === PAGES.length - 2;
  return `<div class="slip-foot">
      <button class="back" data-step="-1">← 上一题</button>
      <span class="count">${pg.index} / 约 ${FLOW.list.length}</span>
      <button class="next" data-step="1">${last ? '答完了 →' : '下一题 →'}</button>
    </div>`;
}
// 还没做的题型：题干照常显示，说明暂时答不了，出口照常可选
function pendingHTML(q, footer) {
  return `<div class="slip-head" data-question-id="${esc(q.id)}"><span class="qid">${text(q.label)}</span><span>${text(q.part)}</span><span class="kind">${text(q.response)}</span></div>
    ${q.intro ? `<p class="intro">${text(q.intro)}</p>` : ''}
    <h1 class="stem">${text(q.stem)}</h1>
    ${q.note ? `<p class="note">${text(q.note)}</p>` : ''}
    <p class="pending">这种题型（${text(q.response)}）还在做，暂时不能作答，可以直接点下一题。</p>
    ${q.exits.length ? `<div class="exits">${q.exits.map(x =>
      `<button class="exit" data-exit="${esc(x.value)}" aria-pressed="${q.state.exit === x.value}">${text(x.text)}</button>`).join('')}</div>` : ''}
    ${footer}`;
}
// 答完页就是结果页：一本按当前回答拼的探索手册，见 handbook.js
function doneHTML() {
  const missing = FLOW.list.filter(q => !QuestionFlow.answered(answers[q.id]));
  return Handbook.html({ bank: BANK, answers, flow: FLOW, missing, questionLabel, prints: PRINTS, onResult: r => { RESULT = r; } });
}
let view = null;
function render() {
  const pg = PAGES[cur];
  main.dataset.kind = pg.kind;
  view = pg.kind === 'q' ? viewOf(pg) : null;
  slip.innerHTML = pg.kind === 'cover' ? coverHTML() : pg.kind === 'done' ? doneHTML()
    : view.kind ? QuestionView.render(view, view.state, footHTML(pg)) : pendingHTML(view, footHTML(pg));
  document.body.classList.toggle('reading', pg.kind === 'done');
  if (pg.kind === 'done') Handbook.mount(slip, true);
  renderDots();
}
function renderDots() {
  const pg = PAGES[cur], dots = document.getElementById('dots');
  let h = '';
  FLOW.list.forEach((q, i) => {
    h += `<i class="${pg.index === i + 1 ? 'now' : QuestionFlow.answered(answers[q.id]) ? 'done' : ''}"></i>`;
  });
  dots.innerHTML = h;
  document.getElementById('progressText').textContent =
    pg.kind === 'cover' ? `按回答出题 · 约 ${FLOW.list.length} 题` : pg.kind === 'done' ? '结果页' : `${questionLabel(pg.q)} · ${view.title}`;
}
function go(i) {
  if (busy || i === cur || i < 0 || i >= PAGES.length) return;
  busy = true;
  setPrint(PAGES[i], true);
  slipWrap.classList.add('leaving');
  setTimeout(() => {
    const from = cur;
    cur = i; render(); window.scrollTo(0, 0);
    if (PAGES[cur].kind !== 'cover') { savedAt = PAGES[cur].q || PAGES[cur].kind; persist(); }
    // 从封面进题、这次作答还没记过开始时记一次；每次进结果页都记完成，后台按最新一次的标签算
    if (PAGES[from].kind === 'cover' && PAGES[cur].kind !== 'cover' && !attempt) report('start');
    if (PAGES[cur].kind === 'done' && RESULT) report('complete', labelsOf(RESULT));
    slipWrap.classList.remove('leaving');
    setTimeout(() => { busy = false; }, 420);
  }, 380);
}
// 改了回答：保存，重排后面的页（当前页的序号不变），更新进度点
function changed() {
  persist();
  const id = PAGES[cur].q;
  buildPages();
  cur = pageOf(id);
  const count = slip.querySelector('.count');
  if (count) count.textContent = `${PAGES[cur].index} / 约 ${FLOW.list.length}`;
  renderDots();
}

slip.addEventListener('click', e => {
  const t = e.target.closest('[data-go],[data-step],[data-q],[data-restart]');
  if (t) {
    if (t.dataset.go != null) go(+t.dataset.go);
    else if (t.dataset.step != null) go(cur + +t.dataset.step);
    else if (t.dataset.q != null) go(pageOf(t.dataset.q));
    else if (confirm('清空这台设备上保存的回答，从头开始？')) {
      answers = {}; savedAt = null; persist(); forgetAttempt(); buildPages(); render();
    }
    return;
  }
  if (!view) return;
  const a = answerOf(view.id);
  const mv = e.target.closest('[data-move]');
  if (mv) {
    // 只在看得见的已选项之间、按列出来的先后挪；条件变了以后藏起来的选项排在最后。挪过一次就算动手排过
    const shown = view.state.order.map(i => view.ids[i]), hidden = a.sel.filter(id => !view.ids.includes(id));
    const k = shown.indexOf(view.ids[+mv.dataset.move]), j = k + +mv.dataset.dir;
    if (k < 0 || j < 0 || j >= shown.length) return;
    [shown[k], shown[j]] = [shown[j], shown[k]];
    a.sel = [...shown, ...hidden]; a.ranked = true;
    syncAnswerDOM(); persist();
    // 重画后把光标放回刚才那一项的按钮上，到头了就换另一个方向
    const same = slip.querySelector(`[data-move="${mv.dataset.move}"][data-dir="${mv.dataset.dir}"]`);
    (same && !same.disabled ? same : slip.querySelector(`[data-move="${mv.dataset.move}"]:not([disabled])`))?.focus();
    return;
  }
  const ex = e.target.closest('.exit');
  if (ex) {
    a.exit = a.exit === ex.dataset.exit ? null : ex.dataset.exit;
    if (a.exit) { a.sel = []; a.rows = {}; a.extra = {}; delete a.ranked; }
    if (a.exit === '不确定') pulse(ex, WORD_UNSURE);
    syncAnswerDOM(); changed();
    // 选了跳过或不确定就翻到下一题，稍等一下让按下的样子先露出来；再点一次是取消，留在这题
    if (a.exit) { const from = cur; setTimeout(() => { if (cur === from) go(cur + 1); }, 260); }
  }
});
// 勾选或取消第 i 个选项：单选只留一个；多选里排他项和其他项互斥；排序题记下选的先后
function choose(i, on) {
  const a = answerOf(view.id);
  let order = view.state.order.slice();
  if (view.kind === 'single') order = [i];
  else if (on) {
    order = view.exclusive.includes(i) ? [] : order.filter(x => !view.exclusive.includes(x));
    order.push(i);
  } else order = order.filter(x => x !== i);
  // 排序题没动手排过时按选项顺序；全取消了就重新算没排过
  if (!order.length) delete a.ranked;
  if (!view.rank || !a.ranked) order.sort((x, y) => x - y);
  // 藏起来的选项（前面的回答变了）不留在回答里
  a.sel = order.map(x => view.ids[x]);
  a.exit = null;
}
slip.addEventListener('change', e => {
  if (!view) return;
  const a = answerOf(view.id), el = e.target;
  const opt = el.closest('.opt'), row = el.closest('.qrow');
  if (opt) {
    choose(+opt.dataset.i, el.checked);
    if (el.checked) pulse(opt);
  } else if (el.dataset.extra != null) {
    if (el.checked) a.extra[el.dataset.extra] = true; else delete a.extra[el.dataset.extra];
  } else if (row && el.type === 'radio') {
    a.rows[row.dataset.row] = el.value; a.exit = null;
  } else return;
  syncAnswerDOM(); changed();
});
// 自填：一输入就勾上这一项；追问：只记下文字。打字时不重画，免得输入框丢了光标
slip.addEventListener('input', e => {
  if (!view) return;
  const a = answerOf(view.id), el = e.target;
  if (el.dataset.free != null) {
    const i = +el.dataset.free;
    a.text[view.ids[i]] = el.value;
    if (el.value.trim() && !view.state.sel.has(i)) { choose(i, true); syncAnswerDOM(); changed(); return; }
  } else if (el.dataset.follow != null) a.follow = el.value;
  else return;
  persist();
});
function syncAnswerDOM() {
  const a = answerOf(view.id), followWas = !!(view.followUp && view.followUp.show);
  view.state = stateOf(view, a);
  slip.querySelectorAll('.opt').forEach(el => { el.querySelector('input').checked = view.state.sel.has(+el.dataset.i); });
  slip.querySelectorAll('.qrow').forEach(el => el.querySelectorAll('input[type=radio]').forEach(r => { r.checked = a.rows[el.dataset.row] === r.value; }));
  slip.querySelectorAll('[data-extra]').forEach(el => { el.checked = !!a.extra[el.dataset.extra]; });
  slip.querySelectorAll('.exit').forEach(el => el.setAttribute('aria-pressed', String(a.exit === el.dataset.exit)));
  const rank = slip.querySelector('.rank-wrap');
  if (rank) rank.innerHTML = QuestionView.rankHTML(view, view.state);
  // 追问框只在出现或消失时重画，免得正在输入的文字丢光标
  const follow = slip.querySelector('.follow-wrap'), followNow = !!(view.followUp && view.followUp.show);
  if (follow && followNow !== followWas) follow.innerHTML = QuestionView.followHTML(view, view.state);
}

buildPages();
