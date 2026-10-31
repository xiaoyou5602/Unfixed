"""把素材图片加工成样张用的碎片图集。

每张图缩小后按孔版印刷的思路拆成两版墨：
- 深蓝版：图里的暗部（1 - RGB 最大值）
- 专色版：红色或蓝色的部分，按色相和饱和度挑出来

两版各是一张灰度图（白 = 有墨，黑 = 无墨），上下拼成一张 JPEG，
连同每张图的位置、取景范围、专色写进 web/assets/fragments.js。
页面用 <script> 读它，所以直接双击打开 html 也能用。

用法：
    python web/tools/build_fragments.py <素材目录> [--preview 预览图路径]
"""
import argparse
import base64
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

CELL = 384
COLS, ROWS = 4, 4  # 素材之后的格子留给页面运行时画的图和字

# k: 深蓝版的色阶 (低点, 高点, gamma, 最深)；focus: 取景时优先落在的区域（0~1）
# anchor: 图里红线伸出画面的位置和方向，页面上的红线可以从这里接出去
# texture: 不当碎片，铺满屏幕当网点的底纹
ITEMS = [
    dict(name='wave', file='波浪形.jpg', spot=None, k=(0.0, 1.0, 1.0, 0.92), focus=(0, 0, 1, 1), texture=True),
    dict(name='face', file='看不清表情的胶片人脸.jpg', spot=None, k=(0.15, 1.0, 1.5, 0.86), focus=(0.18, 0.0, 0.95, 0.9)),
    dict(name='stain', file='蓝色如水渍般洇开.png', spot='blue', k=(0.1, 1.0, 1.2, 0.55), focus=(0, 0, 1, 1)),
    dict(name='threaded', file='身上缠绕着线的女性.png', spot='red', spot_sat=0.4, k=(0.05, 1.0, 1.1, 0.9),
         focus=(0.08, 0.03, 0.92, 0.72), anchor=(0.14, 0.49, 'left')),
    dict(name='city', file='神秘奇幻的城市.jpg', spot=None, k=(0.1, 1.0, 1.6, 0.8), focus=(0.0, 0.05, 0.8, 0.75)),
    dict(name='peony', file='一朵花.jpg', spot='red', spot_sat=0.12, spot_gain=1.5, k=(0.05, 1.0, 1.15, 0.85),
         focus=(0.0, 0.2, 0.9, 0.85)),
]

SPOT = {  # 色相中心、完全算专色的半宽、渐隐到 0 的半宽、饱和度门槛（单张图可以用 spot_fade、spot_sat 覆盖）
    'red': (352, 22, 48, 0.3),
    'blue': (228, 25, 50, 0.15),
}


def load_rgb(path):
    im = Image.open(path)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert('RGB')


def separate(rgb, item):
    a = np.asarray(rgb).astype(np.float32) / 255.0
    mx, mn = a.max(-1), a.min(-1)
    sat = np.where(mx > 1e-4, (mx - mn) / np.maximum(mx, 1e-4), 0.0)

    lo, hi, gamma, kmax = item['k']
    k = np.clip((1.0 - mx - lo) / (hi - lo), 0, 1) ** gamma * kmax

    spot = np.zeros_like(k)
    if item['spot']:
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        d = np.maximum(mx - mn, 1e-4)
        hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
        centre, full, fade, s0 = SPOT[item['spot']]
        fade, s0 = item.get('spot_fade', fade), item.get('spot_sat', s0)
        dist = np.abs((hue - centre + 180) % 360 - 180)
        w_hue = np.clip(1 - (dist - full) / (fade - full), 0, 1)
        w_sat = np.clip((sat - s0) / (1 - s0), 0, 1)
        spot = np.clip(w_hue * w_sat * np.clip(mx / 0.35, 0, 1) * 1.15 * item.get('spot_gain', 1.0), 0, 1)
    return k, spot


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src', help='素材目录')
    ap.add_argument('--preview', help='另存一张拼好的图集方便查看')
    args = ap.parse_args()
    src = Path(args.src)
    out = Path(__file__).resolve().parent.parent / 'assets' / 'fragments.js'

    W, H = CELL * COLS, CELL * ROWS
    plane_k = np.zeros((H, W), np.float32)
    plane_s = np.zeros((H, W), np.float32)
    meta = []
    for i, item in enumerate(ITEMS):
        rgb = load_rgb(src / item['file'])
        s = CELL / max(rgb.size)
        w, h = max(1, round(rgb.size[0] * s)), max(1, round(rgb.size[1] * s))
        rgb = rgb.resize((w, h), Image.LANCZOS)
        k, spot = separate(rgb, item)
        cx, cy = (i % COLS) * CELL + (CELL - w) // 2, (i // COLS) * CELL + (CELL - h) // 2
        plane_k[cy:cy + h, cx:cx + w] = k
        plane_s[cy:cy + h, cx:cx + w] = spot
        meta.append({
            'name': item['name'], 'cell': i, 'rect': [cx, cy, w, h], 'focus': list(item['focus']),
            'spot': item['spot'], 'anchor': list(item['anchor']) if item.get('anchor') else None,
            'whole': bool(item.get('whole')), 'texture': bool(item.get('texture')),
        })

    atlas = np.concatenate([plane_k, plane_s], axis=0)
    img = Image.fromarray((atlas * 255).round().astype(np.uint8), 'L')
    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=86, optimize=True)
    if args.preview:
        img.save(args.preview, 'JPEG', quality=86)

    data = {'cell': CELL, 'cols': COLS, 'rows': ROWS, 'items': meta,
            'src': 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text('// 由 web/tools/build_fragments.py 生成，不要手改\nwindow.FRAGMENT_ATLAS = '
                   + json.dumps(data, ensure_ascii=False) + ';\n', encoding='utf-8')
    print(f'{out}  {out.stat().st_size / 1024:.0f} KB，{len(meta)} 张图')


if __name__ == '__main__':
    main()
