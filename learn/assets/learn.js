/* ══════════════════════════════════════════════════════════════
   LEARN ENGINE — shared by every page. You rarely need to edit this.
   Load order on every page: registry.js → glossary.js → learn.js
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var SITE = 'https://vivekneoaiims.com/';
  var GA_ID = 'G-2QFEQ4G44F';
  var REG = window.LEARN_REGISTRY, GLOSS = window.LEARN_GLOSSARY || {};

  /* Root of /learn/, worked out from this script's own location,
     so the folder works on your domain, a subfolder, or opened locally. */
  var me = document.currentScript || document.querySelector('script[src*="learn.js"]');
  var ROOT = me.src.replace(/assets\/learn\.js.*$/, '');

  /* ── Google Analytics (same property as main site) ── */
  if (location.protocol.indexOf('http') === 0) {
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID);
  }

  /* ── Registry helpers ── */
  var INDEX = {};
  REG.tracks.forEach(function (tr) {
    tr.topics.forEach(function (tp) {
      Object.keys(tp.levels || {}).forEach(function (lk) {
        var lv = tp.levels[lk];
        lv.modules.forEach(function (m, i) {
          INDEX[m.id] = { m: m, track: tr, topic: tp, levelKey: lk, level: lv, i: i };
        });
      });
    });
  });
  function modUrl(id, hash) {
    var e = INDEX[id]; if (!e) return ROOT;
    if (e.m.status !== 'live') return ROOT + e.topic.path + '#' + e.levelKey;
    return ROOT + e.topic.path + e.level.file + '#' + (hash || e.m.anchor);
  }
  function resolve(ref) { var p = ref.split('#'); return modUrl(p[0], p[1]); }
  function isLive(ref) { var e = INDEX[ref.split('#')[0]]; return e && e.m.status === 'live'; }

  /* ── Progress (per browser) ── */
  function getDone() { try { return JSON.parse(localStorage.getItem('learn-done') || '{}'); } catch (e) { return {}; } }
  function setDone(id) { var d = getDone(); d[id] = 1; try { localStorage.setItem('learn-done', JSON.stringify(d)); } catch (e) {} }
  function markDone(id) {
    setDone(id); markRail();
    var b = document.querySelector('[data-module="' + id + '"] .mark'); if (b) { b.textContent = 'Done ✓'; b.classList.add('is-done'); }
  }

  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    for (var k in (attrs || {})) el.setAttribute(k, attrs[k]);
    if (html != null) el.innerHTML = html; return el;
  }

  /* ── Top bar ── */
  function topbar(crumbs) {
    var c = crumbs.map(function (x, i) {
      return (x[1] && i < crumbs.length - 1) ? '<a href="' + x[1] + '">' + x[0] + '</a>' : '<span>' + x[0] + '</span>';
    }).join('<i aria-hidden="true">/</i>');
    var bar = h('header', { class: 'l-top' },
      '<a class="l-brand" href="' + SITE + '"><b>Dr. Vivek Kumar</b><small>Neonatology</small></a>' +
      '<nav class="l-crumbs" aria-label="Breadcrumb">' + c + '</nav>' +
      '<a class="l-gloss-link" href="' + ROOT + 'glossary.html">Glossary</a>');
    document.body.insertBefore(bar, document.body.firstChild);
  }
  function footer() {
    document.body.appendChild(h('footer', { class: 'l-foot' },
      '<div><b>Dr. Vivek Kumar</b>, MD, DM (AIIMS) — Assistant Professor of Neonatology, LHMC, New Delhi</div>' +
      '<div>For learning only; follow your unit protocols for patient care. <a href="' + SITE + '">vivekneoaiims.com</a></div>'));
  }

  /* ── Sketchy line filter for hand-drawn SVGs (use filter="url(#sketchy)") ── */
  document.body.insertAdjacentHTML('afterbegin',
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="sketchy">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3"/>' +
    '<feDisplacementMap in="SourceGraphic" scale="2.2"/></filter></svg>');

  /* ── Cross-links: <a data-to="abg-b-02#errors">…</a> ── */
  function wireLinks(root) {
    (root || document).querySelectorAll('a[data-to]').forEach(function (a) {
      var ref = a.getAttribute('data-to');
      a.href = resolve(ref);
      if (!isLive(ref)) { a.classList.add('soon'); a.title = 'Coming soon'; }
    });
  }

  /* ── Glossary popovers: <span class="term" data-term="pco2">pCO₂</span> ── */
  var pop;
  function wireTerms(root) {
    (root || document).querySelectorAll('.term[data-term]').forEach(function (t) {
      var g = GLOSS[t.getAttribute('data-term')]; if (!g) return;
      t.setAttribute('tabindex', '0'); t.setAttribute('role', 'button');
      function open(ev) {
        ev.preventDefault(); ev.stopPropagation(); closePop();
        var sec = t.closest('[data-module]'), here = sec && INDEX[sec.dataset.module];
        var target = g.see ? g.see.split('#')[0] : null;
        var more = '';
        if (g.see && !(here && here.m.id === target)) {
          more = '<a href="' + resolve(g.see) + '">' + (isLive(g.see) ? 'Learn this in: ' + INDEX[target].m.title : 'Advanced module, coming soon') + '</a>';
        }
        pop = h('div', { class: 'l-pop', role: 'dialog' }, '<b>' + g.term + '</b><p>' + g.def + '</p>' + more);
        document.body.appendChild(pop);
        var r = t.getBoundingClientRect(), pw = Math.min(300, innerWidth - 24);
        pop.style.width = pw + 'px';
        pop.style.left = Math.max(12, Math.min(r.left + scrollX, innerWidth - pw - 12)) + 'px';
        pop.style.top = (r.bottom + scrollY + 8) + 'px';
      }
      t.addEventListener('click', open);
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') open(e); });
    });
  }
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) { if (pop && !pop.contains(e.target)) closePop(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });

  /* ── Quiz: Learn.quiz('elementId', [{q, o:[...], a:index, why}]) ── */
  function quiz(id, qs) {
    var box = document.getElementById(id); if (!box) return;
    var right = 0, answered = 0;
    qs.forEach(function (item, qi) {
      var card = h('div', { class: 'q' }, '<p class="q-text"><span>' + (qi + 1) + '</span>' + item.q + '</p>');
      var opts = h('div', { class: 'q-opts' });
      item.o.forEach(function (opt, oi) {
        var b = h('button', { type: 'button' }, opt);
        b.onclick = function () {
          if (card.dataset.done) return; card.dataset.done = 1; answered++;
          var ok = oi === item.a; if (ok) right++;
          b.classList.add(ok ? 'right' : 'wrong');
          opts.children[item.a].classList.add('right');
          card.appendChild(h('p', { class: 'q-why ' + (ok ? 'ok' : 'no') }, (ok ? 'Yes. ' : 'Not quite. ') + item.why));
          wireTerms(card); wireLinks(card);
          if (answered === qs.length) {
            box.appendChild(h('p', { class: 'q-score' }, right + ' of ' + qs.length + ' right' + (right === qs.length ? '. Full marks.' : '. Have another look at the sketches above and try again later.')));
            var sec = box.closest('[data-module]'); if (sec && right >= Math.ceil(qs.length * 0.6)) markDone(sec.dataset.module);
          }
        };
        opts.appendChild(b);
      });
      card.appendChild(opts); box.appendChild(card);
    });
  }

  /* ── Acid–base maths shared by simulators ── */
  /* Normal neonatal ranges from the Ventilation Workbook 2026 */
  var N = { phLo: 7.35, phHi: 7.45, co2Lo: 35, co2Hi: 45, hco3Lo: 20, hco3Hi: 24 };
  function hh(hco3, pco2) { return 6.1 + Math.log10(hco3 / (0.03 * pco2)); }
  function hplus(ph) { return Math.pow(10, 9 - ph); }
  function decode(ph, co2, hco3) {
    var r = { steps: [] };
    var phState = ph < N.phLo ? 'acid' : ph > N.phHi ? 'alk' : 'normal';
    var side = phState !== 'normal' ? phState : (ph < 7.40 ? 'acid' : ph > 7.40 ? 'alk' : null);
    r.steps.push(phState === 'acid' ? 'pH ' + ph.toFixed(2) + ' is low → <b>acidosis</b>.' :
                 phState === 'alk' ? 'pH ' + ph.toFixed(2) + ' is high → <b>alkalosis</b>.' :
                 'pH ' + ph.toFixed(2) + ' is in range' + (side ? ', on the ' + (side === 'acid' ? 'acid' : 'alkaline') + ' side of 7.40.' : '.'));
    var resp = (side === 'acid' && co2 > N.co2Hi) || (side === 'alk' && co2 < N.co2Lo);
    var meta = (side === 'acid' && hco3 < N.hco3Lo) || (side === 'alk' && hco3 > N.hco3Hi);
    var allNormal = co2 >= N.co2Lo && co2 <= N.co2Hi && hco3 >= N.hco3Lo && hco3 <= N.hco3Hi;
    if (phState === 'normal' && allNormal) { r.primary = 'normal'; r.label = 'Normal acid–base'; r.steps.push('pCO₂ and HCO₃⁻ are both in range. Nothing to fix here.'); return r; }
    if (!side) { r.primary = 'unclear'; r.label = 'pH exactly 7.40 with abnormal values'; r.steps.push('Could be fully compensated or mixed. This needs the Advanced tools.'); return r; }
    if (resp && meta) {
      r.primary = 'mixed'; r.label = 'Mixed: ' + (side === 'acid' ? 'respiratory + metabolic acidosis' : 'respiratory + metabolic alkalosis');
      r.steps.push('pCO₂ ' + co2 + ' and HCO₃⁻ ' + hco3 + ' are <b>both</b> pushing pH the same way.');
      r.steps.push('pCO₂ and HCO₃⁻ moved in <b>opposite</b> directions → <b>mixed disorder</b>. Double trouble, so act fast.');
      return r;
    }
    if (!resp && !meta) { r.primary = 'unclear'; r.label = 'Values don\'t fit'; r.steps.push('Neither pCO₂ nor HCO₃⁻ explains this pH. Suspect a sampling error and repeat.'); r.recheck = true; return r; }
    var kind = resp ? 'resp' : 'meta';
    r.primary = (resp ? 'resp-' : 'meta-') + side;
    r.label = (resp ? 'Respiratory ' : 'Metabolic ') + (side === 'acid' ? 'acidosis' : 'alkalosis');
    r.steps.push(resp ? 'pCO₂ ' + co2 + ' moved <b>opposite</b> to pH, so the <b>lungs</b> are the cause.'
                      : 'HCO₃⁻ ' + hco3 + ' moved the <b>same way</b> as pH, so it is <b>metabolic</b>.');
    var comp = resp ? (side === 'acid' ? hco3 > N.hco3Hi : hco3 < N.hco3Lo) : (side === 'acid' ? co2 < N.co2Lo : co2 > N.co2Hi);
    var helper = resp ? 'Kidneys (HCO₃⁻ ' + hco3 + ')' : 'Lungs (pCO₂ ' + co2 + ')';
    if (comp && phState === 'normal') { r.comp = 'fully compensated'; r.steps.push(helper + ' have pulled pH back into range → <b>fully compensated</b>.'); }
    else if (comp) { r.comp = 'partially compensated'; r.steps.push(helper + ' are helping, but pH is still off → <b>partially compensated</b>.'); }
    else if (phState === 'normal') { r.comp = 'borderline'; r.steps.push('pH sits just inside range and the other side hasn\'t moved → <b>mild / borderline</b>.'); }
    else { r.comp = 'uncompensated'; r.steps.push(helper.split(' (')[0] + ' haven\'t responded yet → <b>uncompensated</b>' + (resp ? ' (kidneys need days)' : '') + '.'); }
    r.steps.push(r.comp === 'uncompensated' || r.comp === 'borderline' ? 'Only one value is off → <b>simple disorder</b>.' : 'pCO₂ and HCO₃⁻ moved the <b>same</b> direction → <b>simple disorder</b>.');
    r.kind = kind; r.side = side;
    return r;
  }

  /* ── Level page: one file holding all modules of a level ── */
  function markRail() {
    var d = getDone();
    document.querySelectorAll('.l-rail li[data-id]').forEach(function (li) { li.classList.toggle('done', !!d[li.dataset.id]); });
  }
  function levelPage(topicId, lk) {
    var tr, tp; REG.tracks.forEach(function (t) { t.topics.forEach(function (x) { if (x.id === topicId) { tr = t; tp = x; } }); });
    if (!tp || !tp.levels[lk]) return;
    var lv = tp.levels[lk], topicUrl = ROOT + tp.path, other = lk === 'basics' ? 'advanced' : 'basics', ol = tp.levels[other];
    topbar([['Learn', ROOT], [tr.title, ROOT + '#' + tr.id], [tp.title, topicUrl], [lv.title]]);
    document.body.classList.add('lvl-' + lk);
    var main = document.querySelector('main');
    var list = lv.modules.map(function (m) {
      var inner = '<span class="n">' + m.n + '</span>' + m.title;
      return '<li data-id="' + m.id + '">' + (m.status === 'live' ? '<a href="#' + m.anchor + '">' + inner + '</a>' : '<span class="soon">' + inner + '</span>') + '</li>';
    }).join('');
    var rail = h('aside', { class: 'l-rail' },
      '<details open><summary><span class="lvl-chip">' + lv.title + '</span> ' + tp.title + '<span class="rail-cur"></span></summary><ol>' + list + '</ol>' +
      (ol ? '<a class="switch" href="' + topicUrl + '#' + other + '">Switch to ' + ol.title + '</a>' : '') + '</details>');
    var wrap = h('div', { class: 'l-wrap' }); main.parentNode.insertBefore(wrap, main);
    wrap.appendChild(rail); wrap.appendChild(main);
    var det = rail.querySelector('details'), small = function () { return innerWidth < 900; };
    if (small()) det.removeAttribute('open');
    rail.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { if (small()) det.removeAttribute('open'); }); });
    markRail();

    /* end-of-module bar: mark done + next */
    var live = lv.modules.filter(function (m) { return m.status === 'live'; });
    live.forEach(function (m, i) {
      var sec = document.querySelector('[data-module="' + m.id + '"]'); if (!sec) return;
      var nx = live[i + 1];
      var bar = h('div', { class: 'mod-end' },
        '<button type="button" class="mark">Mark as done</button>' +
        (nx ? '<a href="#' + nx.anchor + '">Next: ' + nx.title + ' ↓</a>' : ''));
      sec.appendChild(bar);
      var mk = bar.querySelector('.mark');
      if (getDone()[m.id]) { mk.textContent = 'Done ✓'; mk.classList.add('is-done'); }
      mk.onclick = function () { markDone(m.id); };
    });

    /* highlight the module being read */
    var cur = rail.querySelector('.rail-cur');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.dataset.module;
          rail.querySelectorAll('li').forEach(function (li) { li.classList.toggle('cur', li.dataset.id === id); });
          cur.textContent = ': ' + INDEX[id].m.title;
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      document.querySelectorAll('section[data-module]').forEach(function (s) { io.observe(s); });
    }

    var pn = h('nav', { class: 'l-pn', 'aria-label': 'Level navigation' },
      '<a class="prev" href="' + topicUrl + '"><small>Back to</small>' + tp.title + '</a><span></span>' +
      (ol ? '<a class="next" href="' + topicUrl + '#' + other + '"><small>Finished ' + lv.title + '?</small>Go to ' + ol.title + '</a>' : ''));
    main.appendChild(pn);
    document.title = tp.title + ': ' + lv.title + ' | Dr. Vivek Kumar';
  }

  /* ── Topic page: two doors + module lists ── */
  function topicPage(topicId) {
    var tr, tp;
    REG.tracks.forEach(function (t) { t.topics.forEach(function (x) { if (x.id === topicId) { tr = t; tp = x; } }); });
    if (!tp) return;
    topbar([['Learn', ROOT], [tr.title, ROOT + '#' + tr.id], [tp.title]]);
    var d = getDone();
    Object.keys(tp.levels).forEach(function (lk) {
      var el = document.querySelector('.door.' + lk); if (!el) return;
      var lv = tp.levels[lk], live = lv.modules.filter(function (m) { return m.status === 'live'; });
      var done = lv.modules.filter(function (m) { return d[m.id]; }).length;
      el.querySelector('.door-list').innerHTML = lv.modules.map(function (m) {
        return '<li class="' + (d[m.id] ? 'done ' : '') + (m.status !== 'live' ? 'soon' : '') + '">' +
          (m.status === 'live' ? '<a href="' + modUrl(m.id) + '"><span class="n">' + m.n + '</span>' + m.title + (m.mins ? '<em>' + m.mins + ' min</em>' : '') + '</a>'
                               : '<span><span class="n">' + m.n + '</span>' + m.title + '<em>soon</em></span>') + '</li>';
      }).join('');
      var start = el.querySelector('.door-start');
      if (start) {
        if (live.length) { var nx = live.filter(function (m) { return !d[m.id]; })[0] || live[0]; start.href = modUrl(nx.id); start.textContent = done ? 'Continue: ' + nx.title : 'Start ' + lv.title; }
        else { start.removeAttribute('href'); start.textContent = 'Coming soon'; start.classList.add('off'); }
      }
      var meta = el.querySelector('.door-progress'); if (meta) meta.textContent = done ? done + ' of ' + lv.modules.length + ' done' : '';
    });
  }

  /* ── Hub page ── */
  function hubPage() {
    topbar([['Learn']]);
    var box = document.getElementById('tracks'); if (!box) return;
    box.innerHTML = REG.tracks.map(function (tr) {
      var topics = tr.topics.length ? tr.topics.map(function (tp) {
        var live = tp.status !== 'soon' && Object.keys(tp.levels).length;
        return live ? '<a class="topic" href="' + ROOT + tp.path + '"><b>' + tp.title + '</b><span>' + tp.blurb + '</span></a>'
                    : '<span class="topic soon"><b>' + tp.title + '</b><span>Coming soon</span></span>';
      }).join('') : '<span class="topic soon"><b>In preparation</b><span>' + tr.blurb + '</span></span>';
      return '<section class="track" id="' + tr.id + '"><h2><span aria-hidden="true">' + tr.icon + '</span>' + tr.title + '</h2><div class="topics">' + topics + '</div></section>';
    }).join('');
  }

  /* ── Glossary page ── */
  function glossaryPage() {
    topbar([['Learn', ROOT], ['Glossary']]);
    var box = document.getElementById('gloss'); if (!box) return;
    box.innerHTML = Object.keys(GLOSS).sort(function (a, b) { return GLOSS[a].term.localeCompare(GLOSS[b].term); }).map(function (k) {
      var g = GLOSS[k];
      return '<div class="g-item" id="' + k + '"><dt>' + g.term + '</dt><dd>' + g.def +
        (g.see ? ' <a href="' + resolve(g.see) + '">' + (isLive(g.see) ? INDEX[g.see.split('#')[0]].m.title : 'Advanced (soon)') + '</a>' : '') + '</dd></div>';
    }).join('');
  }

  /* ── Pocket cards get a print/save button ── */
  function wirePocket() {
    document.querySelectorAll('.pocket').forEach(function (p) {
      var b = h('button', { type: 'button', class: 'print-btn' }, 'Print or save as PDF');
      b.onclick = function () { document.body.classList.add('printing-pocket'); p.classList.add('print-me'); window.print();
        setTimeout(function () { document.body.classList.remove('printing-pocket'); p.classList.remove('print-me'); }, 500); };
      p.appendChild(b);
    });
  }

  /* ── Boot ── */
  var page = document.body.dataset.page;
  if (page === 'level') levelPage(document.body.dataset.topic, document.body.dataset.level);
  else if (page === 'topic') topicPage(document.body.dataset.topic);
  else if (page === 'hub') hubPage();
  else if (page === 'glossary') glossaryPage();
  footer(); wireLinks(); wireTerms(); wirePocket();

  window.Learn = { quiz: quiz, hh: hh, hplus: hplus, decode: decode, N: N, url: resolve, wire: function (el) { wireLinks(el); wireTerms(el); }, done: markDone };
})();
