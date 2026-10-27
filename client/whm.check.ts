// Самопроверка загрузчика на файлах мода: npx tsx client/whm.check.ts (нужна распакованная папка ua/).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert';
import { parseWhm, parseRsh } from './whm.ts';

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk('ua'), buf = (f: string) => { const b = readFileSync(f); return b.buffer.slice(b.byteOffset, b.byteOffset + b.length) as ArrayBuffer; };
let n = 0;
const bad: string[] = [];
for (const f of files.filter((f) => /\.whm$/i.test(f))) {
  try {
    const m = parseWhm(buf(f));
    for (const s of m.meshes) {
      const nv = s.pos.length / 3;
      assert(s.pos.every(Number.isFinite), `${s.name}: позиции`);
      for (const g of s.groups) assert(g.index.every((i) => i < nv), `${s.name}: индекс вне меша`);
      if (s.skinWeight.length) assert(s.skinIndex.every((i) => i < m.bones.length), `${s.name}: кость вне скелета`);
    }
    for (const a of m.anims) assert(a.duration >= 0 && a.bones.every((b) => b.rot.every((k) => k.every(Number.isFinite))), `${a.name}: анимация`);
    n++;
  } catch (e) { bad.push(`${f}: ${(e as Error).message}`); }
}
const rsh = files.filter((f) => /\.rsh$/i.test(f));
for (const f of rsh) try { const t = parseRsh(buf(f)); assert(t.width > 0 && t.rgba.length === t.width * t.height * 4, f); } catch (e) { bad.push(`${f}: ${(e as Error).message}`); }
console.log(`ok: ${n} whm, ${rsh.length} rsh, не читаются: ${bad.length}`);
for (const b of bad.slice(0, 15)) console.log('  ', b);
if (bad.length) process.exitCode = 1;
