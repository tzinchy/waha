// Габариты моделей рас из модов (видимые слои в покое, метры DoW) → client/models3d/ua-sizes.ts.
// Клиент рисует юниты мода в масштабе DoW (×DOW_M), по этой таблице — полоса здоровья, рамка клика и силуэт.
// Запуск: npx tsx tools/ua-sizes.ts (нужен ua/ или ua-slim/).
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as THREE from 'three';

const root = existsSync('ua') ? 'ua/' : 'ua-slim/';
// модели грузятся в браузерном коде: подменяем fetch чтением с диска, DOM для иконок не нужен
Object.assign(globalThis, {
  document: { createElement: () => { throw new Error('нет DOM'); } },
  fetch: async (u: string) => {
    const b = await readFile(root + decodeURI(u).replace(/^\/ua\//, '')).catch(() => null);
    return b ? { ok: true, arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.length) } : { ok: false };
  },
});
const M = await import('../client/models3d/ua-models.ts');
const { MOD_RACES } = await import('../shared/sim.ts');
await M.uaReady;

const out: Record<string, [number, number]> = {};
for (const [f, pack] of [['tyranids', 'tyranids'], ['inquisition', 'legion']] as const) {
  const race = MOD_RACES[f];
  for (const k of [...Object.keys(race.unit), ...Object.keys(race.build), 'legend']) {
    const mk = M.uaActor(pack, k as never);
    if (!mk) continue;
    const a = mk(), b = new THREE.Box3();
    a.pose('idle', 0); a.root.updateMatrixWorld(true);
    a.root.traverse((o) => { let v = true; for (let p: THREE.Object3D | null = o; p; p = p.parent) v &&= p.visible; if (v && (o as THREE.Mesh).isMesh) b.expandByObject(o); });
    if (b.isEmpty()) continue; // в покое ничего не видно (слои по клипам) — клиент возьмёт ширину роли
    const s = b.getSize(new THREE.Vector3()), r = (x: number) => Math.round(x * 10) / 10;
    out[`${f}/${k}`] = [r(Math.min(s.x, s.z) * 0.5 + Math.max(s.x, s.z) * 0.5), r(s.y)];
  }
}
await writeFile('client/models3d/ua-sizes.ts', `// Сгенерировано tools/ua-sizes.ts. Не править руками.\n/** «раса/вид» → [ширина, высота] видимой модели в покое, метры DoW. */\nexport const UA_SIZE: Record<string, [number, number]> = ${JSON.stringify(out)};\n`);
console.log('ok', Object.keys(out).length, 'моделей');
