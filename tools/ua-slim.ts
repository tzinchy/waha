// Отбор из ua/ только того, что клиент реально грузит: модели (.whm/.whe), их текстуры (.rsh), иконки (.tga), земля карт.
// Копирует в ua-slim/ с той же структурой — её можно отдавать по /ua/ вместо ua/ (8+ ГБ). Запуск: npx tsx tools/ua-slim.ts [карта…]
// Без аргументов — земля только Absolute Zero. ua/ не трогает. Для tools/ua-race.mjs и ua-map.mjs по-прежнему нужен полный ua/ (attrib, Locale, .sgb).
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ART, entry } from '../client/models3d/ua-models.ts';
import { parseWhm } from '../client/whm.ts';
import { MOD_RACES, type Kind } from '../shared/sim.ts';
import { MAPS } from '../shared/mapdata.ts';
import type { FactionId } from '../shared/factions.ts';

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
    if (whe) files.add(whe);
    if (whm) {
      files.add(whm);
      const b = readFileSync(join('ua', whm)), m = parseWhm(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
      for (const t of new Set(m.meshes.flatMap((s) => s.groups.map((g) => g.texture.toLowerCase())))) { const r = find(e.art.base, t + '.rsh'); if (r) files.add(r); }
    } else console.warn('нет модели', f, k, e.model);
    for (const ext of ['.tga', '.TGA']) { const r = e.icon && find(e.art.base, 'art/ui/ingame/' + e.icon.replace(/\\/g, '/').replace(/\.tga$/i, '') + ext); if (r) { files.add(r); break; } }
  }
}
for (const m of MAPS) if (m.ground && maps.includes(m.id)) files.add(m.ground.replace(/^\/ua\//, ''));
let bytes = 0;
for (const rel of files) {
  const to = join('ua-slim', rel);
  mkdirSync(dirname(to), { recursive: true }); copyFileSync(join('ua', rel), to); bytes += statSync(to).size;
}
console.log('ok ua-slim:', files.size, 'файлов,', (bytes / 1e6).toFixed(0), 'МБ; земля карт:', maps.join(', '));
