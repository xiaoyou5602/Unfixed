'use strict';
// Shared by the existing sample and manager preview. No branching/scoring here.
// q 里没给的部分（自填、定义、排序、追问、逐行）就不画，管理器预览照旧只传单选、多选需要的字段
window.QuestionView = (() => {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const text = s => { let n = 0; return esc(String(s).replace(/"/g, () => n++ % 2 ? '”' : '“')).replace(/\n/g, '<br>'); };
  const KIND_LABEL = { single: '单选', multi: '多选', rows: '逐行' };

  function optionsHTML(q, st) {
    const single = q.kind === 'single', free = q.free || new Set(), typed = st.text || {};
    return q.options.map((o, i) => `<label class="opt${single ? ' single' : ''}" data-i="${i}">
      <input type="${single ? 'radio' : 'checkbox'}" name="${esc(q.id)}" ${st.sel.has(i) ? 'checked' : ''}>
      <span class="box"></span><span class="txt">${text(o)}</span></label>${free.has(i)
        ? `<input class="free" type="text" data-free="${i}" value="${esc(typed[i] || '')}" placeholder="在这里填写" aria-label="${text(o)}">` : ''}`).join('');
  }
  // 排序：只排已选的项，按 st.order 的先后；少于两项时不用排
  function rankHTML(q, st) {
    const order = (st.order || []).filter(i => st.sel.has(i));
    if (!q.rank || order.length < 2) return '';
    const short = s => String(s).split('：')[0];
    return `<p class="rank-head">按想要的程度排一排（可以不排）</p><ol class="rank">${order.map((i, k) => `<li>
      <span>${text(short(q.options[i]))}</span>
      <button type="button" data-move="${i}" data-dir="-1" ${k === 0 ? 'disabled' : ''} aria-label="往前挪">↑</button>
      <button type="button" data-move="${i}" data-dir="1" ${k === order.length - 1 ? 'disabled' : ''} aria-label="往后挪">↓</button></li>`).join('')}</ol>`;
  }
  // 追问：选中触发它的选项时才出现
  function followHTML(q, st) {
    if (!q.followUp || !q.followUp.show) return '';
    return `<label class="follow"><span>${text(q.followUp.text)}</span>
      <textarea data-follow rows="2">${esc(st.follow || '')}</textarea></label>`;
  }
  // 逐行：每行一组单选，可带行内出口和每行都有的附加勾选；有类别的按类别分组
  function rowsHTML(q, st) {
    const vals = st.rows || {}, extra = st.extra || {};
    let cat = null;
    return `<div class="rows">${q.rows.map(r => {
      const head = r.category && r.category !== cat ? `<h2 class="row-cat">${text(r.category)}</h2>` : '';
      cat = r.category || cat;
      // 写了问句的行先复述之前的回答，再问性侧；其余行照旧先列题面
      const quote = r.quote ? `<p class="row-quote">${text(r.quote)}</p>` : '';
      return `${head}<div class="qrow" data-row="${esc(r.id)}" role="radiogroup" aria-label="${text(r.text)}">
        ${r.ask ? `${quote}<p class="row-text">${text(r.ask)}</p>` : `<p class="row-text">${text(r.text)}</p>${quote}`}
        <div class="row-opts">${(r.options || q.rowOptions).map(o => `<label class="pill${o.exit ? ' exit-pill' : ''}">
          <input type="radio" name="${esc(q.id)}-${esc(r.id)}" value="${esc(o.value)}" ${vals[r.id] === o.value ? 'checked' : ''}><span>${text(o.text)}</span></label>`).join('')}</div>
        ${q.rowExtra ? `<label class="row-extra"><input type="checkbox" data-extra="${esc(r.id)}" ${extra[r.id] ? 'checked' : ''}><span>${text(q.rowExtra)}</span></label>` : ''}
      </div>`;
    }).join('')}</div>`;
  }

  function render(q, st, footer = '') {
    // 这几题的“没有经历”放进答案列表，仍沿用标准出口的取值与计分含义。
    const optionExits = ['Q1-07', 'Q1-08', 'Q2-09'].includes(q.id) ? q.exits.filter(x => x.value === '没有这类经历') : [];
    const single = q.kind === 'single';
    const exitOptions = optionExits.map(x => `<label class="opt${single ? ' single' : ''}" data-exit="${esc(x.value)}">
      <input type="${single ? 'radio' : 'checkbox'}" name="${esc(q.id)}" ${st.exit === x.value ? 'checked' : ''}>
      <span class="box"></span><span class="txt">${text(x.text)}</span></label>`).join('');
    const body = q.kind === 'rows' ? rowsHTML(q, st)
      : `<div class="opts" role="group" aria-label="${text(q.title)}">${optionsHTML(q, st)}${exitOptions}</div>
         <div class="rank-wrap">${rankHTML(q, st)}</div><div class="follow-wrap">${followHTML(q, st)}</div>`;
    return `<div class="slip-head" data-question-id="${esc(q.id)}"><span class="qid">${esc(q.label || q.id)}</span><span>${text(q.part)}</span><span class="kind">${text(q.response || KIND_LABEL[q.kind])}</span></div>
    ${q.intro ? `<p class="intro">${text(q.intro)}</p>` : ''}
    <h1 class="stem">${text(q.stem)}</h1>
    ${q.note ? `<p class="note">${text(q.note)}</p>` : ''}
    ${(q.definitions || []).length ? `<dl class="defs">${q.definitions.map(d => `<dt>${text(d.term)}</dt><dd>${text(d.text)}</dd>`).join('')}</dl>` : ''}
    ${body}
    <div class="exits">${q.exits.filter(x => !optionExits.includes(x)).map(x =>
      `<button class="exit" data-exit="${esc(x.value)}" aria-pressed="${st.exit === x.value}">${text(x.text)}</button>`).join('')}
    </div>${footer}`;
  }
  function fromBank(q, part, intro = '') {
    return { id:q.id, title:q.title, part, kind:q.response === '单选' ? 'single':'multi', stem:q.stem, note:q.note || '', intro,
      options:(q.options || []).map(o=>o.text), exits:q.exits || [] };
  }
  return { render, rankHTML, followHTML, fromBank, text, esc };
})();
