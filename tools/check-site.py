"""Check local website dependencies, links and fragment targets before publishing."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.refs = []
        self.ids = set()
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if not value:
                continue
            if key == 'id':
                self.ids.add(value)
            if key in ('src', 'href', 'poster', 'xlink:href'):
                self.refs.append(value)
            if key == 'srcset' and not value.startswith('data:'):
                self.refs.extend(item.strip().split()[0] for item in value.split(',') if item.strip())


def references(path):
    text = path.read_text()
    refs = Page(text).refs if path.suffix in ('.html', '.svg') else []
    refs += re.findall(r'''url\(\s*["']?([^\s)'";]+)''', text)
    if path.suffix in ('.js', '.json'):
        refs += re.findall(r'''["']([^"'\s]+\.(?:png|jpe?g|gif|webp|svg|mp4|webm|woff2?|ttf|json|html|css|js|pdf)(?:\?[^"'\s]*)?)["']''', text)
    return refs


def resolve(path, ref):
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        return None, ''
    target = ((ROOT if url.path.startswith('/') else path.parent) / unquote(url.path).lstrip('/')).resolve() if url.path else path
    if target.is_dir():
        target /= 'index.html'
    return target, unquote(url.fragment)


def check():
    errors = []
    count = 0
    for path in ROOT.rglob('*'):
        if '.git' in path.parts or path.suffix not in ('.html', '.css', '.js', '.svg'):
            continue
        for ref in references(path):
            target, fragment = resolve(path, ref)
            if target is None:
                continue
            count += 1
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append(f'{path.relative_to(ROOT)}: missing {ref}')
            elif fragment and target.suffix in ('.html', '.svg'):
                if fragment not in Page(target.read_text()).ids:
                    errors.append(f'{path.relative_to(ROOT)}: missing fragment {ref}')
    print(f'Checked {count} local references; {len(errors)} errors.')
    for error in errors:
        print(error)
    return bool(errors)


if __name__ == '__main__':
    sys.exit(check())
