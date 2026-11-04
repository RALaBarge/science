/* "Find your fit" quiz: questions and scoring. Plain JS, no libraries, runs in Node and in a browser.
   Input: answers {setting, social, physical, focus[], brain[], avoid[], training, priority[]} and the occupation
   list in data.json (each with tags, path, wage, growth, ai, miWorkers, family, deepDive).
   Output: the best matches, each with the reasons it matched.
   The quiz never asks about gender, race, family or appearance. */
(function (root) {
  'use strict';

  var QUESTIONS = [
    { id: 'setting', type: 'single', text: 'Where would you rather spend most of your workday?', options: [
      ['outdoors', 'Outside'], ['indoors', 'Inside'], ['mixed', 'Some of both'], ['vehicle', 'Moving around in a vehicle or machine'], ['any', 'Does not matter']] },
    { id: 'social', type: 'single', text: 'Who do you want to be around?', options: [
      ['solo', 'Mostly by myself'], ['crew', 'A team or crew I work with'], ['public', 'Customers, patients or the public'], ['any', 'Does not matter']] },
    { id: 'physical', type: 'single', text: 'How much hard physical work is okay?', options: [
      ['light', 'Not much'], ['moderate', 'Some: on my feet, some lifting'], ['heavy', 'A lot is fine'], ['any', 'Does not matter']] },
    { id: 'focus', type: 'multi', max: 2, text: 'What would you most like to be doing? Pick up to two.', options: [
      ['build', 'Building or installing things'], ['fix', 'Figuring out what is broken and fixing it'], ['operate', 'Running machines or driving vehicles'],
      ['care', 'Looking after people\'s health or safety'], ['grow', 'Working with plants, animals, land or trees'], ['make', 'Making things or parts'],
      ['inspect', 'Checking and testing that things are right'], ['serve', 'Cooking, serving or helping customers']] },
    { id: 'brain', type: 'multi', max: 2, text: 'Which kind of thinking do you like? Pick up to two.', options: [
      ['troubleshoot', 'Working out why something is not working'], ['math', 'Measuring and calculating'], ['detail', 'Careful, precise work'],
      ['creative', 'Designing or making things look good'], ['tech', 'Computers, electronics and controls'], ['judgment', 'Making quick decisions under pressure']] },
    { id: 'avoid', type: 'multi', max: 8, text: 'Is there anything you would rather avoid? Pick any, or none.', options: [
      ['heights', 'Working high up'], ['tight-spaces', 'Tight spaces'], ['dirty', 'Dirty or greasy work'], ['hot-cold', 'Very hot or cold places'],
      ['irregular-hours', 'Nights, weekends or on-call'], ['travel', 'Being away from home'], ['danger', 'Real risk of getting hurt'], ['noise', 'Loud places']] },
    { id: 'training', type: 'single', text: 'How long are you willing to train before you earn?', options: [
      ['short', 'A few weeks to a few months'], ['mid', 'About a year or two (certificate or on-the-job)'], ['long', 'Several years (apprenticeship or a 2-year degree)'], ['college', 'A four-year degree is fine'], ['any', 'Does not matter']] },
    { id: 'priority', type: 'multi', max: 2, text: 'What matters most to you? Pick up to two, or none.', options: [
      ['pay', 'Good pay'], ['growth', 'A field that is growing'], ['safeFromAI', 'Work that is hard to hand to software'], ['manyJobs', 'Lots of jobs in Michigan']] }
  ];

  var PATH_RANK = { 'onjob-short': 1, 'onjob-mid': 1, 'certificate': 1.5, 'onjob-long': 2, 'associate': 3, 'apprenticeship': 3, 'college': 4, 'unknown': 2 };
  var TRAIN_MAX = { short: 1.5, mid: 2, long: 3, college: 4, any: 4 };
  var PHYS = { light: 1, moderate: 2, heavy: 3 };
  var LABEL = {};
  QUESTIONS.forEach(function (q) { q.options.forEach(function (o) { LABEL[q.id + ':' + o[0]] = o[1]; }); });

  function pctRank(values) {
    // returns f(v) in [0,1]: fraction of known values that are below v
    var s = values.filter(function (v) { return v != null; }).sort(function (a, b) { return a - b; });
    return function (v) {
      if (v == null || !s.length) return 0;
      var lo = 0, hi = s.length;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (s[mid] < v) lo = mid + 1; else hi = mid; }
      return lo / s.length;
    };
  }

  function prepare(data) {
    return {
      data: data,
      wageRank: pctRank(data.map(function (o) { return o.wage; })),
      growthRank: pctRank(data.map(function (o) { return o.growth; })),
      workersRank: pctRank(data.map(function (o) { return o.miWorkers; }))
    };
  }

  function score(o, a, ctx, relaxLevel) {
    var t = o.tags, pts = 0, why = [], blocked = null;
    var avoid = a.avoid || [];
    var hits = t.cond.filter(function (c) { return avoid.indexOf(c) >= 0; });
    if (hits.length) {
      if (relaxLevel === 0) blocked = 'avoid';
      else { pts -= 6 * hits.length; }
    }
    if (PATH_RANK[o.path] > (TRAIN_MAX[a.training] || 4)) {
      if (relaxLevel < 2) blocked = blocked || 'training'; else pts -= 4;
    }
    if (a.physical && a.physical !== 'any') {
      var want = PHYS[a.physical], has = PHYS[t.physical];
      if (a.physical === 'light' && has === 3) { if (relaxLevel < 2) blocked = blocked || 'physical'; else pts -= 3; }
      else if (has > want) pts -= 2 * (has - want);
      else if (has === want) { pts += 1; why.push(t.physical + ' physical work'); }
    }
    if (a.setting && a.setting !== 'any') {
      if (t.setting === a.setting) { pts += 3; why.push(LABEL['setting:' + a.setting].toLowerCase()); }
      else if (t.setting === 'mixed' && (a.setting === 'outdoors' || a.setting === 'indoors')) { pts += 1.5; why.push('some time ' + a.setting); }
      else if (a.setting === 'mixed' && (t.setting === 'outdoors' || t.setting === 'indoors')) pts += 1;
      else pts -= 3;
    }
    if (a.social && a.social !== 'any') {
      if (t.social === a.social) { pts += 2; why.push(LABEL['social:' + a.social].toLowerCase()); }
      else pts -= 1;
    }
    (a.focus || []).forEach(function (f) {
      if (t.focus.indexOf(f) >= 0) { pts += 6; why.push(LABEL['focus:' + f].toLowerCase()); }
    });
    (a.brain || []).forEach(function (b) {
      if (t.brain.indexOf(b) >= 0) { pts += 2; why.push('uses ' + b); }
    });
    (a.priority || []).forEach(function (p) {
      if (p === 'pay') { pts += 3 * ctx.wageRank(o.wage); }
      if (p === 'growth') { pts += 3 * ctx.growthRank(o.growth); if (o.growth != null && o.growth >= 8) why.push('growing (+' + o.growth + '% projected)'); }
      if (p === 'manyJobs') { pts += 3 * ctx.workersRank(o.miWorkers); }
      if (p === 'safeFromAI') { if (o.ai === 'low') { pts += 3; why.push('hard to hand to software'); } else if (o.ai === 'medium') pts += 1; else if (o.ai === 'high') pts -= 1; }
    });
    // Prefer trades a student can actually find work in, and the ones this guide covers in depth.
    pts += 4 * ctx.workersRank(o.miWorkers) + (o.deepDive ? 2 : 0);
    return { pts: pts, why: why, blocked: blocked };
  }

  // Best n matches, at most two from one family, relaxing the hard filters only if too few survive.
  function recommend(answers, ctxOrData, n) {
    var ctx = Array.isArray(ctxOrData) ? prepare(ctxOrData) : ctxOrData;
    n = n || 5;
    for (var relax = 0; relax <= 2; relax++) {
      var scored = [];
      ctx.data.forEach(function (o) {
        if (/all other|^miscellaneous|^helpers/i.test(o.name)) return; // catch-all rows say nothing to a student
        var s = score(o, answers, ctx, relax);
        if (!s.blocked) scored.push({ o: o, pts: s.pts, why: s.why });
      });
      scored.sort(function (x, y) { return y.pts - x.pts || (y.o.miWorkers || 0) - (x.o.miWorkers || 0); });
      var out = [], perFam = {};
      for (var i = 0; i < scored.length && out.length < n; i++) {
        var f = scored[i].o.family;
        if ((perFam[f] || 0) >= 2) continue;
        perFam[f] = (perFam[f] || 0) + 1;
        out.push({ soc: scored[i].o.soc, name: scored[i].o.name, family: f, blurb: scored[i].o.blurb, score: Math.round(scored[i].pts * 10) / 10,
          because: scored[i].why.slice(0, 4), deepDive: scored[i].o.deepDive, relaxed: relax > 0 });
      }
      if (out.length >= n || relax === 2) return out;
    }
    return [];
  }

  var api = { QUESTIONS: QUESTIONS, prepare: prepare, recommend: recommend };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TradeQuiz = api;
})(typeof window !== 'undefined' ? window : this);
