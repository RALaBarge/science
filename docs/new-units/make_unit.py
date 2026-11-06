"""Build a lesson page from a content spec, reusing the shell (CSS, style switch,
quiz/chart helpers) of 7th/unit-7.3. Usage: python make_unit.py spec_module
A spec is a Python module with a SPEC dict (see unit-*.py beside this file).
The 7.3 shell is read from the repo, so a change to the shell reaches new units
the next time this runs.  Output goes to SPEC['out']."""
import re, sys, os, importlib.util, html
ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
TPL = open(os.path.join(ROOT, '7th', 'unit-7.3-chemical-reactions-and-energy.html'), encoding='utf-8').read()

def aid(tag, title, body, wide=False):
    cls = 'aid wide' if wide else 'aid'
    label = {'analogy': 'Analogy', 'diagram': 'Diagram', 'try': 'Try it', 'data': 'Data', 'real': 'Real world'}[tag]
    return f'<article class="{cls}"><span class="tag {tag}">{label}</span><h3>{title}</h3>{body}</article>'

def table(head, rows, minw=None):
    st = f' style="min-width:{minw}px"' if minw else ''
    th = ''.join(f'<th>{h}</th>' for h in head)
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="tw"><table class="tbl"{st}><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table></div>'

def section(n, kicker, h2, idea, aids):
    return (f'<section class="sec" id="s{n}"><div><p class="kicker">Concept {n} · {kicker}</p><h2>{h2}</h2></div>'
            f'<p class="idea">{idea}</p><div class="aids">{"".join(aids)}</div></section>')

def build(S):
    head, rest = TPL.split('<header class="hero">', 1)
    head = re.sub(r'<title>.*?</title>', f'<title>{S["title_tag"]}</title>', head, count=1, flags=re.S)
    switch = re.search(r'<div class="styleswitch".*?</div>', rest, re.S).group(0)
    toc = ''.join(f'<li><a href="#s{i+1}">{c["toc"]}</a></li>' for i, c in enumerate(S['concepts']))
    toc += '<li><a href="#s%d">Check yourself</a></li>' % (len(S['concepts']) + 1)
    hero = (f'<header class="hero">\n  {switch}\n  <p class="kicker">{S["kicker"]}</p>\n  <h1>{S["h1"]}</h1>\n'
            f'  <p class="lede">{S["lede"]}</p>\n  <p class="bridge"><b>Where we left off:</b> {S["bridge"]}</p>\n'
            f'  <nav class="toc" aria-label="In this unit"><h2>In this unit</h2><ol>{toc}</ol></nav>\n'
            f'  <div class="hero-art">{S["hero_svg"]}</div>\n</header>\n\n')
    secs = '\n'.join(section(i + 1, c['kicker'], c['h2'], c['idea'], c['aids']) for i, c in enumerate(S['concepts']))
    n = len(S['concepts']) + 1
    gloss = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in S['glossary'])
    check = (f'<section class="sec" id="s{n}">\n  <div><p class="kicker">Check yourself</p><h2>Can you explain it?</h2></div>\n'
             f'  <p class="idea">{S["explain_q"]}</p>\n  <details><summary>Show a model answer</summary><div class="in"><p>{S["explain_a"]}</p></div></details>\n'
             f'  <div class="items" id="quiz"></div>\n  <p class="score" id="quizScore">0 of {len(S["quiz"])} correct</p>\n'
             f'  <h3 style="margin-top:8px">Words to know</h3>\n  <dl class="glossary">{gloss}</dl>\n'
             f'  <details><summary>Tutor notes: hands-on kit, misconceptions, pacing</summary><div class="in">{S["tutor"]}</div></details>\n</section>\n\n')
    rel = ''.join(f'<li><a href="{h}">{t}</a><span class="why">{w}</span></li>' for h, t, w in S['related'])
    related = (f'<section class="sec related" id="more"><div><p class="kicker">Keep exploring</p><h2>Related lessons</h2></div>'
               f'<p class="idea">{S["related_idea"]}</p><ul>{rel}</ul></section>\n</main>\n\n<footer>{S["footer"]}</footer>\n\n')
    # script helpers: from the opening <script> after </footer> to the first safe(()=>{
    after = rest.split('</footer>', 1)[1]
    helpers = after[:after.index('safe(()=>{')]
    import json
    quiz = 'finalQuiz(' + json.dumps(S['quiz'], ensure_ascii=False) + ');'
    js = '\n'.join(f'safe(()=>{{\n{b}\n}});' for b in S['js'])
    page = head + hero + '<main>\n' + secs + '\n\n' + check + related + helpers + js + '\n\n' + quiz + '\n})();\n</script>\n</body>\n</html>\n'
    return page

if __name__ == '__main__':
    path = os.path.abspath(sys.argv[1])
    spec = importlib.util.spec_from_file_location('spec', path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    S = m.SPEC
    out = os.path.join(ROOT, S['out'])
    open(out, 'w', encoding='utf-8', newline='\n').write(build(S))
    print('wrote', S['out'], os.path.getsize(out))
