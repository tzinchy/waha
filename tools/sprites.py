#!/usr/bin/env python3
"""Генератор оригинальных силуэтов юнитов в стиле дизайн-системы (viewBox 0 -12 120 164, земля y=150).
Собирает фигуры из частей: голова, торс, оружие, спина; техника — шасси, корпус, орудие.
Части размечены классами legL/legR/body/arm/head/cape — их двигают штатные анимации lc-anim-*.
    python3 tools/sprites.py            # пишет все спрайты из SPECS в client/public/ds/assets и ds/project/assets
"""
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = [os.path.join(ROOT, 'client/public/ds/assets'), os.path.join(ROOT, 'ds/project/assets')]

PAL = {  # main — основной металл/ткань, dark — тень, trim — отделка, glow — свечение, skin — кость/кожа
    'undead':    dict(main='#7a7f6a', dark='#2e3128', trim='#b8b090', glow='#7affc8', skin='#d8d0b0', cloth='#3a2a3a'),
    'prism':     dict(main='#d8dce8', dark='#5a6078', trim='#5ac8f0', glow='#8ae8ff', skin='#b8c0d0', cloth='#3a4870'),
    'clockwork': dict(main='#3a4440', dark='#101614', trim='#c8a850', glow='#5affa0', skin='#8a948e', cloth='#1c2422'),
    'orks':      dict(main='#8a7a5a', dark='#3a3020', trim='#e0b030', glow='#ffd040', skin='#6e8e3a', cloth='#5a2810'),
    'ashen':     dict(main='#5a4a44', dark='#140808', trim='#d8a850', glow='#ff9a3a', skin='#b8402e', cloth='#3a1a1c'),
}
LINE = '#0a0806'


def defs(p, k):
    return (f'<defs><linearGradient id="{k}M" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{p["main"]}"/><stop offset="1" stop-color="{p["dark"]}"/></linearGradient>'
            f'<linearGradient id="{k}C" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{p["cloth"]}"/><stop offset="1" stop-color="{p["dark"]}"/></linearGradient>'
            f'<linearGradient id="{k}T" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{p["trim"]}"/><stop offset="1" stop-color="{p["dark"]}"/></linearGradient>'
            f'<radialGradient id="{k}G" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="{p["glow"]}"/><stop offset="1" stop-color="{p["glow"]}" stop-opacity="0"/></radialGradient></defs>')


def svg(title, body, k, p, w=120, h=164, vb='0 -12 120 164'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}"><title>{title}</title>{defs(p, k)}{body}</svg>'


# ---------- пехота ----------
def head(kind, k, p, y=10):
    M, T, G, s, L = f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', p['skin'], LINE
    eyes = f'<circle cx="55" cy="{y+16}" r="2.4" fill="{p["glow"]}" class="glowpulse"/><circle cx="65" cy="{y+16}" r="2.4" fill="{p["glow"]}" class="glowpulse"/>'
    if kind == 'skull':
        return f'<path d="M48 {y+18}Q48 {y} 60 {y}Q72 {y} 72 {y+18}L68 {y+32}H52Z" fill="{s}" stroke="{L}" stroke-width="1.5"/><path d="M52 {y+12}h6v6h-6zM62 {y+12}h6v6h-6z" fill="{L}"/><circle cx="55" cy="{y+15}" r="1.6" fill="{p["glow"]}" class="glowpulse"/><circle cx="65" cy="{y+15}" r="1.6" fill="{p["glow"]}" class="glowpulse"/><path d="M54 {y+26}v5M58 {y+26}v5M62 {y+26}v5M66 {y+26}v5" stroke="{L}"/>'
    if kind == 'hood':
        return f'<path d="M44 {y+34}Q42 {y+4} 60 {y-2}Q78 {y+4} 76 {y+34}Z" fill="url(#{k}C)" stroke="{L}" stroke-width="1.5"/><path d="M50 {y+30}Q50 {y+10} 60 {y+8}Q70 {y+10} 70 {y+30}Z" fill="{L}"/>' + eyes
    if kind == 'crown':
        return f'<path d="M48 {y+34}Q46 {y+8} 60 {y+6}Q74 {y+8} 72 {y+34}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M46 {y+8}L48 {y-8}L54 {y+2}L60 {y-12}L66 {y+2}L72 {y-8}L74 {y+8}Z" fill="{T}" stroke="{L}"/>' + eyes
    if kind == 'mask':  # гладкая маска-линза
        return f'<path d="M48 {y+32}Q46 {y+4} 60 {y+2}Q74 {y+4} 72 {y+32}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><ellipse cx="60" cy="{y+16}" rx="9" ry="5" fill="{G}" class="glowpulse"/><path d="M52 {y+26}H68" stroke="{p["trim"]}" stroke-width="2"/>'
    if kind == 'fins':  # гребень-плавники
        return f'<path d="M50 {y+32}Q48 {y+6} 60 {y+4}Q72 {y+6} 70 {y+32}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M60 {y+4}L56 {y-10}L60 {y-4}L64 {y-14}L66 {y+6}Z" fill="{p["trim"]}" stroke="{L}"/>' + eyes
    if kind == 'orc':
        return f'<path d="M46 {y+18}Q46 {y} 60 {y}Q76 {y} 76 {y+18}L74 {y+32}Q60 {y+40} 48 {y+32}Z" fill="{s}" stroke="{L}" stroke-width="1.5"/><path d="M40 {y+10}L48 {y+14}L46 {y+18}Z M80 {y+10}L72 {y+14}L74 {y+18}Z" fill="{s}" stroke="{L}"/><circle cx="54" cy="{y+14}" r="2.4" fill="#ff5a3a"/><circle cx="66" cy="{y+14}" r="2.4" fill="#ff5a3a"/><path d="M52 {y+28}l2 -5l2 5M64 {y+28}l2 -5l2 5" fill="#e8dcc0" stroke="{L}" stroke-width=".8"/>'
    # helm
    return f'<path d="M48 {y+32}Q46 {y+4} 60 {y+2}Q74 {y+4} 72 {y+32}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M50 {y+14}H70V{y+20}H50Z" fill="{L}"/>' + eyes


def weapon(kind, k, p, sx, sy):
    """Оружие в правой руке; sx, sy — плечо."""
    M, T, G, L = f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', LINE
    arm = f'<path d="M{sx} {sy-2}L{sx+14} {sy+10}L{sx+10} {sy+20}L{sx-2} {sy+8}Z" fill="{M}" stroke="{L}" stroke-width="1.2"/>'
    hx, hy = sx + 12, sy + 16
    w = {
        'rifle': f'<path d="M{hx-10} {hy}H{hx+30}" stroke="{p["dark"]}" stroke-width="4"/><path d="M{hx-10} {hy}H{hx+30}" stroke="{p["trim"]}" stroke-width="1"/>',
        'longrifle': f'<path d="M{hx-16} {hy+4}L{hx+44} {hy-10}" stroke="{p["dark"]}" stroke-width="4"/><circle cx="{hx+6}" cy="{hy-2}" r="3" fill="{G}" class="glowpulse"/>',
        'cannon': f'<rect x="{hx-14}" y="{hy-6}" width="34" height="12" fill="{M}" stroke="{L}" stroke-width="1.5"/><circle cx="{hx+22}" cy="{hy}" r="5" fill="{G}" class="glowpulse"/>',
        'beam': f'<path d="M{hx-10} {hy-4}H{hx+24}L{hx+30} {hy}L{hx+24} {hy+4}H{hx-10}Z" fill="{M}" stroke="{L}"/><circle cx="{hx+30}" cy="{hy}" r="4" fill="{G}" class="glowpulse"/>',
        'staff': f'<path d="M{hx} {150}V{hy-50}" stroke="{p["trim"]}" stroke-width="3"/><circle cx="{hx}" cy="{hy-54}" r="7" fill="{G}" class="glowpulse"/>',
        'scythe': f'<path d="M{hx} {hy+40}V{hy-46}" stroke="{p["dark"]}" stroke-width="3"/><path d="M{hx} {hy-46}Q{hx+30} {hy-50} {hx+34} {hy-26}Q{hx+22} {hy-40} {hx} {hy-38}Z" fill="{p["trim"]}" stroke="{L}"/>',
        'club': f'<path d="M{hx} {hy+6}L{hx+18} {hy-34}" stroke="{p["dark"]}" stroke-width="4"/><path d="M{hx+12} {hy-30}L{hx+22} {hy-52}L{hx+32} {hy-30}L{hx+22} {hy-22}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M{hx+22} {hy-48}V{hy-26}" stroke="{p["glow"]}" stroke-width="2" class="glowpulse"/>',
        'sword': f'<path d="M{hx} {hy}L{hx+30} {hy-40}" stroke="{p["trim"]}" stroke-width="4"/><path d="M{hx-4} {hy-4}L{hx+6} {hy+4}" stroke="{L}" stroke-width="3"/>',
        'spear': f'<path d="M{hx-10} {hy+30}L{hx+20} {hy-50}" stroke="{p["dark"]}" stroke-width="3"/><path d="M{hx+20} {hy-50}L{hx+16} {hy-36}L{hx+24} {hy-38}Z" fill="{p["trim"]}" stroke="{L}"/>',
        'claws': f'<path d="M{hx} {hy}l10 8M{hx+2} {hy-4}l12 4M{hx-2} {hy+4}l6 10" stroke="{p["skin"]}" stroke-width="2"/>',
        'censer': f'<path d="M{hx} {hy}V{hy+26}" stroke="{p["trim"]}" stroke-width="1.2"/><path d="M{hx-6} {hy+26}H{hx+6}L{hx+4} {hy+36}H{hx-4}Z" fill="{T}" stroke="{L}"/><circle cx="{hx}" cy="{hy+24}" r="6" fill="{G}" opacity=".6" class="glowpulse"/>',
        'ballista': f'<path d="M{hx-14} {hy}H{hx+30}" stroke="{p["dark"]}" stroke-width="5"/><path d="M{hx+6} {hy-16}Q{hx+16} {hy} {hx+6} {hy+16}" stroke="{p["skin"]}" stroke-width="3" fill="none"/><path d="M{hx+30} {hy}l-6 -3v6z" fill="{p["skin"]}"/>',
    }[kind]
    return f'<g class="arm" style="transform-origin:{sx}px {sy}px">{arm}{w}</g>'


def offhand(kind, k, p, sx, sy):
    M, T, G, L = f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', LINE
    arm = f'<path d="M{sx} {sy-2}L{sx-14} {sy+10}L{sx-10} {sy+20}L{sx+2} {sy+8}Z" fill="{M}" stroke="{L}" stroke-width="1.2"/>'
    o = {
        None: '',
        'shield': f'<path d="M{sx-26} {sy+4}H{sx-4}V{sy+40}L{sx-15} {sy+50}L{sx-26} {sy+40}Z" fill="{T}" stroke="{L}" stroke-width="1.5"/><circle cx="{sx-15}" cy="{sy+22}" r="4" fill="{G}" class="glowpulse"/>',
        'lantern': f'<path d="M{sx-12} {sy+20}V{sy+30}" stroke="{p["trim"]}"/><rect x="{sx-18}" y="{sy+30}" width="12" height="14" fill="{G}" stroke="{L}" class="glowpulse"/>',
        'orb': f'<circle cx="{sx-14}" cy="{sy+22}" r="7" fill="{G}" class="glowpulse"/>',
        'claws': f'<path d="M{sx-12} {sy+20}l-10 8M{sx-14} {sy+16}l-12 4M{sx-10} {sy+24}l-6 10" stroke="{p["skin"]}" stroke-width="2"/>',
        'book': f'<rect x="{sx-24}" y="{sy+16}" width="14" height="18" fill="url(#{k}C)" stroke="{L}"/><path d="M{sx-17} {sy+20}v10" stroke="{p["trim"]}" stroke-width="2"/>',
    }[kind]
    return f'<g class="arm" style="transform-origin:{sx}px {sy}px">{arm}{o}</g>'


def back(kind, k, p):
    M, T, G, L = f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', LINE
    return {
        None: '',
        'wings': f'<g class="cape"><path d="M46 50Q14 10 2 40Q18 44 18 64Q32 54 46 66Z M74 50Q106 10 118 40Q102 44 102 64Q88 54 74 66Z" fill="{p["dark"]}" stroke="{L}" stroke-width="1.5"/><path d="M10 34L32 60M110 34L88 60" stroke="{p["trim"]}"/></g>',
        'cape': f'<g class="cape"><path d="M42 46Q34 100 30 140H90Q86 100 78 46Z" fill="url(#{k}C)" stroke="{L}" stroke-width="1.5"/></g>',
        'robe': f'<g class="cape"><path d="M42 48Q34 104 28 150H92Q86 104 78 48Z" fill="url(#{k}C)" stroke="{L}" stroke-width="2"/><path d="M36 124L32 150M84 124L88 150" stroke="{p["dark"]}" stroke-width="2"/></g>',
        'tanks': f'<rect x="30" y="42" width="12" height="40" rx="5" fill="{T}" stroke="{L}"/><rect x="78" y="42" width="12" height="40" rx="5" fill="{T}" stroke="{L}"/>',
        'banner': f'<path d="M40 110V-6" stroke="{p["dark"]}" stroke-width="2"/><path d="M41 -6H58V20L49 14L41 20Z" fill="url(#{k}C)" stroke="{L}"/><circle cx="49" cy="4" r="3" fill="{G}" class="glowpulse"/>',
        'halo': f'<circle cx="60" cy="24" r="22" fill="none" stroke="{p["glow"]}" stroke-width="2" stroke-dasharray="4 4" class="glowpulse"/>',
        'pylons': f'<path d="M38 44L30 8L42 40Z M82 44L90 8L78 40Z" fill="{M}" stroke="{L}"/><circle cx="30" cy="8" r="3" fill="{G}" class="glowpulse"/><circle cx="90" cy="8" r="3" fill="{G}" class="glowpulse"/>',
    }[kind]


def humanoid(k, p, head_kind='helm', weapon_kind='rifle', off=None, bk=None, bulk=1.0, robe=False, chest='', hover=False):
    L, M, T = LINE, f'url(#{k}M)', f'url(#{k}T)'
    w = 20 * bulk
    x0, x1 = 60 - w, 60 + w
    shadow = f'<ellipse cx="60" cy="150" rx="{w+6:.0f}" ry="4" fill="#000" opacity=".45"/>'
    legs = '' if hover else (
        f'<g class="legL" style="transform-origin:{60-w/2:.0f}px 108px"><path d="M{60-w/2-6:.0f} 108H{60-w/2+6:.0f}L{60-w/2+5:.0f} 140H{60-w/2-5:.0f}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M{60-w/2-10:.0f} 140H{60-w/2+6:.0f}L{60-w/2+7:.0f} 150H{60-w/2-12:.0f}Z" fill="{p["dark"]}" stroke="{L}"/></g>'
        f'<g class="legR" style="transform-origin:{60+w/2:.0f}px 108px"><path d="M{60+w/2-6:.0f} 108H{60+w/2+6:.0f}L{60+w/2+5:.0f} 140H{60+w/2-5:.0f}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M{60+w/2-6:.0f} 140H{60+w/2+10:.0f}L{60+w/2+12:.0f} 150H{60+w/2-7:.0f}Z" fill="{p["dark"]}" stroke="{L}"/></g>')
    if hover:
        shadow += f'<ellipse cx="60" cy="146" rx="14" ry="3" fill="{p["glow"]}" opacity=".35" class="glowpulse"/>'
    torso = (f'<path d="M{x0:.0f} 56Q{x0:.0f} 40 {x0+14:.0f} 38H{x1-14:.0f}Q{x1:.0f} 40 {x1:.0f} 56L{x1-4:.0f} {124 if hover else 112}H{x0+4:.0f}Z" fill="{M}" stroke="{L}" stroke-width="2"/>'
             f'<path d="M{x0+6:.0f} 70H{x1-6:.0f}M{x0+6:.0f} 92H{x1-6:.0f}" stroke="{p["trim"]}" stroke-width="2" opacity=".8"/>' + chest)
    b = back(bk, k, p) if bk not in ('robe', 'cape', 'wings') else ''
    capes = back(bk, k, p) if bk in ('robe', 'cape', 'wings') else ''
    return (shadow + capes + ('' if robe else legs) + f'<g class="body">{b}{torso}<g class="head">{head(head_kind, k, p, 6)}</g>'
            + offhand(off, k, p, x0 + 2, 48) + weapon(weapon_kind, k, p, x1 - 2, 48) + '</g>')


# ---------- техника ----------
def vehicle(k, p, chassis='tracks', hull='box', gun='cannon', extra='', big=False):
    L, M, T, G, C = LINE, f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', f'url(#{k}C)'
    s = '<ellipse cx="60" cy="150" rx="54" ry="5" fill="#000" opacity=".45"/>'
    under = {
        'tracks': f'<path d="M8 124H112L104 148H16Z" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/>' + ''.join(f'<circle cx="{x}" cy="136" r="7" fill="{M}" stroke="{L}"/>' for x in (24, 42, 60, 78, 96)),
        'wheels': ''.join(f'<circle cx="{x}" cy="132" r="15" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/><circle cx="{x}" cy="132" r="6" fill="{T}"/>' for x in (26, 94)),
        'hover': f'<ellipse cx="60" cy="140" rx="40" ry="6" fill="{G}" opacity=".5" class="glowpulse"/><path d="M14 124H106L96 134H24Z" fill="{p["dark"]}" stroke="{L}"/>',
        'legs4': f'<g class="legL" style="transform-origin:30px 112px"><path d="M26 112L14 146H24L36 116Z" fill="{M}" stroke="{L}"/><path d="M44 116L40 148H50L52 116Z" fill="{M}" stroke="{L}"/></g><g class="legR" style="transform-origin:90px 112px"><path d="M94 112L106 146H96L84 116Z" fill="{M}" stroke="{L}"/><path d="M76 116L80 148H70L68 116Z" fill="{M}" stroke="{L}"/></g>',
        'legs2': f'<g class="legL" style="transform-origin:44px 104px"><path d="M40 104L32 146H50L50 108Z" fill="{M}" stroke="{L}" stroke-width="1.5"/></g><g class="legR" style="transform-origin:76px 104px"><path d="M80 104L88 146H70L70 108Z" fill="{M}" stroke="{L}" stroke-width="1.5"/></g>',
        'sled': f'<path d="M6 146Q4 132 20 132H100Q114 132 112 146Z" fill="{p["skin"]}" stroke="{L}" stroke-width="1.5"/>',
    }[chassis]
    top = 70 if big else 84
    bodyp = {
        'box': f'<path d="M12 126L18 {top}H102L108 126Z" fill="{M}" stroke="{L}" stroke-width="2"/>',
        'wedge': f'<path d="M8 126L30 {top}H96L112 126Z" fill="{M}" stroke="{L}" stroke-width="2"/>',
        'dome': f'<path d="M14 126Q14 {top-10} 60 {top-10}Q106 {top-10} 106 126Z" fill="{M}" stroke="{L}" stroke-width="2"/>',
        'coffin': f'<path d="M20 126L12 {top+14}L28 {top}H92L108 {top+14}L100 126Z" fill="{C}" stroke="{L}" stroke-width="2"/><path d="M60 {top+4}V122M48 {top+16}H72" stroke="{p["trim"]}" stroke-width="3"/>',
        'pyramid': f'<path d="M14 126L42 {top-14}H78L106 126Z" fill="{M}" stroke="{L}" stroke-width="2"/><path d="M42 {top-14}L36 126M78 {top-14}L84 126" stroke="{p["trim"]}" stroke-width="2"/>',
        'crystal': f'<path d="M16 126L30 {top}L60 {top-24}L90 {top}L104 126Z" fill="{M}" stroke="{L}" stroke-width="2"/><path d="M30 {top}L60 126L90 {top}M60 {top-24}V126" stroke="{p["trim"]}" stroke-width="1.5" opacity=".8"/>',
    }[hull]
    trim = f'<path d="M20 {top+12}H100" stroke="{p["trim"]}" stroke-width="2" opacity=".8"/><circle cx="34" cy="{top+24}" r="3" fill="{p["glow"]}" class="glowpulse"/><circle cx="86" cy="{top+24}" r="3" fill="{p["glow"]}" class="glowpulse"/>'
    gy = top - 6
    g = {
        'none': '',
        'cannon': f'<rect x="42" y="{gy-12}" width="34" height="16" fill="{M}" stroke="{L}" stroke-width="1.5"/><path d="M76 {gy-4}H116" stroke="{p["dark"]}" stroke-width="6"/>',
        'twin': f'<rect x="44" y="{gy-10}" width="28" height="14" fill="{M}" stroke="{L}"/><path d="M72 {gy-6}H108M72 {gy}H106" stroke="{p["dark"]}" stroke-width="3"/>',
        'beam': f'<path d="M44 {gy+4}L52 {gy-16}H74L80 {gy+4}Z" fill="{M}" stroke="{L}"/><path d="M78 {gy-6}H110" stroke="{p["trim"]}" stroke-width="4"/><circle cx="112" cy="{gy-6}" r="5" fill="{G}" class="glowpulse"/>',
        'mortar': f'<path d="M46 {gy+6}L56 {gy-30}H74L76 {gy+6}Z" fill="{M}" stroke="{L}" stroke-width="1.5"/><ellipse cx="65" cy="{gy-30}" rx="10" ry="4" fill="{L}"/><ellipse cx="65" cy="{gy-30}" rx="6" ry="2" fill="{G}" class="glowpulse"/>',
        'catapult': f'<path d="M40 {gy+6}L84 {gy-40}" stroke="{p["skin"]}" stroke-width="5"/><circle cx="86" cy="{gy-42}" r="9" fill="{p["skin"]}" stroke="{L}"/><path d="M80 {gy-46}h4v4h-4zM88 {gy-46}h4v4h-4z" fill="{L}"/>',
        'arc': f'<path d="M56 {gy+4}V{gy-26}" stroke="{p["trim"]}" stroke-width="4"/><circle cx="56" cy="{gy-30}" r="9" fill="{G}" class="glowpulse"/><path d="M56 {gy-30}L72 {gy-40}L66 {gy-26}L84 {gy-34}" stroke="{p["glow"]}" stroke-width="1.5" fill="none" class="glowpulse"/>',
        'lance': f'<path d="M40 {gy+4}L60 {gy-12}H80L84 {gy+4}Z" fill="{M}" stroke="{L}"/><path d="M80 {gy-4}L118 {gy-16}" stroke="{p["trim"]}" stroke-width="5"/><circle cx="116" cy="{gy-15}" r="4" fill="{G}" class="glowpulse"/>',
    }[gun]
    return s + f'<g class="body">{bodyp}{trim}{extra}<g class="arm" style="transform-origin:60px {gy}px">{g}</g></g>' + under


# ---------- постройки 200×200 ----------
def building(k, p, form='spire', extra=''):
    L, M, T, G, C = LINE, f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)', f'url(#{k}C)'
    base = f'<ellipse cx="100" cy="190" rx="80" ry="8" fill="#000" opacity=".5"/><path d="M20 190L30 170H170L180 190Z" fill="{M}" stroke="{L}" stroke-width="2"/>'
    f = {
        'spire': f'<path d="M60 170L80 40L100 6L120 40L140 170Z" fill="{M}" stroke="{L}" stroke-width="2.5"/><path d="M100 6V170" stroke="{p["trim"]}" stroke-width="3"/><circle cx="100" cy="60" r="18" fill="{G}" class="glowpulse"/>',
        'lens': f'<path d="M50 170L70 70H130L150 170Z" fill="{M}" stroke="{L}" stroke-width="2.5"/><ellipse cx="100" cy="50" rx="44" ry="30" fill="{G}" opacity=".85" class="glowpulse"/><ellipse cx="100" cy="50" rx="44" ry="30" fill="none" stroke="{p["trim"]}" stroke-width="4"/><path d="M60 70L100 50L140 70" stroke="{L}" stroke-width="2" fill="none"/>',
        'gate': f'<path d="M40 170V40L70 20V170Z M160 170V40L130 20V170Z" fill="{M}" stroke="{L}" stroke-width="2.5"/><path d="M70 40Q100 10 130 40V170H70Z" fill="{L}"/><path d="M78 50Q100 26 122 50V170H78Z" fill="{G}" opacity=".85" class="glowpulse"/><path d="M40 40L55 6L70 20M160 40L145 6L130 20" fill="{T}" stroke="{L}"/>',
    }[form]
    return base + f + extra


# ---------- что рисуем ----------
def H(**kw): return ('h', kw)
def V(**kw): return ('v', kw)
def B(**kw): return ('b', kw)

SPECS = {
    # Безмолвный Двор: кость, саван, бирюзовые огни
    'undead': {
        'undead-sniper':   ('Плакальщица-стрелок', H(head_kind='hood', weapon_kind='longrifle', bk='robe', robe=True, bulk=.8)),
        'undead-ballista': ('Костяная баллиста', H(head_kind='skull', weapon_kind='ballista', bk='tanks', bulk=1.1)),
        'undead-warden':   ('Гробовой страж', H(head_kind='skull', weapon_kind='spear', off='shield', bk='cape', bulk=1.15)),
        'undead-keeper':   ('Хранительница мощей', H(head_kind='hood', weapon_kind='censer', off='lantern', bk='robe', robe=True, hover=True, bulk=.85)),
        'undead-runner':   ('Костяной бегун', V(chassis='legs4', hull='coffin', gun='twin')),
        'undead-hearse':   ('Катафалк', V(chassis='wheels', hull='coffin', gun='none', extra='<path d="M30 70V54H90V70" fill="none" stroke="#b8b090" stroke-width="2"/><path d="M40 54L60 40L80 54" fill="none" stroke="#b8b090" stroke-width="2"/>')),
        'undead-strider':  ('Костяной шагоход', V(chassis='legs2', hull='dome', gun='cannon', big=True)),
        'undead-thrower':  ('Костемёт', V(chassis='sled', hull='box', gun='catapult')),
        'undead-queen':    ('Королева-Вдова', H(head_kind='crown', weapon_kind='staff', off='orb', bk='robe', robe=True, hover=True, bulk=.9)),
        'undead-marshal':  ('Безглавый Маршал', H(head_kind='helm', weapon_kind='sword', off='shield', bk='banner', bulk=1.25)),
        'undead-choir':    ('Хор Тысячи', H(head_kind='hood', weapon_kind='censer', off='book', bk='halo', robe=True, bulk=1.0)),
        'undead-lord':     ('Капитан-Кладбищенский лорд', H(head_kind='crown', weapon_kind='scythe', off='shield', bk='cape', bulk=1.1)),
        'undead-mourner':  ('Капитан-Плакальщица', H(head_kind='hood', weapon_kind='scythe', off='lantern', bk='wings', bulk=.95)),
        'undead-arkhive':  ('Ковчег-Костница', V(chassis='legs2', hull='coffin', gun='catapult', big=True)),
    },
    'prism': {
        'prism-focus':     ('Фокус-линза', H(head_kind='mask', weapon_kind='longrifle', bk='pylons', bulk=.85)),
        'prism-gun':       ('Призма-орудие', H(head_kind='mask', weapon_kind='beam', bk='tanks', bulk=1.15)),
        'prism-shard':     ('Осколочный страж', H(head_kind='fins', weapon_kind='sword', off='shield', bk='pylons', bulk=1.1)),
        'prism-choir':     ('Хор Граней', H(head_kind='mask', weapon_kind='staff', off='orb', bk='halo', hover=True, bulk=.85)),
        'prism-skiff':     ('Глиссер', V(chassis='hover', hull='wedge', gun='twin')),
        'prism-colossus':  ('Линзовый колосс', V(chassis='legs2', hull='crystal', gun='lance', big=True)),
        'prism-howitzer':  ('Призма-гаубица', V(chassis='hover', hull='crystal', gun='mortar')),
        'prism-voice':     ('Первый Голос', H(head_kind='mask', weapon_kind='staff', off='book', bk='halo', robe=True, bulk=.9)),
        'prism-twins':     ('Близнецы-Каркасы', H(head_kind='fins', weapon_kind='cannon', off='shield', bk='pylons', bulk=1.3)),
        'prism-eyes':      ('Рой «Тысяча глаз»', H(head_kind='mask', weapon_kind='beam', off='orb', bk='pylons', hover=True, bulk=.7)),
        'prism-tuner':     ('Капитан-Наводчик', H(head_kind='fins', weapon_kind='rifle', off='orb', bk='cape', bulk=1.0)),
        'prism-mender':    ('Капитан-Наладчик', H(head_kind='mask', weapon_kind='censer', off='orb', bk='pylons', hover=True, bulk=.95)),
        'prism-blade':     ('Капитан-Каркас', H(head_kind='fins', weapon_kind='sword', off='claws', bk='wings', bulk=1.15)),
        'prism-drone':     ('Щитовой дрон', V(chassis='hover', hull='dome', gun='arc')),
        'prism-ark':       ('Призма-ковчег', V(chassis='hover', hull='crystal', gun='arc', big=True)),
        'prism-doom':      ('Солнечное копьё', B(form='lens')),
    },
    'clockwork': {
        'clock-gunner':    ('Стрелок Циферблата', H(head_kind='skull', weapon_kind='longrifle', bulk=.9)),
        'clock-gauss':     ('Гаусс-носильщик', H(head_kind='skull', weapon_kind='cannon', bk='pylons', bulk=1.2)),
        'clock-lych':      ('Склеповая стража', H(head_kind='crown', weapon_kind='club', off='shield', bk='cape', bulk=1.25)),
        'clock-ark':       ('Ковчег Ночи', V(chassis='hover', hull='pyramid', gun='arc')),
        'clock-tomb':      ('Шагающая гробница', V(chassis='legs4', hull='pyramid', gun='lance')),
        'clock-scuttler':  ('Скарабей-носитель', V(chassis='legs4', hull='dome', gun='beam')),
        'clock-obelisk':   ('Гаусс-обелиск', V(chassis='hover', hull='pyramid', gun='mortar')),
        'clock-king':      ('Король-Полночь', H(head_kind='crown', weapon_kind='staff', off='orb', bk='cape', bulk=1.15)),
        'clock-archon':    ('Архонт Маятника', H(head_kind='fins', weapon_kind='scythe', bk='pylons', hover=True, bulk=1.0)),
        'clock-eater':     ('Пожиратель Часов', H(head_kind='skull', weapon_kind='claws', off='claws', bk='wings', bulk=1.1)),
        'clock-cryptek':   ('Капитан-Криптомант', H(head_kind='hood', weapon_kind='staff', off='lantern', bk='robe', robe=True, bulk=.95)),
    },
    'orks': {
        'ork-fang':        ('Старый Клык', H(head_kind='orc', weapon_kind='club', off='claws', bk='banner', bulk=1.35)),
        'ork-brutes':      ('Братья-Громилы', H(head_kind='orc', weapon_kind='cannon', off='claws', bk='tanks', bulk=1.3)),
        'ork-shaman':      ('Шаман Пепла', H(head_kind='orc', weapon_kind='staff', off='orb', bk='halo', bulk=.95)),
        'ork-weirdboy':    ('Капитан-Шаман', H(head_kind='orc', weapon_kind='staff', off='book', bk='cape', bulk=1.0)),
        'ork-boss':        ('Капитан-Вожак', H(head_kind='orc', weapon_kind='sword', off='claws', bk='banner', bulk=1.2)),
    },
    'ashen': {
        'ashen-doom':      ('Око Разлома', B(form='gate')),
    },
}


def render(f, name, title, spec):
    t, kw = spec
    p, k = PAL[f], name.replace('-', '')
    if t == 'b':
        return svg(title, building(k, p, **kw), k, p, 200, 200, '0 0 200 200')
    body = humanoid(k, p, **kw) if t == 'h' else vehicle(k, p, **kw)
    return svg(title, body, k, p)


if __name__ == '__main__':
    n = 0
    for f, items in SPECS.items():
        for name, (title, spec) in items.items():
            s = render(f, name, title, spec)
            for d in OUT:
                with open(os.path.join(d, 'Factions', name + '.svg'), 'w') as fh:
                    fh.write(s)
            n += 1
    print('спрайтов:', n)
