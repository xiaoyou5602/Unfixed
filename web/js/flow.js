'use strict';
// 出题顺序：按题库顺序，用每道题的"出现"条件决定出不出。不计分，不渲染
// 条件的写法见 questions.json 的 condition_ops；条件只引用排在前面的题（qbank.py check 保证）
// 回答按选项 id 记（同一个取值可能有两个选项），比较条件时换成取值；出口（跳过、不确定、没有这类经历）也算取值
// 出现了却一项都没选、也没点出口的题按"跳过"算；逐行题一行都不出现时整题不出（14.1）
window.QuestionFlow = (() => {
  const POSITIVE = new Set(['=', '∈', '含']), NEGATIVE = new Set(['≠', '∉', '不含']);

  // ctx：{ bank, answers: {题号: {sel: [选项 id], rows: {行 id: 取值}, exit}}, shown: Set(已出现的题号) }
  function test(rule, ctx) {
    if (!rule) return true;
    if (rule.all) return rule.all.every(r => test(r, ctx));
    if (rule.any) return rule.any.some(r => test(r, ctx));
    const appeared = ctx.shown.has(rule.question);
    if (rule.op === '出现') return appeared;
    if (rule.op === '未出现') return !appeared;
    if (!appeared) return false;
    const match = vals => {
      const hit = rule.values.some(v => vals.has(v));
      if (POSITIVE.has(rule.op)) return hit;
      if (NEGATIVE.has(rule.op)) return !hit;
      throw new Error(`不认识的条件写法 ${rule.op}`);
    };
    if (rule.row) return rowValues(ctx, rule.question, rule.row).some(match);
    return match(chosen(ctx, rule.question));
  }

  const question = (ctx, id) => ctx.bank.questions.find(q => q.id === id);
  const visibleOptions = (q, ctx) => (q.options || []).filter(o => !o.show_if || test(o.show_if.rule, ctx));
  const visibleRows = (q, ctx) => (q.rows || []).filter(r => !r.show_if || test(r.show_if.rule, ctx));

  // 这道题选中的取值；条件变了以后藏起来的选项不算，出现了却什么都没选的记为跳过
  function chosen(ctx, id) {
    const a = ctx.answers[id], vals = new Set();
    if (a) {
      if (a.exit) vals.add(a.exit);
      const q = question(ctx, id), sel = new Set(a.sel || []);
      for (const o of visibleOptions(q, ctx)) if (sel.has(o.id)) vals.add(o.value);
    }
    if (!vals.size && ctx.shown.has(id)) vals.add('跳过');
    return vals;
  }
  // 逐行题：行名或轴号对得上的每一行各给一组取值；整题选了出口时，每行都记为这个出口
  function rowValues(ctx, id, row) {
    const a = ctx.answers[id] || {}, q = question(ctx, id);
    return visibleRows(q, ctx).filter(r => r.id === row || r.axis === row).map(r => {
      const v = a.exit || (a.rows || {})[r.id];
      return new Set(v ? [v] : []);
    });
  }

  // 按当前回答走一遍，返回会出现的题和那一刻的条件上下文。还没答到的题按"出现了但没选"算，所以后面的题数是估计
  function path(bank, answers) {
    const shown = new Set(), ctx = { bank, answers, shown }, list = [];
    for (const q of bank.questions) {
      if (q.enabled_by_default === false) continue;
      if (q.show_if && !test(q.show_if.rule, ctx)) continue;
      if (q.rows && !visibleRows(q, ctx).length) continue;
      shown.add(q.id); list.push(q);
    }
    return { list, ctx };
  }
  // 每部分第一道出现的题前面放引导语；带条件的句子按回答判断
  const intro = (part, ctx) => (part.intro || []).filter(x => !x.show_if || test(x.show_if.rule, ctx)).map(x => x.text).join('');

  const answered = a => !!a && (!!a.exit || (a.sel || []).length > 0 || Object.keys(a.rows || {}).length > 0);

  // 镜像行按引用题的旧答案挑回述句；只引用部分取值、一项都没选到时用"未选"那句。没有对应句子时返回 null，由页面照旧列出原选项
  function recap(row, ctx) {
    const ref = row.quotes, a = ref && ctx.answers[ref.question];
    if (!row.recaps || !answered(a)) return null;
    let keys = [a.exit];
    if (!a.exit) {
      const sel = new Set(a.sel || []);
      keys = [...new Set(visibleOptions(question(ctx, ref.question), ctx)
        .filter(o => sel.has(o.id) && (!ref.values || ref.values.includes(o.value))).map(o => o.value))];
      if (!keys.length) keys = ['未选'];
    }
    const lines = keys.map(k => row.recaps[k]).filter(Boolean);
    if (!lines.length) return null;
    return { quote: `你之前说，${lines.join('；')}。`, gloss: keys.map(k => (row.glosses || {})[k]).find(Boolean) || null };
  }
  // 行选项的文字：是非行带上这一行的具体说明，如"一样：也会变淡"
  const rowLabel = (o, rc) => rc?.gloss?.[o.value] ? `${o.text}：${rc.gloss[o.value]}` : o.text;

  return { test, path, intro, chosen, visibleOptions, visibleRows, answered, recap, rowLabel };
})();
