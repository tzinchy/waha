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
    'order':     dict(main='#c8a868', dark='#4a3a20', trim='#f0d890', glow='#ffe9a8', skin='#e8dcc0', cloth='#7a2a22'),
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


# ---------- постройки фракций: форма по типу здания, крыша и украшения по стилю фракции ----------
def roof(style, k, p, x, y, w):
    """Крыша над блоком x..x+w с верхом y."""
    L, M, T, G = LINE, f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)'
    c = x + w / 2
    if style == 'undead':  # готические шпили с крестами
        return (f'<path d="M{x} {y}L{c} {y-w*.55}L{x+w} {y}Z" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/>'
                f'<path d="M{c} {y-w*.55}V{y-w*.55-14}M{c-5} {y-w*.55-9}H{c+5}" stroke="{p["trim"]}" stroke-width="2.5"/>'
                f'<path d="M{x+4} {y}L{x+10} {y-18}L{x+16} {y}Z M{x+w-16} {y}L{x+w-10} {y-18}L{x+w-4} {y}Z" fill="{p["dark"]}" stroke="{L}"/>')
    if style == 'prism':  # кристаллы и линза
        return (f'<path d="M{c-14} {y}L{c} {y-34}L{c+14} {y}Z" fill="{G}" stroke="{p["trim"]}" stroke-width="2" class="glowpulse"/>'
                f'<path d="M{x+6} {y}L{x+14} {y-18}L{x+22} {y}Z M{x+w-22} {y}L{x+w-14} {y-18}L{x+w-6} {y}Z" fill="{p["main"]}" stroke="{p["trim"]}" stroke-width="1.5"/>'
                f'<path d="M{x} {y}H{x+w}" stroke="{p["trim"]}" stroke-width="3"/>')
    if style == 'clockwork':  # ступенчатая пирамида с кристаллом
        return (f'<path d="M{x} {y}L{x+w*.18} {y-w*.22}H{x+w*.82}L{x+w} {y}Z" fill="{M}" stroke="{L}" stroke-width="2"/>'
                f'<path d="M{x+w*.2} {y-w*.22}L{c} {y-w*.5}L{x+w*.8} {y-w*.22}Z" fill="{p["dark"]}" stroke="{p["trim"]}" stroke-width="2"/>'
                f'<circle cx="{c}" cy="{y-w*.3}" r="5" fill="{G}" class="glowpulse"/>')
    if style == 'orks':  # кривая ржавая крыша, шипы, трубы
        return (f'<path d="M{x-6} {y+2}L{x+w*.3} {y-16}L{x+w*.6} {y-8}L{x+w+6} {y-20}L{x+w+4} {y+2}Z" fill="{p["cloth"]}" stroke="{L}" stroke-width="2"/>'
                f'<path d="M{x+4} {y-4}L{x+w*.3} {y-14}M{x+w*.4} {y-6}L{x+w*.6} {y-8}" stroke="{p["dark"]}" stroke-width="1.5"/>'
                f'<rect x="{x+w*.7}" y="{y-44}" width="9" height="30" fill="{p["dark"]}" stroke="{L}"/><circle cx="{x+w*.7+4}" cy="{y-48}" r="6" fill="#666" opacity=".5" class="glowpulse"/>')
    # ashen: рога и огонь
    return (f'<path d="M{x} {y}Q{c} {y-26} {x+w} {y}Z" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/>'
            f'<path d="M{x+6} {y-2}Q{x-8} {y-30} {x+2} {y-46}Q{x+8} {y-26} {x+18} {y-8}Z M{x+w-6} {y-2}Q{x+w+8} {y-30} {x+w-2} {y-46}Q{x+w-8} {y-26} {x+w-18} {y-8}Z" fill="{p["skin"]}" stroke="{L}" stroke-width="1.5"/>'
            f'<circle cx="{c}" cy="{y-12}" r="8" fill="{G}" class="glowpulse"/>')


def emblem(style, k, p, cx, cy, r=10):
    L, T, G = LINE, f'url(#{k}T)', f'url(#{k}G)'
    e = {
        'undead': f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{p["skin"]}" stroke="{L}" stroke-width="1.5"/><path d="M{cx-r*.5} {cy-r*.2}h{r*.35}v{r*.35}h-{r*.35}zM{cx+r*.15} {cy-r*.2}h{r*.35}v{r*.35}h-{r*.35}z" fill="{L}"/>',
        'prism': f'<path d="M{cx} {cy-r}L{cx+r} {cy}L{cx} {cy+r}L{cx-r} {cy}Z" fill="{G}" stroke="{p["trim"]}" stroke-width="1.5" class="glowpulse"/>',
        'clockwork': f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{p["dark"]}" stroke="{p["trim"]}" stroke-width="2"/><path d="M{cx} {cy-r*.7}V{cy}L{cx+r*.5} {cy+r*.4}" stroke="{p["trim"]}" stroke-width="1.5" fill="none"/><circle cx="{cx}" cy="{cy}" r="{r*.3}" fill="{p["glow"]}" class="glowpulse"/>',
        'orks': f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{p["trim"]}" stroke="{L}" stroke-width="1.5"/><path d="M{cx-r*.5} {cy-r*.3}l{r*.3} {r*.2}M{cx+r*.5} {cy-r*.3}l-{r*.3} {r*.2}M{cx-r*.5} {cy+r*.4}h{r}" stroke="{L}" stroke-width="2"/>',
        'ashen': f'<path d="M{cx} {cy-r}L{cx+r*.9} {cy+r*.6}H{cx-r*.9}Z" fill="none" stroke="{p["glow"]}" stroke-width="2" class="glowpulse"/><circle cx="{cx}" cy="{cy+r*.1}" r="{r*.3}" fill="{p["glow"]}" class="glowpulse"/>',
    }
    return e[style]


def facade(style, k, p, x, y, w, h):
    """Стена блока: камень/металл фракции с отделкой."""
    L, M, C = LINE, f'url(#{k}M)', f'url(#{k}C)'
    body = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C if style in ("undead", "ashen") else M}" stroke="{L}" stroke-width="2"/>'
    if style == 'orks':  # заплаты и полосы
        body += f'<path d="M{x} {y+h*.3}H{x+w}M{x+w*.4} {y}V{y+h}" stroke="{p["dark"]}" stroke-width="1.5"/><path d="M{x+4} {y+h-10}h{w*.3}v8h-{w*.3}z" fill="{p["trim"]}" stroke="{L}"/><path d="M{x+6} {y+h-10}l6 8M{x+16} {y+h-10}l6 8" stroke="{L}" stroke-width="2"/>'
    elif style == 'prism':
        body += f'<path d="M{x} {y+8}H{x+w}M{x} {y+h-8}H{x+w}" stroke="{p["trim"]}" stroke-width="2"/>'
    elif style == 'clockwork':
        body += f'<path d="M{x+8} {y+4}V{y+h}M{x+w-8} {y+4}V{y+h}" stroke="{p["glow"]}" stroke-width="1.5" opacity=".7" class="glowpulse"/><path d="M{x} {y}H{x+w}" stroke="{p["trim"]}" stroke-width="3"/>'
    elif style == 'undead':
        body += f'<path d="M{x} {y+h*.5}H{x+w}" stroke="{p["dark"]}" stroke-width="1.5"/>' + ''.join(f'<path d="M{x+w*f-4} {y+h*.35}Q{x+w*f} {y+h*.15} {x+w*f+4} {y+h*.35}V{y+h*.5}H{x+w*f-4}Z" fill="{p["glow"]}" opacity=".7" class="glowpulse"/>' for f in (.25, .75))
    else:  # ashen
        body += f'<path d="M{x} {y+h*.4}H{x+w}" stroke="{p["skin"]}" stroke-width="2"/><path d="M{x+w*.2} {y+h}L{x+w*.25} {y+h*.6}L{x+w*.3} {y+h}" fill="{p["glow"]}" class="glowpulse"/>'
    return body


def door(style, k, p, cx, base, w=22, h=30):
    G = f'url(#{k}G)'
    if style == 'clockwork' or style == 'prism':
        return f'<path d="M{cx-w/2} {base}V{base-h+w/2}L{cx} {base-h}L{cx+w/2} {base-h+w/2}V{base}Z" fill="{LINE}"/><path d="M{cx-w/2+4} {base}V{base-h+w/2+2}L{cx} {base-h+6}L{cx+w/2-4} {base-h+w/2+2}V{base}Z" fill="{G}" opacity=".7" class="glowpulse"/>'
    if style == 'orks':
        return f'<rect x="{cx-w/2}" y="{base-h}" width="{w}" height="{h}" fill="{LINE}"/><path d="M{cx-w/2} {base-h}h{w}" stroke="{p["trim"]}" stroke-width="3" stroke-dasharray="4 4"/>'
    return f'<path d="M{cx-w/2} {base}V{base-h+w/2}Q{cx} {base-h-4} {cx+w/2} {base-h+w/2}V{base}Z" fill="{LINE}"/><path d="M{cx-w/2+4} {base}V{base-h+w/2+2}Q{cx} {base-h+2} {cx+w/2-4} {base-h+w/2+2}V{base}Z" fill="{G}" opacity=".55" class="glowpulse"/>'


def structure(style, k, p, kind):
    L, M, T, G = LINE, f'url(#{k}M)', f'url(#{k}T)', f'url(#{k}G)'
    ground = '<ellipse cx="100" cy="190" rx="80" ry="8" fill="#000" opacity=".5"/>'
    plinth = f'<path d="M24 190L32 176H168L176 190Z" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/>'
    if kind == 'key1':  # мастерская: низкий зал, пристройка
        return ground + plinth + facade(style, k, p, 40, 110, 120, 66) + roof(style, k, p, 40, 110, 120) + door(style, k, p, 100, 176) + facade(style, k, p, 140, 132, 36, 44) + emblem(style, k, p, 70, 140, 9)
    if kind == 'key2':  # кузня: широкий цех, ворота, две трубы
        return (ground + plinth + facade(style, k, p, 28, 100, 144, 76) + roof(style, k, p, 28, 100, 144) + door(style, k, p, 100, 176, 44, 46)
                + f'<rect x="40" y="56" width="14" height="44" fill="{p["dark"]}" stroke="{L}"/><rect x="146" y="64" width="14" height="36" fill="{p["dark"]}" stroke="{L}"/><circle cx="47" cy="50" r="8" fill="{G}" opacity=".6" class="glowpulse"/><circle cx="153" cy="58" r="7" fill="{G}" opacity=".6" class="glowpulse"/>')
    if kind == 'key3':  # башня: узкая высокая, наверху — фокус фракции
        return ground + plinth + facade(style, k, p, 74, 70, 52, 106) + roof(style, k, p, 70, 70, 60) + door(style, k, p, 100, 176, 20, 26) + emblem(style, k, p, 100, 100, 11) + facade(style, k, p, 44, 140, 30, 36) + facade(style, k, p, 126, 140, 30, 36)
    if kind == 'key4':  # реликварий: храм с колоннами
        cols = ''.join(f'<rect x="{x}" y="96" width="10" height="80" fill="{T}" stroke="{L}"/>' for x in (44, 70, 120, 146))
        return ground + plinth + facade(style, k, p, 38, 96, 124, 80) + cols + roof(style, k, p, 34, 96, 132) + door(style, k, p, 100, 176, 28, 40) + emblem(style, k, p, 100, 80, 12)
    if kind == 'gate':  # врата легенд: две башни и портал
        return (ground + plinth + facade(style, k, p, 30, 60, 40, 116) + facade(style, k, p, 130, 60, 40, 116) + roof(style, k, p, 26, 60, 48) + roof(style, k, p, 126, 60, 48)
                + f'<path d="M70 176V90Q100 50 130 90V176Z" fill="{L}"/><path d="M76 176V94Q100 60 124 94V176Z" fill="{G}" opacity=".85" class="glowpulse"/>' + emblem(style, k, p, 100, 70, 12))
    if kind == 'foundry':  # литейня: корпус, баки, свечение
        return (ground + plinth + facade(style, k, p, 30, 116, 100, 60) + roof(style, k, p, 30, 116, 100)
                + f'<rect x="134" y="104" width="34" height="72" rx="14" fill="{T}" stroke="{L}" stroke-width="2"/><path d="M138 124H164M138 150H164" stroke="{L}"/><rect x="60" y="140" width="40" height="22" fill="{G}" class="glowpulse"/><path d="M60 140V162M70 140V162M80 140V162M90 140V162" stroke="{L}" stroke-width="2"/>')
    if kind == 'pump':  # насос: вышка над жилой
        return (ground + plinth + f'<path d="M60 176L88 40H112L140 176" fill="none" stroke="{p["main"]}" stroke-width="7"/><path d="M60 176L88 40H112L140 176M70 130H130M78 90H122" fill="none" stroke="{L}" stroke-width="2"/>'
                + roof(style, k, p, 80, 44, 40) + f'<rect x="88" y="120" width="24" height="56" fill="{p["dark"]}" stroke="{L}"/><circle cx="100" cy="166" r="9" fill="{G}" class="glowpulse"/>' + emblem(style, k, p, 100, 100, 8))
    if kind == 'wall':  # сегмент стены
        tops = {'undead': ''.join(f'<path d="M{x} 104L{x+8} 88L{x+16} 104Z" fill="{p["dark"]}" stroke="{L}"/>' for x in range(20, 180, 24)),
                'prism': ''.join(f'<path d="M{x} 104L{x+8} 84L{x+16} 104Z" fill="{G}" stroke="{p["trim"]}" class="glowpulse"/>' for x in range(20, 180, 32)),
                'clockwork': f'<path d="M14 104H186" stroke="{p["trim"]}" stroke-width="4"/><path d="M30 120H170" stroke="{p["glow"]}" stroke-width="2" class="glowpulse"/>',
                'orks': ''.join(f'<path d="M{x} 104L{x+6} 82L{x+12} 104Z" fill="{p["main"]}" stroke="{L}"/>' for x in range(16, 184, 20)),
                'ashen': ''.join(f'<path d="M{x} 104Q{x-4} 84 {x+6} 76Q{x+4} 92 {x+12} 104Z" fill="{p["skin"]}" stroke="{L}"/>' for x in range(20, 180, 26))}[style]
        return ground + facade(style, k, p, 14, 104, 172, 82) + tops + emblem(style, k, p, 100, 146, 10)
    if kind == 'wallgate':
        return ground + facade(style, k, p, 10, 96, 50, 90) + facade(style, k, p, 140, 96, 50, 90) + roof(style, k, p, 8, 96, 54) + roof(style, k, p, 138, 96, 54) + f'<rect x="60" y="110" width="80" height="76" fill="{L}"/>' + ''.join(f'<path d="M{x} 112V186" stroke="{p["trim"]}" stroke-width="3"/>' for x in (70, 86, 100, 114, 130)) + f'<path d="M60 110H140" stroke="{p["trim"]}" stroke-width="5"/>'
    if kind == 'bunker':
        return ground + f'<path d="M24 186Q22 128 100 120Q178 128 176 186Z" fill="{M}" stroke="{L}" stroke-width="2.5"/><path d="M50 152H150V162H50Z" fill="{L}"/><path d="M56 155H144" stroke="{p["glow"]}" stroke-width="2" class="glowpulse"/>' + emblem(style, k, p, 100, 136, 8) + facade(style, k, p, 30, 172, 140, 14)
    if kind == 'mine':
        return f'<ellipse cx="100" cy="150" rx="46" ry="14" fill="#000" opacity=".45"/><ellipse cx="100" cy="140" rx="40" ry="14" fill="{M}" stroke="{L}" stroke-width="2"/><ellipse cx="100" cy="134" rx="24" ry="8" fill="{p["dark"]}" stroke="{L}"/>' + emblem(style, k, p, 100, 132, 7)
    if kind == 'bell':  # Колокол Скорби
        return ground + plinth + facade(style, k, p, 60, 60, 80, 116) + roof(style, k, p, 56, 60, 88) + f'<path d="M80 84Q80 70 100 70Q120 70 120 84L126 118H74Z" fill="{T}" stroke="{L}" stroke-width="2"/><circle cx="100" cy="122" r="5" fill="{p["trim"]}"/>' + door(style, k, p, 100, 176, 20, 30)
    if kind == 'plague':  # Чумной шпиль
        return ground + plinth + f'<path d="M70 176L90 30L100 6L110 30L130 176Z" fill="{p["dark"]}" stroke="{L}" stroke-width="2.5"/><path d="M100 6V176" stroke="{p["trim"]}" stroke-width="2"/>' + ''.join(f'<circle cx="{100 + dx}" cy="{y}" r="{r}" fill="#7ab040" opacity=".55" class="glowpulse"/>' for dx, y, r in ((-20, 40, 14), (22, 70, 12), (-16, 100, 10), (0, 20, 16))) + emblem(style, k, p, 100, 130, 10)
    if kind == 'motorpool':  # техцех: ангар с большими воротами, кран-балка, силуэт машины внутри
        return (ground + plinth + facade(style, k, p, 22, 96, 156, 80) + roof(style, k, p, 22, 96, 156)
                + f'<rect x="56" y="112" width="88" height="64" fill="{L}"/><path d="M56 112H144" stroke="{p["trim"]}" stroke-width="4"/>'
                + ''.join(f'<path d="M{x} 116V176" stroke="{p["dark"]}" stroke-width="2"/>' for x in range(64, 144, 10))
                + f'<path d="M70 168L76 150H118L126 168Z" fill="{p["main"]}" opacity=".5"/><circle cx="82" cy="170" r="6" fill="{p["dark"]}"/><circle cx="114" cy="170" r="6" fill="{p["dark"]}"/>'
                + f'<path d="M150 96V40H176V48H158V96" fill="none" stroke="{p["main"]}" stroke-width="4"/><path d="M172 48V70" stroke="{L}" stroke-width="1.5"/><rect x="167" y="70" width="10" height="8" fill="{T}" stroke="{L}"/>' + emblem(style, k, p, 40, 130, 9))
    if kind == 'yard':  # верфь титана: леса-гантри, недостроенный каркас титана
        scaff = ''.join(f'<path d="M{x} 186V20" stroke="{p["main"]}" stroke-width="6"/><path d="M{x} 186V20" stroke="{L}" stroke-width="1.5"/>' for x in (14, 186)) + ''.join(f'<path d="M14 {y}H186" stroke="{p["dark"]}" stroke-width="4"/>' for y in (40, 90, 140))
        frame = (f'<path d="M78 186L84 120H116L122 186" fill="none" stroke="{p["trim"]}" stroke-width="5"/><path d="M70 120L66 60Q100 40 134 60L130 120Z" fill="{p["dark"]}" stroke="{p["trim"]}" stroke-width="3"/>'
                 f'<path d="M80 70H120M76 96H124" stroke="{p["trim"]}" stroke-width="2"/><circle cx="100" cy="82" r="10" fill="{G}" class="glowpulse"/><path d="M84 40Q100 24 116 40L112 60H88Z" fill="{p["main"]}" stroke="{L}" stroke-width="2"/>')
        sparks = ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="{p["glow"]}" class="glowpulse"/>' for x, y in ((66, 64), (134, 98), (90, 126), (112, 150)))
        return '<ellipse cx="100" cy="192" rx="94" ry="7" fill="#000" opacity=".5"/>' + f'<rect x="8" y="182" width="184" height="10" fill="{p["dark"]}" stroke="{L}"/>' + scaff + frame + sparks + roof(style, k, p, 8, 20, 184) + emblem(style, k, p, 100, 168, 9)
    if kind == 'pylon':  # Гаусс-пилон: высокий обелиск, между рогами бьёт молния
        return (ground + plinth + f'<path d="M84 176L90 50H110L116 176Z" fill="{M}" stroke="{L}" stroke-width="2"/><path d="M90 50L80 20L94 40M110 50L120 20L106 40" fill="none" stroke="{p["trim"]}" stroke-width="4"/>'
                + f'<path d="M82 22L92 32L100 22L108 32L118 22" fill="none" stroke="{p["glow"]}" stroke-width="2.5" class="glowpulse"/><circle cx="100" cy="30" r="10" fill="{G}" class="glowpulse"/><path d="M92 70V170M108 70V170" stroke="{p["glow"]}" stroke-width="1.5" opacity=".7" class="glowpulse"/>' + emblem(style, k, p, 100, 120, 9))
    if kind == 'fturret':  # Огнемётная печь: пузатая печь с соплом и пламенем
        return (ground + plinth + f'<path d="M50 176Q44 110 100 104Q156 110 150 176Z" fill="{M}" stroke="{L}" stroke-width="2"/><rect x="66" y="136" width="40" height="22" fill="{G}" class="glowpulse"/><path d="M66 136V158M76 136V158M86 136V158M96 136V158" stroke="{L}" stroke-width="2"/>'
                + f'<path d="M120 124H176V140H120Z" fill="{p["dark"]}" stroke="{L}" stroke-width="1.5"/><path d="M176 122L194 116V148L176 142Z" fill="{p["trim"]}" stroke="{L}"/><path d="M186 132Q196 120 200 132Q196 144 186 132Z" fill="#ff9a3a" class="glowpulse"/>'
                + f'<rect x="80" y="70" width="14" height="36" fill="{p["dark"]}" stroke="{L}"/><circle cx="87" cy="64" r="8" fill="#666" opacity=".5" class="glowpulse"/>' + roof(style, k, p, 60, 108, 80))
    if kind == 'bigbutton':  # Большая Красная Кнопка: пусковая шахта, ракета, огромная кнопка
        return (ground + plinth + f'<rect x="40" y="96" width="70" height="80" fill="{M}" stroke="{L}" stroke-width="2"/><path d="M50 96L75 20L100 96Z" fill="{p["cloth"]}" stroke="{L}" stroke-width="2"/><path d="M58 70H92" stroke="{p["trim"]}" stroke-width="4" stroke-dasharray="6 4"/>'
                + f'<path d="M40 176H110" stroke="{p["trim"]}" stroke-width="6" stroke-dasharray="8 8"/><rect x="122" y="140" width="46" height="36" fill="{p["dark"]}" stroke="{L}" stroke-width="2"/><ellipse cx="145" cy="138" rx="20" ry="8" fill="#c8241a" stroke="{L}" stroke-width="2"/><ellipse cx="145" cy="134" rx="16" ry="6" fill="#ff4a3a" class="glowpulse"/>' + emblem(style, k, p, 75, 130, 10))
    raise KeyError(kind)


BUILD_KINDS = {'key1': 'Ключевое здание I', 'key2': 'Ключевое здание II', 'key3': 'Ключевое здание III', 'key4': 'Ключевое здание IV', 'gate': 'Врата легенд',
               'foundry': 'Литейня', 'pump': 'Насос', 'wall': 'Стена', 'wallgate': 'Ворота', 'bunker': 'Бункер', 'mine': 'Мина'}


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
    for f in ('order', 'undead', 'prism', 'clockwork', 'orks', 'ashen'):  # постройки фракций (у Ордена — только новые: свои есть в дизайн-системе)
        p = PAL[f]
        kinds = dict({} if f == 'order' else BUILD_KINDS, motorpool='Техцех', yard='Верфь титана', **({'bell': 'Колокол Скорби', 'plague': 'Чумной шпиль'} if f == 'undead' else {}), **({'pylon': 'Гаусс-пилон'} if f == 'clockwork' else {}), **({'fturret': 'Огнемётная печь', 'bigbutton': 'Большая Красная Кнопка'} if f == 'orks' else {}))
        for kind, title in kinds.items():
            k = f[:3] + kind
            s = svg(title, structure('undead' if f == 'order' else f, k, p, kind), k, p, 200, 200, '0 0 200 200')  # Орден — готика, как Нежить, но в золоте
            for d in OUT:
                os.makedirs(os.path.join(d, 'Buildings', f), exist_ok=True)
                with open(os.path.join(d, 'Buildings', f, kind + '.svg'), 'w') as fh:
                    fh.write(s)
            n += 1
    print('спрайтов:', n)
