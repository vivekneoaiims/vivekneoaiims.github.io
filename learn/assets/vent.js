/* ══════════════════════════════════════════════════════════════
   VENT SIM — a small breath model + ventilator-screen drawings,
   shared by the Ventilation and Pulmonary Graphics pages.

   VentSim.run(opts)            → simulated samples {t,p,v,f,start}
   VentSim.monitor(el, opts)    → live sweeping P/F/V screen (+ loops)
   VentSim.loop(el, opts, kind) → static P-V ('pv') or flow-volume ('fv') loop

   opts (all optional):
     pip 20, peep 5 (cmH2O) · ti 0.35 s · rr 40 /min
     C 1.5 (mL/cmH2O)  · R 0.08 (cmH2O per mL/s; ×1000 = cmH2O/L/s)
     leak 0–0.6 (fraction lost) · secretions true/false
     overdist true/false (lung over-stretched: "beaking")
     slowFlow true/false (inadequate inspiratory flow)
   Units on screen: P cmH2O, flow L/min, volume mL.
   ══════════════════════════════════════════════════════════════ */
(function () {
  var DT = 0.004;
  var DEF = { pip: 20, peep: 5, ti: 0.35, rr: 40, C: 1.5, R: 0.08, leak: 0, secretions: false, overdist: false, slowFlow: false };
  function cfg(o) { var c = {}, k; for (k in DEF) c[k] = DEF[k]; for (k in o || {}) c[k] = o[k]; return c; }

  /* elastic recoil pressure of the lung for a volume above FRC */
  function pel(V, c) {
    if (!c.overdist) return V / c.C;
    var Vk = 0.8 * 15 * c.C;                             // knee: about the volume a normal breath reaches
    return V < Vk ? V / c.C : Vk / c.C + (V - Vk) / (c.C * 0.12);
  }

  function run(o, breaths) {
    var c = cfg(o), period = 60 / c.rr, n = breaths || 8;
    var tauRise = c.slowFlow ? 0.16 : 0.025, tauFall = 0.02;
    var T = [], P = [], V = [], F = [], S = [], Vm = [];
    var vol = 0, vMeas = 0, paw = c.peep, seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 - 0.5; }
    var steps = Math.round(n * period / DT);
    for (var i = 0; i < steps; i++) {
      var t = i * DT, tb = t % period, insp = tb < c.ti;
      if (tb < DT) { S.push(i); vMeas = 0; }
      var target = insp ? c.pip : c.peep;
      paw += (target - paw) * (DT / (insp ? tauRise : tauFall));
      var flow = (paw - c.peep - pel(vol, c)) / c.R;      // mL/s into the lung
      vol = Math.max(0, vol + flow * DT);
      var fm = flow;
      if (c.leak && !insp) fm = flow * (1 - c.leak);        // the ventilator never sees leaked gas come back
      if (c.secretions) { var w = Math.sin(t * 2 * Math.PI * 14) * (insp ? 4 : 9) + rnd() * 8; fm += w; }
      vMeas = Math.max(c.leak ? -1e9 : 0, vMeas + fm * DT);
      T.push(t); P.push(paw + (c.secretions ? rnd() * 0.8 : 0)); F.push(fm * 0.06); V.push(Math.max(0, vMeas)); Vm.push(vol);
    }
    return { t: T, p: P, f: F, v: V, lung: Vm, start: S, period: period, c: c };
  }

  /* one steady-state breath (the last full one) */
  function lastBreath(d) {
    var s = d.start, a = s[s.length - 2], b = s[s.length - 1];
    return { p: d.p.slice(a, b), f: d.f.slice(a, b), v: d.v.slice(a, b) };
  }

  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, at, parent) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; }
  function txt(parent, x, y, s, at) { var e = el('text', Object.assign({ x: x, y: y }, at || {}), parent); e.textContent = s; return e; }

  var COL = { p: '#ffb547', f: '#5fd4c6', v: '#f59ac3', grid: 'rgba(255,255,255,.10)', label: '#e9dcef', bg: '#1f0f26' };
  var CH = {
    p: { name: 'Pressure', unit: 'cmH₂O', lo: 0, hi: 30 },
    f: { name: 'Flow', unit: 'L/min', lo: -12, hi: 12 },
    v: { name: 'Volume', unit: 'mL', lo: 0, hi: 30 }
  };

  /* ── Live monitor ─────────────────────────────────────────── */
  function monitor(host, o, extra) {
    extra = extra || {};
    var chans = extra.channels || ['p', 'f', 'v'], W = 640, LW = 74, SH = extra.stripH || 78, GAP = 14, cols = 280, win = extra.window || 3;
    var H = chans.length * (SH + GAP) + 8;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, class: 'vmon', role: 'img', 'aria-label': 'Ventilator screen showing ' + chans.map(function (k) { return CH[k].name; }).join(', ') + ' against time' });
    host.innerHTML = ''; host.appendChild(svg);
    el('rect', { x: 0, y: 0, width: W, height: H, rx: 12, fill: COL.bg }, svg);
    var strips = {}, data, buf = {}, cur = 0, T = 0, last = null, raf = null, playing = true, scale = {};
    chans.forEach(function (k, i) {
      var y0 = 8 + i * (SH + GAP), g = el('g', {}, svg);
      el('line', { x1: LW, x2: W - 10, y1: y0 + SH, y2: y0 + SH, stroke: COL.grid }, g);
      var zero = el('line', { x1: LW, x2: W - 10, stroke: 'rgba(255,255,255,.25)', 'stroke-dasharray': '3 4' }, g);
      txt(g, 12, y0 + 24, CH[k].name, { class: 'sans', 'font-size': 14, 'font-weight': 600, style: 'fill:' + COL[k] });
      txt(g, 12, y0 + 42, CH[k].unit, { class: 'sans', 'font-size': 11, style: 'fill:' + COL.label });
      var hiT = txt(g, LW - 6, y0 + 12, '', { class: 'sans', 'font-size': 10, 'text-anchor': 'end', style: 'fill:' + COL.label });
      var loT = txt(g, LW - 6, y0 + SH, '', { class: 'sans', 'font-size': 10, 'text-anchor': 'end', style: 'fill:' + COL.label });
      var path = el('path', { fill: 'none', stroke: COL[k], 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
      strips[k] = { y0: y0, path: path, zero: zero, hiT: hiT, loT: loT };
    });
    var dot = el('line', { y1: 4, y2: H - 4, stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1.5 }, svg);

    function setScale() {
      chans.forEach(function (k) {
        var a = data[k], lo = CH[k].lo, hi = CH[k].hi, mx = Math.max.apply(null, a), mn = Math.min.apply(null, a);
        if (k === 'f') { var m = Math.max(Math.abs(mx), Math.abs(mn)) * 1.15; hi = Math.max(4, Math.ceil(m / 2) * 2); lo = -hi; }
        else { hi = Math.max(hi * 0.5, Math.ceil(mx * 1.15 / 5) * 5); lo = Math.min(0, Math.floor(mn / 5) * 5); }
        if (extra.fix && extra.fix[k]) { lo = extra.fix[k][0]; hi = extra.fix[k][1]; }
        scale[k] = [lo, hi]; var s = strips[k];
        s.hiT.textContent = hi; s.loT.textContent = lo;
        var zy = Y(k, 0); s.zero.setAttribute('y1', zy); s.zero.setAttribute('y2', zy); s.zero.style.display = lo < 0 ? '' : 'none';
      });
    }
    function Y(k, val) { var s = strips[k], r = scale[k]; return s.y0 + SH - (val - r[0]) / (r[1] - r[0]) * SH; }
    function X(col) { return LW + col / cols * (W - 10 - LW); }
    function sample(k, time) { var n = data.t.length, i = Math.floor(time / DT) % n; return data[k][i]; }
    function draw() {
      chans.forEach(function (k) {
        var d = '', pen = false, gap = 10;
        for (var c = 0; c < cols; c++) {
          var ahead = (c - cur + cols) % cols;
          if (buf[k][c] == null || (ahead > 0 && ahead <= gap)) { pen = false; continue; }
          d += (pen ? 'L' : 'M') + X(c).toFixed(1) + ' ' + Y(k, buf[k][c]).toFixed(1); pen = true;
        }
        strips[k].path.setAttribute('d', d);
      });
      dot.setAttribute('x1', X(cur)); dot.setAttribute('x2', X(cur));
      if (extra.onTick) extra.onTick(Math.floor(T / DT) % data.t.length, data);
    }
    function advance(dt) {
      var t0 = T; T += dt;
      var c0 = Math.floor(t0 / win * cols), c1 = Math.floor(T / win * cols);
      for (var c = c0 + 1; c <= c1; c++) {
        var col = c % cols, tt = c * win / cols;
        chans.forEach(function (k) { buf[k][col] = sample(k, tt); });
      }
      cur = c1 % cols;
    }
    function frame(ts) {
      if (last == null) last = ts;
      var dt = Math.min(0.1, (ts - last) / 1000); last = ts;
      if (playing) { advance(dt * (extra.speed || 1)); draw(); }
      raf = requestAnimationFrame(frame);
    }
    function fill() { // draw a full screen instantly (static / reduced motion / printing)
      chans.forEach(function (k) { buf[k] = new Array(cols); });
      T = 0; advance(win * 0.999); cur = cols - 1;
    }
    function set(newO) {
      o = newO; data = run(o, Math.max(6, Math.ceil(12 / (60 / cfg(o).rr))));
      // drop warm-up so traces start in steady state
      var cut = data.start[2] || 0; ['t', 'p', 'f', 'v'].forEach(function (k) { data[k] = data[k].slice(cut); });
      setScale();
      if (!buf.p && !buf.f && !buf.v) fill(); else { var keepT = T; fill(); T = keepT; cur = Math.floor(T / win * cols) % cols; }
      draw();
      return api;
    }
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var api = {
      set: set, svg: svg,
      play: function () { playing = true; if (!raf && !reduce) raf = requestAnimationFrame(frame); },
      pause: function () { playing = false; },
      data: function () { return data; }
    };
    set(o);
    if (!reduce && extra.live !== false) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) api.play(); else { playing = false; } }); }).observe(svg);
      } else api.play();
    }
    return api;
  }

  /* ── Static loop drawing (paper style, for sketches) ───────── */
  function loop(host, o, kind, extra) {
    extra = extra || {};
    var W = extra.w || 320, H = extra.h || 260, L = 46, B = 34, Tm = 14, Rm = 14;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, class: 'vloop', role: 'img', 'aria-label': kind === 'pv' ? 'Pressure-volume loop' : 'Flow-volume loop' });
    host.innerHTML = ''; host.appendChild(svg);
    var sets = [{ o: o, col: extra.col || '#7b1e3a', w: 3 }];
    if (extra.ref) sets.unshift({ o: extra.ref, col: '#9a8ca6', w: 2, dash: '5 5' });
    var all = sets.map(function (s) { var d = run(s.o, 6); return { b: lastBreath(d), s: s }; });
    var xs = [], ys = [];
    all.forEach(function (a) { if (kind === 'pv') { xs = xs.concat(a.b.p); ys = ys.concat(a.b.v); } else { xs = xs.concat(a.b.v); ys = ys.concat(a.b.f); } });
    var x0 = kind === 'pv' ? 0 : 0, x1 = extra.xmax || Math.ceil(Math.max.apply(null, xs) * 1.12 / 5) * 5;
    var ymax = extra.ymax || Math.ceil(Math.max.apply(null, ys.map(Math.abs)) * 1.15 / 2) * 2, y0 = kind === 'pv' ? 0 : -ymax, y1 = ymax;
    function X(v) { return L + (v - x0) / (x1 - x0) * (W - L - Rm); }
    function Y(v) { return Tm + (y1 - v) / (y1 - y0) * (H - Tm - B); }
    var ax = el('g', { stroke: '#3b3b44', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, svg);
    el('path', { d: 'M' + X(x0) + ' ' + Tm + ' V' + (H - B) + ' H' + (W - Rm) }, ax);
    if (kind === 'fv') el('path', { d: 'M' + X(x0) + ' ' + Y(0) + ' H' + (W - Rm), stroke: '#c9c3cf', 'stroke-dasharray': '4 4' }, ax);
    txt(svg, (L + W - Rm) / 2, H - 8, kind === 'pv' ? 'Pressure (cmH₂O)' : 'Volume (mL)', { 'text-anchor': 'middle', 'font-size': 17 });
    txt(svg, 14, (Tm + H - B) / 2, kind === 'pv' ? 'Volume (mL)' : 'Flow (L/min)', { 'text-anchor': 'middle', 'font-size': 17, transform: 'rotate(-90 14 ' + (Tm + H - B) / 2 + ')' });
    if (kind === 'fv') { txt(svg, W - Rm - 4, Tm + 14, 'inspiration', { 'text-anchor': 'end', 'font-size': 15, fill: '#5e2b8c' }); txt(svg, W - Rm - 4, H - B - 6, 'expiration', { 'text-anchor': 'end', 'font-size': 15, fill: '#5e2b8c' }); }
    var paths = [];
    all.forEach(function (a) {
      var bx = kind === 'pv' ? a.b.p : a.b.v, by = kind === 'pv' ? a.b.v : a.b.f, d = '';
      for (var i = 0; i < bx.length; i += 2) d += (i ? 'L' : 'M') + X(bx[i]).toFixed(1) + ' ' + Y(by[i]).toFixed(1);
      var p = el('path', { d: d, fill: a.s.dash ? 'none' : (extra.fill || 'rgba(123,30,58,.10)'), stroke: a.s.col, 'stroke-width': a.s.w, 'stroke-linejoin': 'round', class: a.s.dash ? '' : 'draw' }, svg);
      if (a.s.dash) p.setAttribute('stroke-dasharray', a.s.dash);
      paths.push(p);
    });
    return { svg: svg, X: X, Y: Y, paths: paths, txt: function (x, y, s, at) { return txt(svg, x, y, s, at); }, el: function (t, at) { return el(t, at, svg); } };
  }

  /* ── Static scalar (paper style) ───────────────────────────── */
  function scalar(host, o, ch, extra) {
    extra = extra || {};
    var W = extra.w || 560, H = extra.h || 200, L = 46, B = 30, Tm = 14, Rm = 12, n = extra.breaths || 2;
    var d = run(o, n + 3), a = d.start[2], b = d.start[2 + n];
    var ys = d[ch].slice(a, b), ts = d.t.slice(a, b).map(function (t) { return t - d.t[a]; });
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, class: 'vscalar', role: 'img', 'aria-label': CH[ch].name + ' against time' });
    host.innerHTML = ''; host.appendChild(svg);
    var lo = ch === 'f' ? -(extra.ymax || Math.ceil(Math.max.apply(null, ys.map(Math.abs)) * 1.2)) : 0;
    var hi = extra.ymax || (ch === 'f' ? -lo : Math.ceil(Math.max.apply(null, ys) * 1.2 / 5) * 5);
    var tmax = ts[ts.length - 1];
    function X(t) { return L + t / tmax * (W - L - Rm); }
    function Y(v) { return Tm + (hi - v) / (hi - lo) * (H - Tm - B); }
    var ax = el('g', { stroke: '#3b3b44', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, svg);
    el('path', { d: 'M' + L + ' ' + Tm + ' V' + (H - B) + ' H' + (W - Rm) }, ax);
    if (lo < 0) el('path', { d: 'M' + L + ' ' + Y(0) + ' H' + (W - Rm), stroke: '#c9c3cf', 'stroke-dasharray': '4 4' }, ax);
    txt(svg, W - Rm, H - 8, 'Time (s)', { 'text-anchor': 'end', 'font-size': 16 });
    txt(svg, 14, (Tm + H - B) / 2, CH[ch].name + ' (' + CH[ch].unit + ')', { 'text-anchor': 'middle', 'font-size': 15, transform: 'rotate(-90 14 ' + (Tm + H - B) / 2 + ')' });
    var p = '';
    for (var i = 0; i < ys.length; i += 2) p += (i ? 'L' : 'M') + X(ts[i]).toFixed(1) + ' ' + Y(ys[i]).toFixed(1);
    el('path', { d: p, fill: 'none', stroke: extra.col || '#7b1e3a', 'stroke-width': 3, 'stroke-linejoin': 'round', class: 'draw' }, svg);
    return { svg: svg, X: X, Y: Y, data: d, period: d.period, txt: function (x, y, s, at) { return txt(svg, x, y, s, at); }, el: function (t, at) { return el(t, at, svg); } };
  }

  /* replay the "pen drawing" animation on any .draw paths inside root */
  function redraw(root) {
    (root || document).querySelectorAll('path.draw').forEach(function (p) {
      var len = 2000; try { len = Math.ceil(p.getTotalLength()); } catch (e) {}
      p.style.transition = 'none'; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 1.6s ease-in-out'; p.style.strokeDashoffset = 0;
    });
  }
  document.addEventListener('learn:slide', function (e) { redraw(e.detail.el); });
  document.addEventListener('learn:step', function (e) { redraw(e.detail.el); });

  window.VentSim = { run: run, monitor: monitor, loop: loop, scalar: scalar, redraw: redraw, lastBreath: lastBreath, defaults: DEF, colors: COL };
})();
