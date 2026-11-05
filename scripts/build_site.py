#!/usr/bin/env python3
"""Build the static profile, timeline and articles using the Python standard library."""
from pathlib import Path
from html import escape
from urllib.parse import urlencode
import json

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'content/experience.json').read_text())
ARTICLES = {a['id']: a for a in DATA['articles']}
CATEGORIES = {'project':'案件', 'career':'職歴', 'education':'学歴', 'award':'個人開発・受賞'}
ARROW = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
PLUS = '<svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>'
e = escape

def date_label(date):
    parts = date.split('-')
    return parts[0] + '年' + (str(int(parts[1])) + '月' if len(parts)>1 else '')

def tags(article, prefix='', interactive=True):
    return '<div class="tech-tags" aria-label="技術・スキル">' + ''.join(
        f'<a class="tech-tag" {"data-tag="+chr(34)+e(tag)+chr(34) if interactive else ""} href="{prefix}?{e(urlencode({"view":"timeline","tag":tag}))}#work">{e(tag)}</a>'
        for tag in article['tags']) + '</div>'

def figure(article,prefix=''):
    if 'image' not in article: return ''
    image=DATA['images'][article['image']]
    license_link=f' · <a href="{e(image["license"])}">ライセンス</a>' if image.get('license') else ''
    note=f' · {e(image["note"])}' if image.get('note') else ''
    return f'''<figure class="article-figure {image.get('class','')}">
<img src="{prefix}{e(image['src'])}" alt="{e(image['alt'])}" width="{image['width']}" height="{image['height']}" loading="lazy" decoding="async">
<figcaption>{e(image['caption'])}<br><a href="{e(image['url'])}">{e(image['credit'])}</a>{license_link}{note}</figcaption></figure>'''

def body(article,prefix='',level=2):
    sections=''.join(f'<section><h{level}>{e(s["heading"])}</h{level}>'+''.join(f'<p>{e(p)}</p>' for p in s['paragraphs'])+'</section>' for s in article['sections'])
    sources=''
    if article['sources']:
        sources=f'<section class="article-sources"><h{level}>参考・出典</h{level}><ul>'+''.join(f'<li><a href="{e(s["url"])}">{e(s["label"])}</a></li>' for s in article['sources'])+'</ul></section>'
    return figure(article,prefix)+sections+sources

def project_card(a):
    return f'''<article class="project" data-project="{a['id']}">
<div class="project-heading"><p class="period">{e(a['period'])}</p><h3><a href="articles/{a['id']}/">{e(a['title'])}</a></h3></div>
<div class="project-content"><p>{e(a['summary'])}</p>
<details class="project-details"><summary><span>取り組み・実績</span>{PLUS}</summary><div class="detail-body">{''.join('<p>'+e(p)+'</p>' for p in a['details'])}<a class="text-link" href="articles/{a['id']}/">背景・担当業務を詳しく読む {ARROW}</a></div></details>
{tags(a)}</div></article>'''

def event_row(item):
    a=ARTICLES[item['article']]
    return f'''<li class="chronology-event" data-event="{item['id']}" data-date="{item['date']}">
<a class="event-link" href="articles/{a['id']}/" data-article="{a['id']}">
<div class="event-meta"><time datetime="{item['date']}">{date_label(item['date'])}</time><span>{CATEGORIES[item['category']]}</span></div>
<div class="event-title"><h4>{e(item['title'])}</h4>{ARROW}</div><p>{e(item['summary'])}</p></a>
{tags(a)}</li>'''

all_tags=list(dict.fromkeys(t for a in DATA['articles'] for t in a['tags']))
years=sorted({x['date'][:4] for x in DATA['events']},reverse=True)
filter_tags=''.join(f'<button class="tech-tag" type="button" data-tag="{e(t)}" aria-pressed="false">{e(t)}</button>' for t in all_tags)
chronology=''
for year in years:
    items=sorted((v for v in DATA['events'] if v['date'].startswith(year)),key=lambda v:v['date'],reverse=True)
    chronology+=f'<section class="chronology-year" data-year="{year}" aria-labelledby="year-{year}"><h3 id="year-{year}">{year}</h3><ol>'+''.join(event_row(v) for v in items)+'</ol></section>'
preview_templates=''.join(f'<template id="preview-{a["id"]}"><article class="reading-article"><h3>{e(a["title"])}</h3><p class="article-period">{e(a["period"])}</p><p class="article-deck">{e(a["summary"])}</p><a class="text-link" href="articles/{a["id"]}/">記事を開く {ARROW}</a>{body(a,level=4)}</article></template>' for a in DATA['articles'])
index_data=json.dumps({'articles':[{k:a[k] for k in ('id','category','start','tags')} for a in DATA['articles']], 'events':DATA['events'],'tags':all_tags,'years':years},ensure_ascii=False).replace('<','\\u003c')
explorer=f'''<section class="work-section wrap" id="work" aria-labelledby="work-title">
<div class="section-heading"><h2 id="work-title">仕事・経歴</h2><p class="section-caption">仕事、学び、個人開発の歩み</p></div>
<div class="explorer-controls" data-explorer-controls hidden>
<div class="explorer-toolbar"><div class="view-switch" role="group" aria-label="表示の切り替え"><button type="button" data-view="projects" aria-pressed="true" aria-controls="project-view">仕事一覧</button><button type="button" data-view="timeline" aria-pressed="false" aria-controls="timeline-view">時系列</button></div>
<div class="select-filters"><label data-category-control hidden>分類<select id="category-filter"><option value="all">すべて</option>{''.join(f'<option value="{k}">{v}</option>' for k,v in CATEGORIES.items())}</select></label>
<label>年<select id="year-filter"><option value="all">すべての年</option>{''.join(f'<option>{y}</option>' for y in years)}</select></label><label data-sort-control hidden>並び順<select id="sort-filter"><option value="desc">新しい順</option><option value="asc">古い順</option></select></label></div></div>
<details class="tag-filter"><summary>技術・スキルで絞り込む {PLUS}</summary><p class="filter-help">複数選択すると、どれかを使った項目を表示します。年は案件の開始年、または出来事の年です。</p><div class="filter-options">{filter_tags}</div></details>
<div class="filter-feedback"><p id="result-count" role="status" aria-live="polite" aria-atomic="true">仕事一覧 · 5件</p><button type="button" class="reset-filters" data-reset hidden>絞り込みを解除</button></div><div class="selected-tags" aria-label="選択中の技術" data-selected-tags></div>
</div>
<div id="project-view" class="projects">{''.join(project_card(a) for a in DATA['articles'] if a['category']=='project')}</div>
<div id="timeline-view" class="chronology-layout"><div class="chronology-list"><h3 class="no-js-title">経歴・職歴の時系列</h3>{chronology}</div>
<aside class="reading-preview" aria-label="経歴・職歴の詳細プレビュー" tabindex="0" hidden><div class="preview-toolbar"><p>項目にカーソルを重ねると詳細を表示</p><button type="button" data-preview-close aria-label="詳細プレビューを閉じる">閉じる</button></div><div data-preview-content></div></aside></div>
<div class="empty-results" data-empty hidden><h3>条件に合う項目がありません</h3><p>技術・分類・年の組み合わせを変えるか、絞り込みを解除してください。</p><button type="button" class="reset-filters" data-reset>絞り込みを解除</button></div>
<noscript><p class="filter-help">技術による絞り込みはJavaScriptを有効にすると使えます。各項目から詳しい記事を読めます。</p></noscript>
{preview_templates}<script type="application/json" id="experience-data">{index_data}</script></section>
'''
template=(ROOT/'src/index.template.html').read_text()
assert template.count('<!-- EXPERIENCE_EXPLORER -->')==1
(ROOT/'docs/index.html').write_text(template.replace('<!-- EXPERIENCE_EXPLORER -->',explorer))
for a in DATA['articles']:
    related=[x for x in DATA['articles'] if x['id']!=a['id'] and (x['category']==a['category'] or set(x['tags'])&set(a['tags']))][:3]
    related_html='<nav class="related-articles" aria-label="関連する記事"><h2>関連する記事</h2>'+''.join(f'<a href="../{x["id"]}/">{e(x["title"])}{ARROW}</a>' for x in related)+'</nav>' if related else ''
    doc=f'''<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="{e(a['summary'])}"><title>{e(a['title'])} | 西村 惟</title><link rel="stylesheet" href="../../style.css"><link rel="canonical" href="https://yuidvg.github.io/yuidvg/articles/{a['id']}/"></head>
<body id="top"><a class="skip-link" href="#main">本文へ移動</a><header class="masthead"><a class="wordmark" href="../../">YUI NISHIMURA</a><nav aria-label="ページ内の案内"><a class="header-contact" href="../../#contact">連絡先 {ARROW}</a></nav></header>
<main id="main" class="article-page wrap"><a class="article-back text-link" href="../../?view=timeline#work">仕事・経歴の一覧へ {ARROW}</a><article><header class="article-header"><h1>{e(a['title'])}</h1><p class="article-period">{e(a['period'])}</p><p class="article-deck">{e(a['summary'])}</p>{tags(a,'../../',False)}</header><div class="article-body">{body(a,'../../')}</div></article>{related_html}</main>
<footer class="site-footer article-footer"><div class="footer-inner"><p class="footer-name">Yui Nishimura</p><div class="footer-meta"><a href="../../?view=timeline#work">仕事・経歴へ戻る {ARROW}</a><p>2026年11月5日更新</p></div></div></footer></body></html>'''
    dest=ROOT/'docs/articles'/a['id'];dest.mkdir(parents=True,exist_ok=True);(dest/'index.html').write_text(doc)
print(f'Built profile, {len(DATA["events"])} events and {len(ARTICLES)} articles.')
