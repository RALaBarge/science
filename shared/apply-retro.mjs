// Gives the standalone pages (lesson map and Pick a Trade) the same Retro space look the lessons have.
// Retro is the default; ?style=classic gives the old look. The Atkinson Hyperlegible font faces are
// copied from a lesson page so the pages match.
//
//   node shared/apply-retro.mjs     rewrites shared/retro-snippet.html and (re)injects it into index.html
//
// docs/trades/build-page.mjs reads shared/retro-snippet.html and SWITCH when it builds Pick a Trade.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lesson = readFileSync(join(root, '6th', 'unit-02-thermal-energy.html'), 'utf8');
const faces = lesson.match(/@font-face\{[^}]*\}/g);
if (!faces || faces.length !== 2) throw new Error('font faces not found in the lesson page');

const CSS = `${faces.join('\n')}
html:root:root[data-style="retro"]{--bg:#160B33;--surface:#21114A;--surface-2:#2B1760;--soft:#2B1760;--ink:#F6EEFF;--muted:#C3B2E8;--line:#4B2F94;--accent:#FFD23F;--P:#6EC9FF;--E:#4DF0C2;--L:#FF7AA8;--M:#B9A3FF;--font:"Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;color-scheme:dark}
html[data-style="retro"] body{background:radial-gradient(800px 400px at 85% 0,#ff3fa433,transparent),radial-gradient(700px 400px at 5% 30%,#3fd4ff22,transparent),var(--bg)}
html[data-style="retro"] h1{background:linear-gradient(90deg,#FFD23F,#FF7AA8,#6EC9FF);-webkit-background-clip:text;background-clip:text;color:transparent}
html[data-style="retro"] .kicker{color:#4DF0C2}
html[data-style="retro"] .card,html[data-style="retro"] .u,html[data-style="retro"] details.sec,html[data-style="retro"] article.trade,html[data-style="retro"] .tw,html[data-style="retro"] .note,html[data-style="retro"] details.fam,html[data-style="retro"] .cant{border-color:#6E4BC8;box-shadow:0 0 22px #8a5cff33}
.styleswitch{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:.9rem;color:var(--muted);margin:0 0 6px}
.styleswitch .chip{font:inherit;font-size:.9rem;padding:6px 13px;min-height:36px;border-radius:999px;border:1.5px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.styleswitch .chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}`;

const JS = `(function(){
  var de=document.documentElement,p=new URLSearchParams(location.search);
  de.setAttribute('data-style',p.get('style')==='classic'?'classic':'retro');
  document.addEventListener('DOMContentLoaded',function(){
    var st=p.get('style')==='classic'?'classic':'retro',box=document.getElementById('styleSwitch');
    if(box){
      box.querySelectorAll('.chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.style===st));});
      box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
        var q=new URLSearchParams(location.search);if(b.dataset.style==='classic')q.set('style','classic');else q.delete('style');
        var s=q.toString();location.search=s?'?'+s:location.pathname.split('/').pop()+'?';});
    }
    if(p.get('style')==='classic')document.querySelectorAll('a[href]').forEach(function(a){
      var raw=a.getAttribute('href');if(!raw||raw[0]==='#'||/^(mailto|tel|javascript|https?:)/i.test(raw))return;
      if(/[?]style=/.test(raw))return;var h=raw.indexOf('#'),base=h<0?raw:raw.slice(0,h),hash=h<0?'':raw.slice(h);
      a.setAttribute('href',base+(base.indexOf('?')<0?'?':'&')+'style=classic'+hash);});
  });
})();`;

export const SNIPPET = `<!--retro-start-->\n<style id="retro-page">\n${CSS}\n</style>\n<script>\n${JS}\n</script>\n<!--retro-end-->\n`;
export const SWITCH = '<div class="styleswitch" id="styleSwitch" role="group" aria-label="Page style">Style <button class="chip" type="button" data-style="classic" aria-pressed="false">Classic</button><button class="chip" type="button" data-style="retro" aria-pressed="true">Retro space</button></div>';

writeFileSync(join(root, 'shared', 'retro-snippet.html'), SNIPPET);
writeFileSync(join(root, 'shared', 'retro-switch.html'), SWITCH);

// index.html: head snippet after <title>, switch as the first thing in the page wrapper
const idx = join(root, 'index.html');
let h = readFileSync(idx, 'utf8');
const crlf = h.includes('\r\n');
if (crlf) h = h.replace(/\r\n/g, '\n');
h = h.replace(/<!--retro-start-->[\s\S]*?<!--retro-end-->\n?/, '');
h = h.replace(/<!--retro-switch-->.*?<!--\/retro-switch-->\n?/, '');
const t = h.indexOf('</title>');
if (t < 0) throw new Error('no <title> in index.html');
h = h.slice(0, t + 8) + '\n' + SNIPPET + h.slice(t + 8);
h = h.replace('<main class="wrap" id="main">\n', '<main class="wrap" id="main">\n<!--retro-switch-->' + SWITCH + '<!--/retro-switch-->\n');
writeFileSync(idx, crlf ? h.replace(/\n/g, '\r\n') : h);
console.log('retro look applied to index.html');
