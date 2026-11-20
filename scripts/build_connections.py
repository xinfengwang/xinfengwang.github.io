"""Rebuild actual article backlinks and explained related reads; no dependencies."""
from pathlib import Path
import hashlib, json, re
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
posts = []
for file in sorted((ROOT / '_posts').glob('*.md')):
    text = file.read_text(encoding='utf-8')
    _, front, body = text.split('---', 2)
    def value(key):
        match = re.search(r'^' + re.escape(key) + r':\s*(.*?)\s*$', front, re.M)
        return match.group(1).strip().strip('"\'') if match else ''
    year, month, day, slug = file.stem.split('-', 3)
    tags = [tag.strip().strip('"\'') for tag in value('tags').strip('[]').split(',') if tag.strip()]
    series = value('series_key')
    if value('engineering_series'):
        series = f"{value('engineering_topic')}/{value('engineering_series')}"
    posts.append(dict(url=value('permalink') or f'/{year}/{month}/{day}/{slug}/', title=value('title'), series=series, tags=tags, body=body, digest=hashlib.sha256(text.encode()).hexdigest()))
known = {post['url']: post for post in posts}
for post in posts:
    body = re.sub(r'(?m)^```[^\n]*\n[\s\S]*?^```\s*$', '', post['body'])
    body = re.sub(r'\{\{\s*[\'"]([^\'"]+)[\'"]\s*\|\s*(?:relative_url|absolute_url)\s*\}\}', r'\1', body)
    links = re.findall(r'(?<!!)\[[^\]]*\]\(\s*([^\s)]+)', body) + re.findall(r'<a\b[^>]*href=[\'"]([^\'"]+)', body)
    targets = set()
    for link in links:
        parsed = urlparse(link)
        if parsed.netloc and parsed.netloc != 'xinfengwang.github.io':
            continue
        target = unquote(parsed.path)
        if target in known and target != post['url']:
            targets.add(target)
    post['targets'] = targets
output = {}
generic = {'Agent', 'AI', 'Engineering', 'Project', 'Agent Engineering'}
for post in posts:
    backlinks = [other for other in posts if post['url'] in other['targets']]
    ranked = []
    for other in posts:
        if other is post:
            continue
        shared = sorted((set(post['tags']) & set(other['tags'])) - generic)
        outbound = other['url'] in post['targets']
        inbound = post['url'] in other['targets']
        same = bool(post['series']) and post['series'] == other['series']
        score = 8 * outbound + 6 * inbound + 3 * len(shared) + 2 * same
        if not score:
            continue
        reason = '本文引用的延伸阅读' if outbound else '这篇文章引用了本文' if inbound else '共同主题：' + '、'.join(shared[:2]) if shared else '同一系列，继续补齐相关概念'
        ranked.append((score, other['url'], dict(url=other['url'], title=other['title'], reason=reason)))
    ranked.sort(key=lambda item: (-item[0], item[1]))
    output[post['url']] = dict(source_sha256=post['digest'], related=[item[2] for item in ranked[:3]], backlinks=[dict(url=item['url'], title=item['title']) for item in backlinks])
(ROOT / '_data/connections.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Connected {len(posts)} articles; {sum(len(post["targets"]) for post in posts)} actual article links.')
