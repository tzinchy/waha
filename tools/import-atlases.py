#!/usr/bin/env python3
"""Перенос запечённых атласов из ветки faction-asset-lab в игру: PNG → WebP (в разы легче), JSON — с новым именем картинки.
    python3 tools/import-atlases.py <корень codex: …/client/public/models/factions> [пакет …]
Берёт только анимации, которые проигрывает игра; старые PNG этих ролей удаляются.
"""
import json, os, sys
from PIL import Image

SRC = sys.argv[1]
ROLE_ARG = [a[6:] for a in sys.argv[2:] if a.startswith('roles=')]
PACKS = [a for a in sys.argv[2:] if not a.startswith('roles=')] or ['legion', 'heretics', 'scrap', 'necrons', 'drukhari', 'daemons']
ROLES = ['captain', 'guard', 'builder', 'sniper', 'heavy', 'flamer', 'elite', 'medic', 'transport', 'tank', 'walker', 'artillery', 'titan',
         'hq', 'barracks', 'factory', 'armory', 'generator', 'relic', 'post', 'turret', 'wall', 'gate']  # постройки
ANIMS = ['idle', 'walk', 'run', 'shoot', 'attack', 'death', 'work', 'build']
DST = os.path.join(os.path.dirname(__file__), '..', 'client/public/models/factions')

total = 0
for pack in PACKS:
    for role in (ROLE_ARG[0].split(',') if ROLE_ARG else ROLES):
        src = os.path.join(SRC, pack, role, 'sprites')
        meta_path = os.path.join(src, 'idle.json')
        if not os.path.exists(meta_path) or json.load(open(meta_path))['cellWidth'] <= 128:
            continue  # ещё не перезапечено в новом размере
        dst = os.path.join(DST, pack, role, 'sprites')
        os.makedirs(dst, exist_ok=True)
        for name in os.listdir(dst):
            if name.endswith('.png'):
                os.remove(os.path.join(dst, name))
        for anim in ANIMS:
            png, js = os.path.join(src, anim + '.png'), os.path.join(src, anim + '.json')
            if not (os.path.exists(png) and os.path.exists(js)):
                continue
            meta = json.load(open(js))
            meta['image'] = anim + '.webp'
            Image.open(png).save(os.path.join(dst, anim + '.webp'), 'WEBP', quality=88, method=4)  # method 4: в разы быстрее 6 при почти том же размере
            json.dump(meta, open(os.path.join(dst, anim + '.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
            total += os.path.getsize(os.path.join(dst, anim + '.webp'))
        print(pack, role, 'ok')
print('webp, МБ:', round(total / 2**20, 1))
