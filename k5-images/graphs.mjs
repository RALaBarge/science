// Draws the data graphs for the K-5 lessons as inline SVG, straight from the numbers each page gives.
// Nothing here is drawn by an image model: change a number and the bar moves.
// Colors are the lesson pages' own CSS variables, so the graphs follow light and dark themes.
// Used by make-figures.mjs, which writes k5-images/svg/<id>.svg.

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const W = 480;
const FONT = 'font-family="var(--font-body, system-ui, sans-serif)"';
const INK = 'var(--ink, #12172B)';
const MUTED = 'var(--muted, #47506E)';
const LINE = 'var(--line, #D0D8E8)';
const SURF = 'var(--surface, #fff)';
export const C = {
  a: 'var(--reflect, #2B66E8)',
  b: 'var(--absorb, #D6450B)',
  c: 'var(--transmit, #0B7F70)',
  d: 'var(--beam, #F2A900)',
};
// Pattern fills so color is never the only cue (second series gets stripes).
const DEFS = `<defs><pattern id="P_ID" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="COLOR"/><rect width="2.5" height="6" fill="rgba(255,255,255,.45)"/></pattern></defs>`;

export function wrap(id, title, desc, h, body, extraDefs = '') {
  return `<svg class="k5i-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" ${FONT}>` +
    `<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>${extraDefs}` +
    `<rect x="0" y="0" width="${W}" height="${h}" fill="${SURF}"/>` +
    `<text x="${W / 2}" y="28" text-anchor="middle" font-size="17" font-weight="700" fill="${INK}">${esc(title)}</text>` +
    body + `</svg>`;
}

const fmt = (v) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100));

// Wrap an axis label onto several lines at a word boundary.
function lines(s, n) {
  const words = String(s).split(' ');
  const out = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur);
  return out;
}

// Grouped (or single-series) vertical bar chart.
// opts: id, title, ylabel, cats[], series[{name, values[], color}], max, step, unit, h, note, altValues(cats->text)
export function bars(o) {
  const n = o.cats.length, k = o.series.length;
  const h = o.h || 330;
  const left = 54, right = 16, top = 62, bottom = 62 + (o.series.length > 1 ? 18 : 0);
  const pw = W - left - right, ph = h - top - bottom;
  const max = o.max, step = o.step;
  const y = (v) => top + ph - (v / max) * ph;
  let s = '';
  for (let t = 0; t <= max + 1e-9; t += step) {
    s += `<line x1="${left}" x2="${W - right}" y1="${y(t)}" y2="${y(t)}" stroke="${LINE}" stroke-width="1"/>` +
      `<text x="${left - 8}" y="${y(t) + 5}" text-anchor="end" font-size="13" fill="${MUTED}">${fmt(t)}</text>`;
  }
  s += `<text transform="translate(14 ${top + ph / 2}) rotate(-90)" text-anchor="middle" font-size="13" fill="${MUTED}">${esc(o.ylabel)}</text>`;
  const gw = pw / n;
  const bw = Math.min(54, (gw * 0.78) / k);
  let defs = '';
  o.series.forEach((se, j) => {
    if (j === 1 || o.series.length > 1 && j > 0) {
      const pid = `${o.id}-p${j}`;
      defs += DEFS.replace(/P_ID/g, pid).replace('COLOR', se.color);
      se.fill = `url(#${pid})`;
    } else se.fill = se.color;
  });
  const centered = k > 1 && o.cats.every((_, i) => o.series.filter((se) => se.values[i] != null).length <= 1);
  o.cats.forEach((c, i) => {
    const gx = left + i * gw + (gw - bw * (centered ? 1 : k)) / 2;
    o.series.forEach((se, j) => {
      const v = se.values[i];
      if (v == null) return;
      const bx = gx + (centered ? 0 : j) * bw;
      const hollow = se.hollow && se.hollow[i];
      s += `<rect x="${bx + 1}" y="${y(v)}" width="${bw - 2}" height="${Math.max(0, y(0) - y(v))}" rx="3" fill="${hollow ? 'none' : se.fill}" ${hollow ? `stroke="${se.color}" stroke-width="2" stroke-dasharray="5 4"` : ''}/>`;
      s += `<text x="${bx + bw / 2}" y="${y(v) - 6}" text-anchor="middle" font-size="${n > 8 ? 12 : 14}" font-weight="700" fill="${INK}">${fmt(v)}${o.valueSuffix || ''}</text>`;
    });
    const cx = left + i * gw + gw / 2;
    lines(c, n > 8 ? 4 : gw > 90 ? 16 : 11).forEach((ln, li) => {
      s += `<text x="${cx}" y="${top + ph + 20 + li * 15}" text-anchor="middle" font-size="${n > 8 ? 12 : 13.5}" fill="${INK}">${esc(ln)}</text>`;
    });
  });
  s += `<line x1="${left}" x2="${W - right}" y1="${y(0)}" y2="${y(0)}" stroke="${INK}" stroke-width="1.5"/>`;
  if (k > 1) {
    let lx = left;
    const ly = h - 14;
    o.series.forEach((se) => {
      s += `<rect x="${lx}" y="${ly - 11}" width="14" height="14" rx="3" fill="${se.fill}"/>` +
        `<text x="${lx + 20}" y="${ly + 1}" font-size="13" fill="${INK}">${esc(se.name)}</text>`;
      lx += 36 + se.name.length * 7.2;
    });
  }
  if (o.note) s += `<text x="${W / 2}" y="${top - 12}" text-anchor="middle" font-size="12.5" fill="${MUTED}">${esc(o.note)}</text>`;
  const desc = o.alt;
  return wrap(o.id, o.title, desc, h, s, defs);
}

// Line chart with points. opts: id,title,xlabel,ylabel,xs[],series[{name,ys[],color,hollowLast}], ymin,ymax,ystep
export function line(o) {
  const h = o.h || 320;
  const left = 56, right = 20, top = 62, bottom = 62;
  const pw = W - left - right, ph = h - top - bottom;
  const xmax = Math.max(...o.xs), xmin = Math.min(...o.xs);
  const x = (v) => left + ((v - xmin) / (xmax - xmin)) * pw;
  const y = (v) => top + ph - ((v - o.ymin) / (o.ymax - o.ymin)) * ph;
  let s = '';
  for (let t = o.ymin; t <= o.ymax + 1e-9; t += o.ystep) {
    s += `<line x1="${left}" x2="${W - right}" y1="${y(t)}" y2="${y(t)}" stroke="${LINE}"/>` +
      `<text x="${left - 8}" y="${y(t) + 5}" text-anchor="end" font-size="13" fill="${MUTED}">${fmt(t)}</text>`;
  }
  o.xs.forEach((v, i) => { s += `<text x="${x(v)}" y="${top + ph + 20}" text-anchor="middle" font-size="13" fill="${INK}">${esc(o.xlabels ? o.xlabels[i] : v)}</text>`; });
  s += `<text x="${left + pw / 2}" y="${h - 14}" text-anchor="middle" font-size="13" fill="${MUTED}">${esc(o.xlabel)}</text>`;
  s += `<text transform="translate(14 ${top + ph / 2}) rotate(-90)" text-anchor="middle" font-size="13" fill="${MUTED}">${esc(o.ylabel)}</text>`;
  s += `<line x1="${left}" x2="${W - right}" y1="${y(o.ymin)}" y2="${y(o.ymin)}" stroke="${INK}" stroke-width="1.5"/>`;
  o.series.forEach((se) => {
    const pts = se.ys.map((v, i) => [x(o.xs[i]), y(v)]);
    const solid = se.hollowLast ? pts.slice(0, -1) : pts;
    s += `<polyline fill="none" stroke="${se.color}" stroke-width="3" points="${solid.map((p) => p.join(',')).join(' ')}"/>`;
    if (se.hollowLast) {
      const a = pts[pts.length - 2], b = pts[pts.length - 1];
      s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${se.color}" stroke-width="3" stroke-dasharray="6 5"/>`;
    }
    pts.forEach((p, i) => {
      const hollow = se.hollowLast && i === pts.length - 1;
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${hollow ? SURF : se.color}" stroke="${se.color}" stroke-width="3"/>` +
        `<text x="${hollow ? p[0] + 8 : p[0]}" y="${p[1] - 12}" text-anchor="${hollow ? 'end' : 'middle'}" font-size="13" font-weight="700" fill="${INK}">${fmt(se.ys[i])}${hollow ? ' (prediction)' : ''}</text>`;
    });
  });
  if (o.note) s += `<text x="${W / 2}" y="${top - 12}" text-anchor="middle" font-size="12.5" fill="${MUTED}">${esc(o.note)}</text>`;
  return wrap(o.id, o.title, o.alt, h, s);
}

// Grid of squares: rows of `per` squares. groups[{name,count,color}] fills in order. total squares = sum(count) unless total given.
export function squares(o) {
  const per = o.per || 10;
  const cell = 24, gap = 3;
  const gridW = per * (cell + gap) - gap;
  const rowsN = Math.ceil(o.total / per);
  const h = 50 + rowsN * (cell + gap) + 12 + (o.groups.length + (o.dotLast ? 1 : 0)) * 22 + 14;
  const x0 = (W - gridW) / 2;
  let s = '';
  let idx = 0;
  const marks = [];
  o.groups.forEach((g, gi) => {
    for (let c = 0; c < g.count; c++) { marks.push(gi); }
  });
  for (let i = 0; i < o.total; i++) {
    const g = o.groups[marks[i]];
    const col = i % per, row = Math.floor(i / per);
    s += `<rect x="${x0 + col * (cell + gap)}" y="${50 + row * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="${g ? g.color : 'none'}" stroke="${g ? 'none' : LINE}"/>`;
    idx++;
  }
  if (o.dotLast) {
    const i = o.total - 1;
    s += `<circle cx="${x0 + (i % per) * (cell + gap) + cell / 2}" cy="${50 + Math.floor(i / per) * (cell + gap) + cell / 2}" r="4" fill="${o.dotLast.color}" stroke="${INK}" stroke-width="1.5"/>`;
  }
  let ly = 50 + rowsN * (cell + gap) + 22;
  const groups = o.dotLast ? [...o.groups, { name: o.dotLast.name, color: o.dotLast.color, swatch: o.dotLast.color, outline: true }] : o.groups;
  groups.forEach((g) => {
    s += `<rect x="${x0}" y="${ly - 13}" width="16" height="16" rx="3" fill="${g.swatch || g.color}" ${g.outline ? `stroke="${INK}"` : ''}/>` +
      `<text x="${x0 + 24}" y="${ly}" font-size="14" fill="${INK}">${esc(g.name)}</text>`;
    ly += 22;
  });
  return wrap(o.id, o.title, o.alt, h, s);
}

// Table drawn as dots: rows x cols of text results with colored dots (yes/no style).
// opts: id,title,cols[],rows[{label,cells[{v,t}]}], palette {v: color}
export function dots(o) {
  const rowH = 44;
  const left = 150;
  const colW = (W - left - 16) / o.cols.length;
  const h = 74 + o.rows.length * rowH + 20;
  let s = '';
  o.cols.forEach((c, i) => { s += `<text x="${left + i * colW + colW / 2}" y="62" text-anchor="middle" font-size="13.5" font-weight="700" fill="${INK}">${esc(c)}</text>`; });
  o.rows.forEach((r, ri) => {
    const y = 74 + ri * rowH;
    s += `<line x1="12" x2="${W - 12}" y1="${y}" y2="${y}" stroke="${LINE}"/>`;
    s += `<text x="18" y="${y + 27}" font-size="14" fill="${INK}">${esc(r.label)}</text>`;
    r.cells.forEach((c, ci) => {
      const cx = left + ci * colW + colW / 2;
      const col = o.palette[c.v];
      s += `<circle cx="${cx}" cy="${y + 22}" r="16" fill="${col.fill}" stroke="${col.stroke || col.fill}" stroke-width="2"/>`;
      s += `<text x="${cx}" y="${y + 27}" text-anchor="middle" font-size="11.5" font-weight="700" fill="${col.text}">${esc(c.t)}</text>`;
    });
  });
  return wrap(o.id, o.title, o.alt, h, s);
}
