// Отбор из ua/ только того, что клиент реально грузит: модели (.whm/.whe), их текстуры (.rsh), иконки (.tga), земля карт (.tga + .sgb),
// эффекты выстрелов и ударов (art/fx/*.lua из событий .whe и попаданий оружия .events + их текстуры) и карта попаданий fx-hits.json.
// Копирует в ua-slim/ с той же структурой — её можно отдавать по /ua/ вместо ua/ (8+ ГБ). Запуск: npx tsx tools/ua-slim.ts [карта…]
// Без аргументов — земля Absolute Zero. ua/ не трогает. Для tools/ua-race.mjs и ua-map.mjs по-прежнему нужен полный ua/ (attrib, Locale, .sgb).
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ART, entry, fireMotions } from '../client/models3d/ua-models.ts';
import { eventsFile, FX_BASES, fxFile, fxTextures, parseFxLua, texAlts } from '../client/models3d/ua-fx.ts';
import { parseWhe, parseWhm } from '../client/whm.ts';
import { MOD_RACES, UA_WEAPONS, type Kind } from '../shared/sim.ts';
import { MAPS } from '../shared/mapdata.ts';
import type { FactionId } from '../shared/factions.ts';

const read = (rel: string) => { const b = readFileSync(join('ua', rel)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength); };
const fxs = new Set<string>(); // пути эффектов из событий
const maps = process.argv.slice(2).length ? process.argv.slice(2) : ['zero'];
const files = new Set<string>(); // пути от /ua/
/** Первый существующий файл в папках мода (как first() в клиенте); регистр в путях бывает разный — пробуем как есть и в нижнем. */
const find = (bases: string[], path: string) => {
  for (const b of bases) for (const p of [path, path.toLowerCase()]) { const rel = b.replace(/^\/ua\//, '') + p; if (existsSync(join('ua', rel))) return rel; }
  return null;
};
for (const f of Object.keys(ART) as FactionId[]) {
  const race = MOD_RACES[f as keyof typeof MOD_RACES], art = ART[f]!;
  const kinds = [...Object.keys(race.unit), ...Object.keys(race.build), ...Object.keys(art.extra ?? {})].map((k) => [k, 0] as const);
  for (const [k, v] of [...kinds, ...race.legends.map((_, i) => ['legend', i] as const)]) {
    const e = entry(f, k as Kind, v);
    if (!e) continue;
    const whm = find(e.art.base, 'art/ebps/' + e.model + '.whm'), whe = find(e.art.base, 'art/ebps/' + e.model + '.whe');
    if (whe) { files.add(whe); const w = parseWhe(read(whe)); for (const m of ['shoot', 'attack']) for (const mo of fireMotions(w, m, UA_WEAPONS[f]?.[k as Kind] ?? [])) for (const [n] of w.motions.get(mo)!.ev ?? []) { const fx = w.events.get(n)?.fx; if (fx) fxs.add(fx); } }
    if (whm) {
      files.add(whm);
      const b = readFileSync(join('ua', whm)), m = parseWhm(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
      for (const t of new Set(m.meshes.flatMap((s) => s.groups.map((g) => g.texture.toLowerCase())))) { const r = find(e.art.base, t + '.rsh'); if (r) files.add(r); }
    } else console.warn('нет модели', f, k, e.model);
    for (const ext of ['.tga', '.TGA']) { const r = e.icon && find(e.art.base, 'art/ui/ingame/' + e.icon.replace(/\\/g, '/').replace(/\.tga$/i, '') + ext); if (r) { files.add(r); break; } }
  }
}
for (const m of MAPS) if (m.ground && maps.includes(m.id)) for (const ext of ['.tga', '.sgb']) files.add(m.ground.replace(/^\/ua\//, '').replace(/\.tga$/i, ext)); // текстура + рельеф (.sgb)
// попадания: в .rgd оружия после type_surface\tp_<поверхность>.lua идёт путь события (art/events/…); ponytail: по порядку строк, без разбора хэшей
const hits: Record<string, Record<string, string>> = {};
for (const w of new Set(Object.values(UA_WEAPONS).flatMap((by) => Object.values(by ?? {}).flat()))) {
  const rgd = join('ua/UltimateApocalypse_THB/data/attrib/weapon', w + '.rgd');
  if (!existsSync(rgd)) continue;
  const strs = readFileSync(rgd).toString('latin1').match(/[\x20-\x7e]{3,}/g) ?? [];
  strs.forEach((x, i) => {
    const sf = /type_surface\\tp_(\w+)\.lua/.exec(x)?.[1], raw = strs[i + 1];
    if (!sf || !raw || /\.lua$/i.test(raw)) return;
    // большинство событий попаданий — из оригинальной DoW (её в ua/ нет); голое имя ищем и в unit_impact_events мода
    const ev = [raw, 'unit_impact_events/' + raw.split(/[\\/]/).pop()].find((e) => find(FX_BASES, eventsFile(e))), rel = ev && find(FX_BASES, eventsFile(ev));
    if (!rel) return;
    files.add(rel); (hits[w] ??= {})[sf!] = ev;
    for (const e of parseWhe(read(rel)).events.values()) if (e.fx) fxs.add(e.fx);
  });
}
let noFx = 0;
for (const fx of fxs) {
  const rel = find(FX_BASES, fxFile(fx));
  if (!rel) { noFx++; continue; }
  files.add(rel);
  try { for (const t of fxTextures(parseFxLua(readFileSync(join('ua', rel), 'latin1')))) for (const a of texAlts(t)) { const r = find(FX_BASES, a); if (r) { files.add(r); break; } } } catch { console.warn('fx не разобран', rel); }
}
writeFileSync('ua-slim/fx-hits.json', JSON.stringify(hits));
console.log('эффекты:', fxs.size - noFx, 'из', fxs.size, '(остальные — из оригинальной DoW, её в ua/ нет)');
let bytes = 0;
for (const rel of files) {
  const to = join('ua-slim', rel);
  mkdirSync(dirname(to), { recursive: true }); copyFileSync(join('ua', rel), to); bytes += statSync(to).size;
}
console.log('ok ua-slim:', files.size, 'файлов,', (bytes / 1e6).toFixed(0), 'МБ; земля карт:', maps.join(', '));
