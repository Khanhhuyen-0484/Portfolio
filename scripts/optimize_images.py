"""Generate smaller WebP assets and update local HTML image references."""
import re
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
mapping = {}
saved = 0
for page in root.glob('*.html'):
    source = page.read_text(encoding='utf-8')
    for asset in re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', source):
        if asset in mapping or not asset.startswith('assets/images/'):
            continue
        original = root / asset
        if not original.exists() or original.suffix.lower() not in ('.png', '.jpg', '.jpeg'):
            continue
        target = original.with_suffix('.webp')
        with Image.open(original) as image:
            if image.width > 1600:
                image = image.resize((1600, round(image.height * 1600 / image.width)), Image.Resampling.LANCZOS)
            image.save(target, 'WEBP', quality=85, method=6)
        if target.stat().st_size < original.stat().st_size:
            mapping[asset] = target.relative_to(root).as_posix()
            saved += original.stat().st_size - target.stat().st_size

for page in root.glob('*.html'):
    source = page.read_text(encoding='utf-8')
    def update(match):
        tag = match.group(0)
        src = re.search(r'\bsrc="([^"]+)"', tag)
        if src and src.group(1) in mapping:
            tag = tag.replace(src.group(0), 'src="' + mapping[src.group(1)] + '"')
        if 'decoding=' not in tag:
            tag = tag[:-1] + ' decoding="async">'
        return tag
    result = re.sub(r'<img\b[^>]*>', update, source)
    if result != source:
        page.write_text(result, encoding='utf-8')
print(f'Optimized {len(mapping)} images; saved {saved / 1024 / 1024:.2f} MB across unique assets.')
