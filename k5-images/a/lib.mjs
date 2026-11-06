// Builder "k5a": adds drawn figures, small quizzes and rewritten Try-it cells to K-2 pages.
// Figures sit inside the matching aid cell between <!--k5a-start id=..--> markers (idempotent; separate from k5images markers).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const INK = 'var(--ink, #12172B)', MUTED = 'var(--muted, #47506E)', LINE = 'var(--line, #D0D8E8)', S2 = 'var(--surface-2, #E8EDF6)',
  SURF = 'var(--surface, #fff)', BEAM = 'var(--beam, #F2A900)', BLUE = 'var(--reflect, #2B66E8)', ORANGE = 'var(--absorb, #D6450B)',
  TEAL = 'var(--transmit, #0B7F70)', ONC = 'var(--on-color, #fff)', RED = 'var(--red, #D93036)', GREEN = 'var(--green, #25904F)', SHADE = 'var(--shade, #222A4A)';
export const T = (x, y, s, o = {}) => (Array.isArray(s) ? s : [s]).map((ln, i) => `<text x="${x}" y="${y + i * (o.lh || (o.s || 15) * 1.25)}" text-anchor="${o.a || 'middle'}" font-size="${o.s || 15}" font-weight="${o.w || 400}" fill="${o.f || INK}">${esc(ln)}</text>`).join('');
export const R = (x, y, w, h, fill = S2, stroke = LINE, rx = 8, sw = 1.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const C = (x, y, r, fill, stroke = 'none', w = 1.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
export const E = (x, y, rx, ry, fill, stroke = INK, w = 1.5) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
export const L = (x1, y1, x2, y2, col = INK, w = 2, dash) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
export const P = (d, fill = 'none', stroke = INK, w = 2) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export function arrow(x1, y1, x2, y2, col = INK, w = 4, head = 13) {
  const a = Math.atan2(y2 - y1, x2 - x1), hx = x2 - Math.cos(a) * head * 0.9, hy = y2 - Math.sin(a) * head * 0.9;
  const px = -Math.sin(a) * head * 0.55, py = Math.cos(a) * head * 0.55;
  return L(x1, y1, hx, hy, col, w) + `<polygon points="${x2},${y2} ${hx + px},${hy + py} ${hx - px},${hy - py}" fill="${col}"/>`;
}
export const sun = (x, y, r = 16) => C(x, y, r, BEAM, INK, 1.5) + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return L(x + Math.cos(a) * (r + 4), y + Math.sin(a) * (r + 4), x + Math.cos(a) * (r + 11), y + Math.sin(a) * (r + 11), BEAM, 3); }).join('');
export const person = (x, y, s = 1, col = BLUE) => C(x, y - 46 * s, 10 * s, S2, INK, 1.5) + P(`M${x} ${y - 36 * s} V${y - 8 * s} M${x} ${y - 8 * s} l${-9 * s} ${24 * s} M${x} ${y - 8 * s} l${9 * s} ${24 * s}`, 'none', col, 4 * s);
export const cloud = (x, y, s = 1, fill = S2) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 12 a14 14 0 0 1 4 -27 a18 18 0 0 1 34 -4 a14 14 0 0 1 12 31 z" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/></g>`;
export const tree = (x, y, s = 1) => R(x - 4 * s, y - 22 * s, 8 * s, 22 * s, ORANGE, INK, 1, 1) + C(x, y - 36 * s, 19 * s, GREEN, INK, 1.5);
export const check = (x, y, col = GREEN) => P(`M${x - 8} ${y} l6 7 l11 -15`, 'none', col, 4);
export const cross = (x, y, col = RED) => P(`M${x - 7} ${y - 7} l14 14 M${x + 7} ${y - 7} l-14 14`, 'none', col, 4);
export const tag = (x, y, s, o = {}) => { const w = s.length * (o.s || 14) * 0.56 + 14, h = (o.s || 14) + 10; return R(x - w / 2, y - h + 7, w, h, SURF, LINE, h / 2, 1.5) + T(x, y, s, { s: o.s || 14, w: 700, f: o.f }); };
export const W = 480;
export function svg(id, title, desc, h, body, show = true) {
  return `<svg class="k5i-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" font-family="var(--font-body, system-ui, sans-serif)">` +
    `<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc><rect width="${W}" height="${h}" fill="${SURF}"/>` +
    (show ? T(W / 2, 28, title, { s: 18, w: 700 }) : '') + body + `</svg>`;
}
export function icon(id, desc, body, w = 160, h = 130) {
  return `<svg class="k5i-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(desc)}" font-family="var(--font-body, system-ui, sans-serif)"><title>${esc(desc)}</title>${body}</svg>`;
}
export function fig(id, svgStr, caption, alt) {
  return `<!--k5a-start id=${id}-->\n<figure class="k5i k5i-chart" id="fig-${id}">${svgStr}<figcaption>${esc(caption)}</figcaption><details class="k5i-alt"><summary>Text version of this picture</summary><p>${esc(alt)}</p></details></figure>\n<!--k5a-end id=${id}-->\n`;
}
// small multiple-choice sorter. rounds: [{q, icon(svg string, optional), opts:[..], a:index, why}]
export function quiz(id, intro, rounds, caption) {
  const cfg = JSON.stringify({ intro, rounds }).replace(/</g, '\\u003c');
  return `<!--k5a-start id=${id}-->
<figure class="k5i k5i-chart k5i-widget" id="fig-${id}"><div class="k5w" id="w-${id}"></div><figcaption>${esc(caption)}</figcaption></figure>
<script>(function(){var cfg=${cfg},root=document.getElementById("w-${id}");if(!root)return;var i=0;
function draw(){root.innerHTML="";var p0=document.createElement("p");p0.className="small";p0.textContent=cfg.intro;root.appendChild(p0);
if(i>=cfg.rounds.length){var e=document.createElement("p");e.setAttribute("aria-live","polite");e.innerHTML="<b>All done!</b> You sorted all "+cfg.rounds.length+" cards.";root.appendChild(e);var rb=document.createElement("button");rb.type="button";rb.textContent="Play again";rb.onclick=function(){i=0;draw()};var rw=document.createElement("div");rw.className="row";rw.appendChild(rb);root.appendChild(rw);return}
var r=cfg.rounds[i];var h=document.createElement("p");h.innerHTML="<b>Card "+(i+1)+" of "+cfg.rounds.length+"</b>";root.appendChild(h);
if(r.icon){var d=document.createElement("div");d.innerHTML=r.icon;d.style.maxWidth="170px";root.appendChild(d)}
var q=document.createElement("p");q.textContent=r.q;q.style.fontSize="1.1rem";root.appendChild(q);
var row=document.createElement("div");row.className="row";row.setAttribute("role","group");row.setAttribute("aria-label","Answers");root.appendChild(row);
var fb=document.createElement("p");fb.setAttribute("aria-live","polite");fb.className="small";root.appendChild(fb);var solved=false;
r.opts.forEach(function(o,k){var b=document.createElement("button");b.type="button";b.textContent=o;b.onclick=function(){if(solved)return;if(k===r.a){solved=true;b.setAttribute("aria-pressed","true");fb.innerHTML="<b>Yes!</b> "+r.why;var n=document.createElement("button");n.type="button";n.textContent=(i+1<cfg.rounds.length)?"Next card":"Finish";n.onclick=function(){i++;draw()};row.appendChild(n);n.focus()}else{b.disabled=true;fb.textContent="Not this one. Look again and try another."}};row.appendChild(b)});}
draw()})();</script>
<!--k5a-end id=${id}-->
`;
}
// rewritten Try-it cell body. parts: {guess, need, do, notice, why, safety, tip}
export function tryCell(o) {
  const p = (l, t) => (t ? `<p><b>${l}</b> ${t}</p>` : '');
  return p('Guess first:', o.guess) + p('What you need:', o.need) + p('Do:', o.do) + p('Look for:', o.notice) + p('What it shows:', o.why) + p('Safety:', o.safety) + (o.tip ? `<p class="tip">“${o.tip}”</p>` : '');
}
// ----- page patcher -----
export class Page {
  constructor(file) { this.file = join(root, 'k-5', file); this.h = readFileSync(this.file, 'utf8'); }
  strip(id) { this.h = this.h.replace(new RegExp(`<!--k5a-start id=${id}-->[\\s\\S]*?<!--k5a-end id=${id}-->\\n?`), ''); }
  find(sec, tag, nth = 1) {
    const ss = this.h.indexOf(`<section class="sec" id="${sec}"`);
    if (ss < 0) throw new Error(`${this.file}: no section ${sec}`);
    const se = this.h.indexOf('</section>', ss);
    let pos = ss, n = 0;
    for (;;) {
      const a = this.h.indexOf('<article class="aid', pos);
      if (a < 0 || a > se) throw new Error(`${this.file}: no ${tag}#${nth} in ${sec}`);
      const e = this.h.indexOf('</article>', a) + '</article>'.length;
      if (new RegExp(`<span class="tag ${tag}">`).test(this.h.slice(a, a + 160)) && ++n === nth) return { s: a, e };
      pos = e;
    }
  }
  addFig(sec, tag, nth, id, html) {
    this.strip(id);
    const { e } = this.find(sec, tag, nth);
    const close = e - '</article>'.length;
    this.h = this.h.slice(0, close) + html + this.h.slice(close);
  }
  setBody(sec, tag, nth, body) {
    const { s, e } = this.find(sec, tag, nth);
    const art = this.h.slice(s, e);
    const open = art.match(/^<article class="aid[^"]*">\s*<span class="tag [^"]*">[^<]*<\/span>/)[0];
    const figs = (art.match(/<!--k5a-start id=([\w-]+)-->[\s\S]*?<!--k5a-end id=\1-->\n?/g) || []).join('');
    this.h = this.h.slice(0, s) + open + '\n      ' + body + figs + '</article>' + this.h.slice(e);
  }
  save() { writeFileSync(this.file, this.h); }
}
