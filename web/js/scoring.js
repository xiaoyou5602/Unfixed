'use strict';
// 07 的证据表由 scoring_data.py 编译；这里实现其合成、优先级和回退。
// 纯函数：不改回答、不访问存储。audit 供调试，dimensions 供结果页。
window.QuestionScoring = (() => {
  const MISSING = new Set(['跳过', '不确定', '没有这类经历', '缺失']);
  const hit = x => x === '成立';
  const eligible = x => x && ['高', '中'].includes(x.status);
  const unique = xs => [...new Set(xs)];
  const POSSIBLE_MAX = 3;
  function confidence(primary, corroborating, contrary) {
    const p = primary.some(hit), c = corroborating.some(hit), n = contrary.some(hit);
    if (p && !n && corroborating.every(hit)) return '高';
    if (p && ((!n && corroborating.some(x => x !== '缺失')) || (n && c))) return '中';
    // 反证本身不是标签的支持线索。
    return p || c ? '线索' : '无';
  }

  function normalize(bank, answers, options = {}) {
    const flowBank = options.enabledQuestions ? { ...bank, questions: bank.questions.map(q =>
      options.enabledQuestions.includes(q.id) ? { ...q, enabled_by_default: true } : q) } : bank;
    const flow = window.QuestionFlow.path(flowBank, answers), values = {}, selected = {}, provenance = {};
    for (const q of flow.list) {
      const a = answers[q.id] || {}, opts = window.QuestionFlow.visibleOptions(q, flow.ctx);
      selected[q.id] = a.exit ? [] : (a.sel || []).map(id => opts.find(o => o.id === id)).filter(Boolean);
      // 排序题没动手排过时按选项顺序（15.11）
      if (q.response === '多选并排序' && !a.ranked) selected[q.id].sort((x, y) => opts.indexOf(x) - opts.indexOf(y));
      values[q.id] = a.exit ? [a.exit] : selected[q.id].map(o => o.value);
      for (const r of window.QuestionFlow.visibleRows(q, flow.ctx)) {
        values[`${q.id}[${r.id}]`] = [a.exit || (a.rows || {})[r.id]].filter(Boolean);
      }
    }
    const get = ref => (values[ref] || []).filter(v => !MISSING.has(v));
    const is = (ref, v) => get(ref).includes(v);
    // Q0-02 选"不拆分"暂时按拆分计分和输出，结果页照常给浪漫、性两侧的词，不再写成前缀（15.10 未改，代码先放开）
    const unsplit = false, skipSex = !is('Q2-01', '继续');
    const inherit = (row, target, source, transform = v => v) => {
      if (!is(`Q2-07[${row}]`, '一样')) return;
      const inherited = get(source).map(transform).flat().filter(Boolean);
      // 按行合并，不用一条展开题覆盖其他行；被隐藏的旧回答已在上面排除。
      values[target] = unique([...get(target), ...inherited]);
      provenance[target] ||= [];
      provenance[target].push({ mirror: `Q2-07[${row}]`, source, values: inherited });
    };
    if (!unsplit && !skipSex) {
      inherit('③a', 'Q2-08', 'Q1-07');
      inherit('③b', 'Q2-08', 'Q1-09', v => v === 'fray' ? v : null);
      inherit('④a', 'Q2-09', 'Q1-09', v => ['akoi·回应后消退', 'akoi·进入关系后消退'].includes(v) ? 'akoi·回应后消退' : null);
      inherit('④b', 'Q2-09', 'Q1-10', v => v.startsWith('akoi·') ? 'akoi·不需要或不希望被回应' : v);
      inherit('④c', 'Q2-09', 'Q1-11', v => v === 'disakoi' ? v : null);
      inherit('⑥', 'Q2-12', 'Q1-14', v => ({ '回避或排斥': '排斥', '无所谓': '没什么兴趣' }[v] || v));
      inherit('⑦', 'Q2-10', 'Q1-12', v => v === 'adex' ? null : v);
      inherit('⑧', 'Q2-13', 'Q1-15');
    }
    // 浪漫② 取频率的分，强度很弱时最多 1 分；频率没答、强度很弱也记 1 分（15.3）
    // Q1-21 确定没有过时不问 Q1-02，直接记 0 分
    const scores = window.SCORING_RULES.scores;
    let romantic = get('Q1-21')[0] === '确定没有过' ? 0 : scores['Q1-02'][get('Q1-02')[0]];
    if (get('Q1-03')[0] === '很弱') romantic = Math.min(romantic ?? 1, 1);
    // Q1-04 选感受相同时由 Q1-22 细分为体验相同或无法区分；Q1-22 没答仍记感受相同（15.3）
    const clarity = get('Q1-04')[0];
    const axes = { '浪漫①': (clarity === '感受相同' && get('Q1-22')[0]) || clarity || '缺失',
      '浪漫②': Object.keys(scores['浪漫②']).find(v => scores['浪漫②'][v] === romantic) || '缺失',
      '浪漫⑤': get('Q1-13')[0] || '缺失' };
    if (!unsplit && !skipSex) Object.assign(axes, { '性①': get('Q2-03')[0] || '缺失', '性②': get('Q2-02')[0] || '缺失',
      '性⑤': get('Q2-11')[0] || (is('Q2-07[⑤]', '一样') ? axes['浪漫⑤'] : '缺失') });
    for (const [k, v] of Object.entries(axes)) values[k] = [v];
    return { flow, values, selected, provenance, axes, unsplit, skipSex, get, is };
  }

  // 三值逻辑：OR 的任一支持足够；不成立必须所有相关输入都已作答。
  function evaluate(rule, ctx) {
    if (rule.all || rule.any) {
      const states = (rule.all || rule.any).map(r => evaluate(r, ctx));
      if (rule.any && states.some(hit)) return '成立';
      if (states.includes('缺失')) return '缺失';
      return (rule.all ? states.every(hit) : states.some(hit)) ? '成立' : '不成立';
    }
    if (rule.first) {
      const v = ctx.get(rule.first)[0];
      return !v ? '缺失' : rule.values.includes(v) ? '成立' : '不成立';
    }
    if (rule.op === '出现') return ctx.flow.ctx.shown.has(rule.ref) ? '成立' : '缺失';
    const vals = ctx.get(rule.ref);
    if (!vals.length) return '缺失';
    if (['≥', '≤'].includes(rule.op)) {
      // 比分数：逐行题按题号查分数表；没有分的取值算答了别的取值（15.3）
      const table = window.SCORING_RULES.scores[rule.ref.replace(/\[.*\]$/, '')], n = Number(rule.values[0]);
      return vals.some(v => v in table && (rule.op === '≥' ? table[v] >= n : table[v] <= n)) ? '成立' : '不成立';
    }
    const yes = rule.values.some(v => vals.includes(v));
    return (['≠', '∉', '不含'].includes(rule.op) ? !yes : yes) ? '成立' : '不成立';
  }

  function score(bank, answers, options = {}) {
    const ctx = normalize(bank, answers, options), audit = {};
    for (const rule of window.SCORING_RULES.rules) {
      if ((ctx.unsplit || ctx.skipSex) && rule.section === '15.7') continue;
      const evidence = Object.fromEntries(['primary', 'corroborating', 'contrary'].map(kind => [kind,
        rule[kind].map(e => ({ ...e, state: evaluate(e.rule, ctx) }))]));
      audit[rule.id] = { ...rule, ...evidence, status: confidence(...['primary', 'corroborating', 'contrary'].map(k => evidence[k].map(e => e.state))) };
    }
    // 只记线索、不算互证的附加证据（15.11、15.12）
    const addClues = (id, refs) => {
      if (!refs.length) return;
      audit[id].additionalClues = refs;
      if (audit[id].status === '无') audit[id].status = '线索';
    };
    addClues('QPR', ['亲密友谊', '以性为主的非浪漫关系'].filter(r => ctx.is(`Q4-03[${r}]`, '会')).map(r => `Q4-03[${r}]`));
    addClues('RA', ctx.is('Q4-02', 'QPR·不划分') ? ['Q4-02 = QPR·不划分'] : []);
    const ok = id => eligible(audit[id]);
    const clue = id => audit[id] && audit[id].status !== '无';
    const card = id => {
      const a = audit[id];
      return { id, label: id, confidence: a && eligible(a) ? a.status : '低',
        tentative: !!a && (a.grade !== 'A' || a.status === '线索'), definition: a?.definition || null,
        definitionSource: a?.definitionSource || null,
        basis: a ? [...a.primary, ...a.corroborating].filter(e => hit(e.state)).map(e => e.source).concat(a.additionalClues || []) : [] };
    };
    function attraction(sexual) {
      const suffix = sexual ? 'sexual' : 'romantic', axis = sexual ? '性' : '浪漫';
      const names = { a: sexual ? 'Asexual' : 'Aromantic', grey: `Grey${suffix}`, quoi: `Quoi${suffix}`,
        allo: sexual ? 'Allosexual' : 'Alloromantic', spec: sexual ? 'Ace-spec' : 'Aro-spec' };
      const sub = ['Demi', 'Recip', 'Fray', 'Akoi'].map(p => p + suffix);
      const extended = ['Desino', 'Apres', 'Coeo'].map(p => p + suffix);
      const time = sexual ? ['Aceflux', 'Acespike'] : ['Aroflux', 'Arospike'];
      const freq = ctx.axes[axis + '②'], clarity = ctx.axes[axis + '①'], temporal = ['flux', 'spike'].includes(ctx.axes[axis + '⑤']);
      const quoi = ['感受相同', '体验相同', '无法区分', '无法理解', '不适用'].includes(clarity);
      const selfSpec = ctx.is(sexual ? 'Q2-04' : 'Q1-05', '在光谱内');
      const objectSpec = ctx.is(sexual ? 'Q2-17' : 'Q1-20', '在光谱内');
      let conflict = false;
      // 同时计算互斥对，避免第一次降级掩盖第二组冲突。
      const incompatible = [[sub[0], sub[2]], [sub[0], extended[2]]].filter(pair => pair.every(ok));
      for (const pair of incompatible) for (const id of pair) {
        audit[id].originalStatus ||= audit[id].status;
        audit[id].status = '线索'; conflict = true;
      }
      const active = sub.filter(ok), greyActive = [...active, ...extended.filter(ok)];
      if (greyActive.length) { audit[names.grey].derivedFrom = greyActive; audit[names.grey].status = '高'; }
      let primary = [], possible = [], parents = [], umbrella = [], inSpectrum = false;
      if (freq === '缺失' && !quoi) primary = ['探索中'];
      else if (quoi) {
        primary = ok(names.quoi) ? [names.quoi] : [selfSpec ? names.spec : '探索中'];
        // grey 与 quoi 难分时并列；quoi 只到线索、又没选在光谱内时只留 grey（15.4）
        if (freq === '极少或很弱') primary = [...primary.filter(id => id !== '探索中'), names.grey];
        possible.push(...[...sub, ...extended, ...time].filter(clue));
        if (!ok(names.quoi)) possible.push(names.quoi);
        inSpectrum = selfSpec;
        // 光谱归属题只调层级不做开关：没选在光谱内也把上位词留在结果页（15.4 所属范围）
        if (!selfSpec && !primary.includes(names.spec)) {
          (ctx.is(sexual ? 'Q2-04' : 'Q1-05', '不在光谱内') ? umbrella : possible).push(names.spec);
        }
      } else if (temporal) {
        primary = [names.grey];
        if (freq === '从不' && ok(names.a)) primary.unshift(names.a);
        possible.push(...time.filter(clue)); inSpectrum = true;
      } else if (freq === '从不') {
        primary = [ok(names.a) ? names.a : names.spec];
        if (!ok(names.a)) possible.push(names.a);
        // 前提题对所有人出现：几乎没有、却答出前提的，子类和 aromantic 并列，由本人选（15.4 规则 4）
        if (!conflict && active.length) primary.push(active[0]);
        else if (conflict || greyActive.length || clarity === '有点模糊') primary.push(names.grey);
        inSpectrum = true;
      } else if (freq === '极少或很弱' || conflict || greyActive.length || clarity === '有点模糊') {
        primary = [names.grey];
        if (!conflict && active.length) {
          primary = [active[0]];
          const pairs = [[sub[0], sub[1]], [sub[3], sub[2]]];
          const pair = pairs.find(p => p.every(id => active.includes(id)));
          if (pair) primary = pair;
        }
        inSpectrum = true;
      } else if (objectSpec) { primary = [names.spec]; inSpectrum = true; }
      else primary = [ok(names.allo) ? names.allo : '探索中'];
      if (primary.includes('探索中')) possible.push(...Object.keys(audit).filter(id =>
        (sexual ? audit[id].section === '15.7' : ['15.4', '15.5'].includes(audit[id].section)) && clue(id)));
      if (primary.some(id => [names.a, names.grey, names.spec, names.allo, '探索中'].includes(id))) {
        possible.push(...[...sub, ...extended].filter(id => audit[id]?.status === '线索'));
      }
      // 不在 quoi 路径、却说不清渴望指向谁（Q2-10）时，Quoisexual 作为"可能"列出（15.7）
      if (!quoi && ok(names.quoi)) possible.push(names.quoi);
      if (primary.some(id => sub.includes(id)) && !primary.includes(names.a)) parents.push(names.grey);
      if (inSpectrum && !primary.includes(names.spec)) parents.push(names.spec);
      // aego 讲自己与情境的距离，不看吸引多少，在不在光谱内都留在"可以一起用的词"；cupio 以很少有吸引为前提，光谱外降为延伸区（9.2）
      const cupio = `Cupio${suffix}`, modifiers = [`Aego${suffix}`, ...(inSpectrum ? [cupio] : [])].filter(ok);
      let extensions = Object.keys(audit).filter(id => audit[id].grade === 'C' &&
        (sexual ? audit[id].section === '15.7' : audit[id].section === '15.5') && ok(id) &&
        (!audit[id].highOnly || audit[id].status === '高') && !time.includes(id));
      extensions.push(...active.filter(id => !primary.includes(id) && !possible.includes(id)), ...umbrella);
      if (!inSpectrum && ok(cupio)) extensions.push(cupio);
      possible = unique(possible).filter(id => !primary.includes(id) && (!audit[id]?.highOnly || audit[id].status === '高'));
      // "可能"最多 3 个（12.1 第 5 条）：Aro-spec 始终留在结果页，先占位；其余证据强的在前，同级按分类树顺序。
      // 挤掉的 C 级"高""中"回到延伸区，线索级不再列，相邻的词照常可以补上
      const rank = id => id === names.spec ? -1 : { '高': 0, '中': 1, '线索': 2 }[audit[id]?.status] ?? 3;
      possible = possible.map((id, i) => [id, i]).sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1])
        .map(([id]) => id).slice(0, POSSIBLE_MAX);
      extensions = extensions.filter(id => !possible.includes(id));
      // 相邻的词（15.17）：不看证据，前面一题答偏也有路可退；已经出现过的不重复，最多 2 个
      const near = window.SCORING_RULES.adjacent || {}, top = primary.slice(0, 2);
      const seen = new Set([...top, ...parents, ...possible, ...modifiers, ...extensions]);
      const adjacent = unique(top.flatMap(id => near[id === '探索中' ? `探索中（维度${sexual ? '二' : '一'}）` : id] || []))
        .filter(id => !seen.has(id)).slice(0, 2);
      const makeCard = id => {
        const result = card(id);
        if (audit[id]?.derivedFrom) result.basis.push(...audit[id].derivedFrom.flatMap(k => card(k).basis));
        if (id === names.spec && !result.basis.length) result.basis.push(...[names.a, names.quoi].filter(clue).flatMap(k => card(k).basis));
        if (id === names.grey && conflict) result.basis.push(...unique(incompatible.flat()).flatMap(k => card(k).basis));
        return result;
      };
      return { primary: primary.slice(0, 2).map(makeCard), modifiers: modifiers.map(card),
        parents: unique(parents), possible: possible.map(id => ({ ...card(id), tentative: true })),
        extensions: unique(extensions).map(card), adjacent: adjacent.map(id => ({ ...card(id), basis: [], tentative: true })), inSpectrum, exploring: primary.includes('探索中'),
        optionalExit: inSpectrum ? `Alico${suffix}` : null };
    }
    const romantic = attraction(false), sexual = ctx.unsplit || ctx.skipSex ? null : attraction(true);
    const otherIds = Object.keys(audit).filter(id => audit[id].section === '15.8' && ok(id));
    const other = { primary: [], modifiers: [], details: otherIds.filter(id => audit[id].grade !== 'C').map(card),
      extensions: otherIds.filter(id => audit[id].grade === 'C').map(card), possible: [] };
    // oriented / angled aroace 不出题、不自动输出（3.6）：在光谱内、又描述到某种其他吸引时列出，由本人在结果页选择（15.9）
    const aro = romantic.inSpectrum, ace = ctx.unsplit ? aro : !!sexual?.inSpectrum;
    const isA = (d, id) => !!d?.primary.some(c => c.id === id);
    const bothA = isA(romantic, 'Aromantic') && (ctx.unsplit || isA(sexual, 'Asexual'));
    other.optionalDerived = other.details.some(c => / attraction$/.test(c.id))
      ? [bothA && 'Oriented aroace', (aro || ace) && 'Angled aroace'].filter(Boolean) : [];

    // 4A 的先后：动手排过按排好的顺序，没排过按选项顺序（见 normalize）。
    let relationships = ctx.get('Q4-01').filter(ok);
    const partners = ['浪漫伴侣关系', 'QPR', '柏拉图伴侣'];
    if (relationships.includes('不寻求伴侣式关系') && relationships.some(id => partners.includes(id))) {
      if (relationships.find(id => partners.includes(id) || id === '不寻求伴侣式关系') === '不寻求伴侣式关系') relationships = relationships.filter(id => !partners.includes(id));
      else relationships = relationships.filter(id => id !== '不寻求伴侣式关系');
    }
    const relationshipPrimary = relationships.slice(0, 1);
    if (relationshipPrimary[0] === 'QPR' && ctx.is('Q4-02', 'QPR·超出友谊')) relationshipPrimary.push('柏拉图伴侣');
    if (!relationshipPrimary.length && ctx.is('Q4-01', '未定')) relationshipPrimary.push('未定／随缘');
    if (!relationshipPrimary.length && partners.some(id => ctx.is('Q4-01', id) && clue(id))) relationshipPrimary.push('伴侣式关系');
    const relRest = relationships.filter(id => !relationshipPrimary.includes(id));
    const elements = {};
    const q404 = bank.questions.find(q => q.id === 'Q4-04');
    for (const row of window.QuestionFlow.visibleRows(q404, ctx.flow.ctx)) {
      const value = ctx.get(`Q4-04[${row.id}]`)[0];
      if (value) (elements[value] ||= []).push({ id: row.id, text: row.text, exclusive: !!(q404.row_extra && answers['Q4-04']?.extra?.[row.id]) });
    }
    const relationship = { primary: relationshipPrimary.map(card), modifiers: relRest.slice(0, 2).map(card),
      parents: unique(relationshipPrimary.flatMap(id => partners.includes(id) ? ['伴侣式关系'] : ['亲密友谊', '选择的家人'].includes(id) ? ['非伴侣式的重要关系'] : [])),
      extensions: relRest.slice(2).map(card), possible: Object.keys(audit).filter(id => audit[id].section === '15.11' && audit[id].status === '线索' &&
        !relationshipPrimary.includes(id)).slice(0, POSSIBLE_MAX).map(card), elements };
    const structureIds = ['Monogamy', 'Polyamory', 'Open relationship', 'Ambiamorous', 'CNM'];
    const ideas = ['RA', 'Solo polyamory', '恋爱规范性批判', '离开关系电梯', '友谊中心'].filter(ok);
    const structurePrimary = ok('RA') ? 'RA' : structureIds.find(ok);
    const structureRest = ideas.filter(id => id !== structurePrimary);
    const structure = { primary: structurePrimary ? [card(structurePrimary)] : [], modifiers: structureRest.slice(0, 2).map(card),
      parents: ['Polyamory', 'Open relationship'].includes(structurePrimary) ? ['CNM'] : [],
      extensions: structureRest.slice(2).map(card), possible: Object.keys(audit).filter(id => audit[id].section === '15.12' && audit[id].status === '线索').slice(0, POSSIBLE_MAX).map(card),
      details: structureIds.filter(ok).map(card), hierarchy: ctx.is('Q5-02', '多元之爱') ?
        ({ '预设主次': '层级式', '自然形成的优先': '非层级式', '不分等级': '非层级式' }[ctx.get('Q5-03')[0]] || null) : null };

    let combined = null;
    if (sexual && !romantic.exploring && !sexual.exploring) {
      combined = romantic.inSpectrum ? (sexual.inSpectrum ? 'aroace' : 'alloaro') : sexual.inSpectrum ? 'alloace' : null;
    }
    const descriptions = describe(bank, answers, ctx);
    // 简写里的方向写叫法：取值是稳定的名字；无方向、不适用、不想标注不是叫法，不写
    const shortName = (id, o) => o.free_text ? answers[id]?.text?.[o.id]?.trim() || ''
      : ['无方向', '不适用', '不想标注'].includes(o.value) ? ''
      : id === 'QM-03' ? o.value + '恋' : o.value;
    const directions = ['QM-02', 'QM-03'].filter(id => ctx.selected[id]?.length).map(id => ({
      question: id, choices: ctx.selected[id].map(o => ({ value: o.value, text: o.free_text ? answers[id]?.text?.[o.id] || '' : o.text,
        short: shortName(id, o) })) }));
    let overall = null;
    if (ctx.unsplit) {
      const prefix = id => ({ Aromantic: 'a-', Alloromantic: 'allo-', 'Aro-spec': 'aspec', Aroflux: 'flux', Arospike: 'spike' }[id] || id.replace(/romantic$/i, '-').toLowerCase());
      const convert = c => ({ ...c, id: prefix(c.id), label: c.id === '探索中' ? '探索中' : `与 ${prefix(c.id)} 描述的形态接近`,
        definition: null, definitionSource: null });
      overall = { ...romantic, primary: romantic.primary.map(convert), modifiers: romantic.modifiers.map(convert),
        possible: romantic.possible.map(convert), extensions: romantic.extensions.map(convert), adjacent: romantic.adjacent.map(convert),
        parents: romantic.parents.map(prefix), optionalExit: romantic.inSpectrum ? 'alico-' : null,
        note: '你选择了不拆分浪漫与性，这里按整体吸引体验呈现。' };
      // 性侧态度、性欲、意愿仍在 details；派生词只用整体前缀，条件和依据取 15.7 的规则，性② 换成整体的浪漫②。
      if (!ctx.skipSex) {
        const whole = s => s.replaceAll('性②', '浪漫②');
        for (const [id, ruleId] of [['cupio-', 'Cupiosexual'], ['apothi-', 'Apothisexual'], ['bellus-', 'Bellussexual']]) {
          const e = window.SCORING_RULES.rules.find(r => r.id === ruleId).primary[0];
          if (!hit(evaluate(JSON.parse(whole(JSON.stringify(e.rule))), ctx)) ||
            [...overall.modifiers, ...overall.extensions].some(c => c.id === id)) continue;
          overall.extensions.push({ id, label: `与 ${id} 描述的形态接近`, tentative: true, confidence: '高', basis: [whole(e.source)] });
        }
      }
    }
    const dimensions = { romantic: ctx.unsplit ? null : romantic, sexual, overall, other, relationship, structure };
    // 结果页上的选择（14.11）只改简写：只看伞时写最上一层所属范围；两个并列时可以只取其一；alico 出口由本人选择写入
    const pick = options.pick || {};
    const nameOf = (d, key) => {
      if (!d) return '';
      if (options.granularity === 'umbrella' && d.parents.length) return d.parents[d.parents.length - 1];
      const chosen = d.primary.filter(c => c.id === pick[key]);
      return (chosen.length ? chosen : d.primary).map(c => c.label).join(' / ');
    };
    const main = [ctx.unsplit ? options.overallName || '' : nameOf(romantic, 'romantic'),
      nameOf(sexual, 'sexual'), nameOf(relationship, 'relationship'), nameOf(structure, 'structure')];
    const allowed = new Set(Object.values(dimensions).filter(Boolean).flatMap(d => [...(d.extensions || []), ...(d.details || [])].map(c => c.id)).filter(Boolean));
    const extras = [...[ctx.unsplit ? overall : romantic, sexual].map(d => d?.optionalExit), ...other.optionalDerived]
      .filter(id => id && (options.exits || []).includes(id));
    extras.push(...(options.includeInShorthand || []).filter(id => allowed.has(id)));
    if (options.includeDirections) extras.push(...directions.flatMap(d => d.choices.map(c => c.short)));
    return { version: 1, dimensions, combined, shorthand: options.noLabels ? '' : unique([...main, ...extras].filter(Boolean)).join(' · '),
      description: descriptions.map(d => d.text).join(''), descriptions, directions,
      details: Object.fromEntries(Object.entries(ctx.values).filter(([k, v]) => /^Q/.test(k) && v.some(x => !MISSING.has(x)))),
      audit: { labels: audit, axes: ctx.axes, inherited: ctx.provenance,
        missing: Object.fromEntries(Object.entries(ctx.values).filter(([, v]) => !v.length || v.some(x => MISSING.has(x)))) }, labelsHidden: !!options.noLabels };
  }

  function describe(bank, answers, ctx) {
    const out = [], sentence = s => /[。！？]$/.test(s) ? s : s + '。';
    for (const q of ctx.flow.list) {
      if (['Q0-02', 'Q2-01', 'QM-01'].includes(q.id)) continue;
      const a = answers[q.id] || {};
      if (a.exit) continue;
      const parts = [], names = [];
      // Q4-01 的关系形态只取冒号前的名字，相邻的几项按排好的先后并成一句
      const flush = () => { if (names.length) parts.push(sentence('我想要的关系包括' + names.splice(0).join('、'))); };
      for (const o of ctx.selected[q.id] || []) {
        if (MISSING.has(o.value)) continue;
        let s = o.free_text ? a.text?.[o.id]?.trim() : o.text;
        if (!s) continue;
        if (q.description_template) s = q.description_template.replace('{}', s);
        else if (q.id === 'Q4-01' && !s.startsWith('我')) { names.push(s.split('：')[0]); continue; }
        else if (q.part === 'QM') s = '我选择的方向叫法是' + s;
        flush();
        parts.push(sentence(s));
      }
      flush();
      for (const row of window.QuestionFlow.visibleRows(q, ctx.flow.ctx)) {
        const v = ctx.get(`${q.id}[${row.id}]`)[0];
        if (!v) continue;
        const o = q.row_options.find(o => o.value === v);
        const label = o && window.QuestionFlow.rowLabel(o, window.QuestionFlow.recap(row, ctx.flow.ctx));
        if (label) parts.push(sentence(q.id === 'Q2-07' ? `对于性吸引这边的${row.text}，和浪漫部分相比，我的回答是「${label}」`
          : `对于${row.text}，我的回答是「${label}」`));
        if (q.row_extra && a.extra?.[row.id]) parts.push(sentence(`对于${row.text}，${q.row_extra}`));
      }
      if (parts.length) out.push({ question: q.id, part: q.part, text: parts.join('') });
    }
    return out;
  }
  return { score, normalize, evaluate, confidence };
})();
