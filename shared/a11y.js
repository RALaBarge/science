// Shared accessibility script, inlined into every built page by build.mjs.
// Sets aria-valuetext on range sliders from the page's own readout (the value and unit in the label),
// so a screen reader says "12 mL" instead of a bare "12". Existing readouts are not touched.
(function () {
  'use strict';
  var VALUE_TAGS = /^(SPAN|OUTPUT|B|STRONG|EM|I|MARK)$/;

  function labelOf(sl) {
    if (sl.labels && sl.labels.length) return sl.labels[0];
    return sl.closest ? sl.closest('label') : null;
  }
  function clean(s) { return s.replace(/\s+/g, ' ').trim(); }

  // "<label>Base added: <span>12</span> mL (25 mL of acid in the cup)</label>"  ->  "12 mL"
  function fromLabel(lb) {
    if (!lb) return '';
    var els = lb.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!VALUE_TAGS.test(el.tagName) || el.children.length || !clean(el.textContent)) continue;
      var v = clean(el.textContent), rest = '', n = el.nextSibling;
      while (n) { rest += n.textContent; n = n.nextSibling; }
      rest = clean(rest.split(/[(,;\u2014\u2013]|\s-\s/)[0]);
      if (rest && rest.length <= 24) v += ' ' + rest;
      return v;
    }
    return '';
  }
  function fromNeighbour(sl) {
    var id = sl.id, el = id && document.getElementById(id + 'V');
    if (el && !el.contains(sl) && clean(el.textContent)) return clean(el.textContent);
    var o = sl.parentNode && sl.parentNode.querySelector('output');
    return o && clean(o.textContent) ? clean(o.textContent) : '';
  }
  function update(sl) {
    var t = fromLabel(labelOf(sl)) || fromNeighbour(sl);
    if (t && t.length <= 60) { if (sl.getAttribute('aria-valuetext') !== t) sl.setAttribute('aria-valuetext', t); }
  }
  function all() { Array.prototype.forEach.call(document.querySelectorAll('input[type="range"]'), update); }

  var timer = 0;
  function soon() { clearTimeout(timer); timer = setTimeout(all, 120); }
  function start() {
    all();
    document.addEventListener('input', function (e) { if (e.target && e.target.type === 'range') { update(e.target); soon(); } });
    document.addEventListener('change', soon);
    if (window.MutationObserver) new MutationObserver(soon).observe(document.body, { childList: true, subtree: true, characterData: true });
    window.addEventListener('load', all);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
