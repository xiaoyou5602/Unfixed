#!/usr/bin/env python3
"""Snapshot the published static Unfixed site for an independent GitHub Pages backup.

Mirrors only same-origin assets explicitly referenced by the HTML/CSS. The original
illustration bundle is included in the *Pages artifact*, never committed to the
public source repository. If any required asset is unavailable, fail the job so
GitHub Pages keeps serving the previously deployed healthy snapshot.
"""

import argparse
import hashlib
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import Request, urlopen

CSS_URL = re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", re.I)
CSS_IMPORT = re.compile(r"@import\s+(?:url\(\s*)?['\"]([^'\"\)]+)", re.I)
STATS = re.compile(r'(<meta\s+name=["\']stats["\']\s+content=["\'])[^"\']*(["\'])', re.I)
MAX_FILE_BYTES = 30 * 1024 * 1024


class Requisites(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        info = dict(attrs)
        if tag in ('script', 'img', 'source') and info.get('src'):
            self.urls.append(info['src'])
        if tag == 'link' and info.get('href'):
            rel = (info.get('rel') or '').lower().split()
            if any(r in rel for r in ('stylesheet', 'icon', 'manifest', 'preload', 'modulepreload')):
                self.urls.append(info['href'])


def snapshot(origin, output):
    root = urlsplit(origin)
    if root.scheme != 'https' or not root.netloc or root.path not in ('', '/'):
        raise ValueError('Origin must be a root HTTPS URL')
    origin = f'{root.scheme}://{root.netloc}/'
    output.mkdir(parents=True, exist_ok=True)
    seen = set()
    pending = {origin}
    sha = hashlib.sha256()

    def identify(target, ref=origin):
        absolute = urljoin(ref, target)
        parsed = urlsplit(absolute)
        if parsed.scheme != 'https' or parsed.netloc != root.netloc:
            return None
        if not parsed.path.startswith('/'):
            raise ValueError(f'Not a root path: {absolute}')
        path = unquote(parsed.path).lstrip('/') or 'index.html'
        if '\\' in path or any(bit in ('.', '..', '') for bit in PurePosixPath(path).parts):
            raise ValueError(f'Unsafe asset path: {absolute}')
        return absolute, path

    def fetch(url):
        request = Request(url, headers={'User-Agent': 'Unfixed-Pages-Snapshot/1.0', 'Cache-Control': 'no-cache'})
        with urlopen(request, timeout=30) as response:
            size = response.headers.get('Content-Length')
            if size and int(size) > MAX_FILE_BYTES:
                raise ValueError(f'Asset too large: {url}')
            content = response.read(MAX_FILE_BYTES + 1)
            content_type = response.headers.get_content_type()
        if len(content) > MAX_FILE_BYTES or not content:
            raise ValueError(f'Empty or oversized asset: {url}')
        extension = urlsplit(url).path.lower()
        if any(extension.endswith(ext) for ext in ('.js', '.css', '.svg', '.woff', '.woff2', '.json')):
            if content_type == 'text/html' or content.lstrip().lower().startswith(b'<!doctype html'):
                raise ValueError(f'Server returned an HTML fallback instead of an asset: {url}')
        return url, content

    while pending:
        batch = sorted(pending - seen)
        pending.clear()
        if not batch:
            break
        with ThreadPoolExecutor(max_workers=16) as pool:
            results = [pool.submit(fetch, url) for url in batch]
            for future in as_completed(results):
                url, content = future.result()
                identified = identify(url)
                assert identified is not None
                _, path = identified
                file = output / path
                file.parent.mkdir(parents=True, exist_ok=True)
                if path == 'index.html':
                    html = content.decode('utf-8')
                    if 'assets/questions.js' not in html or 'assets/scoring.js' not in html:
                        raise ValueError('The live page does not look like the Unfixed questionnaire')
                    # GitHub Pages is static: do not send statistics to its nonexistent /api/event.
                    html, n = STATS.subn(r'\1\2', html, count=1)
                    if n != 1:
                        raise ValueError('Could not safely turn off the Cloudflare-only statistics endpoint')
                    content = html.encode('utf-8')
                    parser = Requisites()
                    parser.feed(html)
                    references = parser.urls
                elif path.endswith('.css'):
                    css = content.decode('utf-8')
                    references = CSS_URL.findall(css) + CSS_IMPORT.findall(css)
                else:
                    references = []
                file.write_bytes(content)
                sha.update(path.encode('utf-8') + b'\0' + hashlib.sha256(content).digest())
                for ref in references:
                    if ref.startswith(('data:', '#', 'blob:')):
                        continue
                    asset = identify(ref, url)
                    if asset and asset[0] not in seen:
                        pending.add(asset[0])
        seen.update(batch)

    essentials = ['index.html', 'assets/fragments.js', 'assets/questions.js',
                  'assets/scoring.js', 'assets/lexicon.js', 'paper.css', 'js/questionnaire.js']
    for asset in essentials:
        file = output / asset
        if not file.is_file():
            raise ValueError(f'Required asset missing from backup: {asset}')
    (output / '.nojekyll').write_text('', encoding='utf-8')
    print(f'Valid Pages snapshot: {len(seen)} files, digest {sha.hexdigest()[:12]}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin', default='https://unfixed.lumenw.withtoge.us/')
    parser.add_argument('--output', type=Path, default=Path('_site'))
    args = parser.parse_args()
    snapshot(args.origin, args.output)
