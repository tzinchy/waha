// Справочник всех юнитов, турелей и зданий фракций: 3D-модель + цифры из симуляции (dev-инструмент, в сборку не входит): /units.html
import * as THREE from 'three';
import { FactionActor, ROLE_MOTIONS, motionDuration, type FactionId as Pack } from './models3d/faction-models.ts';
import { StructureActor, STRUCTURE_ROLE_MOTIONS, structureMotionDuration } from './models3d/structure-models.ts';
import { UNIT_ROLE, GOD_PACK, STRUCT_ROLE } from './world3d.ts';
import { BUILD_NAME, ARCH_OPTS, FACTIONS, FACTION_IDS, HQ_NAME, PACK, PROD_NAME, ROSTER, type FactionId } from '../shared/factions.ts';
import { AEGIS, BELL, CLOSE, FACTION_ONLY, MIN_RANGE, PORTAL, PYRE, ROLES, SETUP, STATS, STRUCT_AOE, BUILD_TIER, dmgOf, flies, maxHp, modOf, producible, type Kind } from '../shared/sim.ts';

const PX = 200, r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
r.setSize(PX, PX, false); r.setClearColor(0, 0); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.2;
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2));
const sun = new THREE.DirectionalLight(0xffe2b5, 2.6); sun.position.set(-4, 8, 6); scene.add(sun);
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 500);

const NAME: Partial<Record<Kind, string>> = { khorne: 'Кровопускатели Кхорна', nurgle: 'Чумоносцы Нургла', tzeentch: 'Розовые ужасы Тзинча', slaanesh: 'Демонетки Слаанеш', barracks: 'Казарма', post: 'Пост на точке', foundry: 'Генератор', pump: 'Термогенератор на жиле', wall: 'Стена', bunker: 'Бункер', warpgate: 'Врата Варпа', portal: 'Теневой портал', battery: 'Батарея «Громобой»', pylon: 'Гаусс-пилон', rturret: 'Ракетная бочка', fturret: 'Огнемётная печь', pyre: 'Огненная яма', bell: 'Синаптический шпиль', aegis: 'Теневое поле', lighthouse: 'Вокс-маяк', obelisk: 'Обелиск Вечности', megagun: 'Мега-Пушка', plague: 'Споровый улей' };
const TYPE: Record<string, string> = { small: 'стрелковый', sniper: 'снайперский', heavy: 'противотанк.', melee: 'ближний бой', blast: 'взрывной' };
const AURA: Partial<Record<Kind, string>> = { pyre: `жжёт всех в ${PYRE.r} м: ${PYRE.dps}/с`, bell: `враги в ${BELL.r} м медленнее и слабее`, aegis: `купол ${AEGIS.r} м поглощает ${AEGIS.pool} урона`, portal: `свои в ${PORTAL.r} м видны врагу только с ${PORTAL.reveal} м`, lighthouse: 'обзор 70 м, свои −15% урона', plague: 'враги в 30 м теряют 1%/с', foundry: '+2 энергии/с', pump: '+4 энергии/с', post: 'держит точку, доход' };

type Make = () => { root: THREE.Object3D; pose: (m: never, t: number) => void };
const makers: Make[] = []; // по номеру карточки — для просмотра анимаций
function shot(make: Make) {
  makers.push(make);
  const a = make(); a.pose('idle' as never, 0.3); a.root.rotation.y = 0.5; scene.add(a.root);
  const b = new THREE.Box3().setFromObject(a.root), size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const d = (Math.max(size.y, size.x, size.z) / (2 * Math.tan((cam.fov * Math.PI) / 360))) * 1.2;
  cam.position.set(c.x + d * 0.35, c.y + d * 0.3, c.z + d * 0.9); cam.lookAt(c); cam.updateProjectionMatrix();
  r.render(scene, cam); scene.remove(a.root);
  return r.domElement.toDataURL();
}
/** Строка цифр: здоровье, урон, дальность, перезарядка, тип, особенности. */
function stats(f: FactionId, k: Kind) {
  const st = STATS[k], m = modOf(f, k), out: string[] = [`❤ ${maxHp(k)}`];
  if (st.dmg) {
    const dmg = Math.round(st.dmg * (m?.dmg ?? 1) * 10) / 10, aoe = m?.aoe ?? ROLES[k]?.aoe ?? STRUCT_AOE[k];
    out.push(`⚔ ${dmg}${st.n > 1 ? '×' + st.n : ''} · ${st.range + (m?.range ?? 0)} м · ${Math.round(st.cd * (m?.cd ?? 1) * 10) / 10} с · ${TYPE[m?.type ?? dmgOf(k, f)]}${aoe ? ` · площадь ${aoe} м` : ''}${MIN_RANGE[k] ?? m?.minRange ? ` · мёртвая зона ${MIN_RANGE[k] ?? m?.minRange} м` : ''}`);
  }
  if (CLOSE[k]) out.push(`вблизи ${CLOSE[k]!.range} м: ${CLOSE[k]!.dmg} · ${TYPE[CLOSE[k]!.type]}`);
  if (st.speed) out.push(`скорость ${st.speed}${flies(k, f) ? ' · летает' : ''}${SETUP.has(k) ? ' · на ходу не стреляет' : ''}`);
  out.push(`обзор ${st.sight} м`);
  if (AURA[k]) out.push(AURA[k]!);
  if (m?.info) out.push(`<b>${m.info}</b>`);
  return out.join('<br>');
}
const card = (img: string, name: string, k: string, info: string) => `<figure data-i="${makers.length - 1}" title="Клик — анимации"><img src="${img}"><figcaption><strong>${name}</strong><small>${k}</small><span>${info}</span></figcaption></figure>`;

const root = document.getElementById('g')!;
for (const f of FACTION_IDS) {
  const R = ROSTER[f] as unknown as Record<string, { name: string } | undefined>, F = FACTIONS[f], pack = PACK[f] as Pack;
  const unitName = (k: Kind) => k === 'builder' ? F.builder : k === 'guard' ? F.guard : R[k]?.name ?? NAME[k] ?? k;
  const heroes = (Object.keys(ARCH_OPTS[f]) as ('assault' | 'commander' | 'mystic')[]).map(a => card(shot(() => new FactionActor(pack, 'captain', a) as never), ARCH_OPTS[f][a]!.name, 'герой · ' + a, stats(f, 'captain') + '<br>' + ARCH_OPTS[f][a]!.info));
  const units: Kind[] = ['builder', ...producible('barracks'), ...producible('motorpool'), ...producible('yard'), ...(f === 'ashen' ? producible('warpgate') : [])];
  const unitCards = units.map(k => card(shot(() => new FactionActor(GOD_PACK[k] ?? pack, UNIT_ROLE[k]!) as never), unitName(k), k, stats(f, k) + `<br>тир ${ROLES[k]!.tier} · ${STATS[k].cost}◆ ${ROLES[k]!.energy ?? 0}ϟ${ROLES[k]!.relics ? ` ${ROLES[k]!.relics}⌂` : ''}`));
  const builds = (Object.keys(BUILD_TIER) as Kind[]).filter(k => k !== 'mine' && k !== 'wallgate' && STRUCT_ROLE[k] && (!(k in FACTION_ONLY) || FACTION_ONLY[k as 'aegis'] === f));
  const bName = (k: Kind) => k === 'hq' ? HQ_NAME[f] : k in BUILD_NAME[f] ? BUILD_NAME[f][k as 'post'] : k === 'motorpool' || k === 'yard' ? PROD_NAME[f][k] : /^key[1-4]$/.test(k) ? F.keys[Number(k[3]) - 1] : k === 'gate' ? F.gate : NAME[k] ?? k;
  const buildCards = builds.map(k => card(shot(() => new StructureActor(pack, STRUCT_ROLE[k]!, /^key[1-4]$/.test(k) ? Math.min(3, Number(k[3])) : 1) as never), bName(k), k, stats(f, k) + `<br>тир ${BUILD_TIER[k as 'hq']} · ${STATS[k].cost}◆`));
  const UPG: [Kind, number, string][] = [['hq', 2, 'тир III–IV'], ['hq', 3, 'тир V'], ['post', 2, 'укреплён: −50% урона, доход +3'], ['post', 3, 'стреляет: 14 урона, 12 м'], ['turret', 2, 'тяжёлая: урон ×1.8, +3 м, броня'], ['wall', 2, 'укреплена: −50% урона']];
  buildCards.push(...UPG.map(([k, l, info]) => card(shot(() => new StructureActor(pack, STRUCT_ROLE[k]!, l) as never), `${bName(k)} · ур. ${l}`, k, info)));
  root.insertAdjacentHTML('beforeend', `<h2>${F.name}</h2><p class="mech">${F.mech}</p><h3>Юниты</h3><div class="row">${heroes.join('')}${unitCards.join('')}</div><h3>Здания и турели</h3><div class="row">${buildCards.join('')}</div>`);
}

// ---- просмотр анимаций: клик по карточке — живая модель и кнопки всех её движений ----
const box = document.getElementById('anim')!, view = box.querySelector('canvas')!, bar = box.querySelector('nav')!;
const vr = new THREE.WebGLRenderer({ canvas: view, antialias: true, alpha: true });
vr.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
view.style.imageRendering = 'auto';
const viewSize = new THREE.Vector2();
vr.outputColorSpace = THREE.SRGBColorSpace; vr.toneMapping = THREE.ACESFilmicToneMapping; vr.toneMappingExposure = 1.2;
const vs = new THREE.Scene(); vs.add(new THREE.HemisphereLight(0xdfe7ec, 0x3b3128, 2.2)); const vsun = new THREE.DirectionalLight(0xffe2b5, 2.6); vsun.position.set(-4, 8, 6); vs.add(vsun);
const vc = new THREE.PerspectiveCamera(30, 1, 0.01, 500);
let cur: { a: ReturnType<Make>; motion: string; dur: (m: string) => number; t0: number } | undefined;
root.addEventListener('click', e => {
  const fig = (e.target as HTMLElement).closest<HTMLElement>('figure[data-i]');
  if (!fig) return;
  if (cur) vs.remove(cur.a.root);
  const a = makers[Number(fig.dataset.i)](), structure = a instanceof StructureActor;
  const motions: string[] = structure ? STRUCTURE_ROLE_MOTIONS[(a as StructureActor).role] : ROLE_MOTIONS[(a as unknown as FactionActor).role];
  a.pose('idle' as never, 0); vs.add(a.root);
  const b = new THREE.Box3().setFromObject(a.root), size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const d = (Math.max(size.y, size.x, size.z) / (2 * Math.tan((vc.fov * Math.PI) / 360))) * 1.5;
  vc.position.set(c.x + d * 0.4, c.y + d * 0.35, c.z + d * 0.85); vc.lookAt(c);
  cur = { a, motion: 'idle', dur: m => (structure ? structureMotionDuration(m as never) : motionDuration(m as never)), t0: performance.now() };
  box.querySelector('h4')!.textContent = fig.querySelector('strong')!.textContent;
  bar.innerHTML = motions.map(m => `<button data-m="${m}"${m === 'idle' ? ' class="on"' : ''}>${m}</button>`).join('');
  box.hidden = false;
});
bar.addEventListener('click', e => { const m = (e.target as HTMLElement).dataset.m; if (!m || !cur) return; cur.motion = m; cur.t0 = performance.now(); bar.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.m === m)); });
box.addEventListener('click', e => { if (e.target === box) box.hidden = true; });
(function loop() {
  if (cur && !box.hidden) {
    const w = view.clientWidth, h = view.clientHeight;
    if(w && h) {
      const ratio=Math.min(devicePixelRatio || 1, 2);
      if(vr.getPixelRatio()!==ratio)vr.setPixelRatio(ratio);
      vr.getSize(viewSize);
      if (viewSize.x !== w || viewSize.y !== h) { vr.setSize(w, h, false); vc.aspect = w / h; vc.updateProjectionMatrix(); }
      const t = (performance.now() - cur.t0) / 1000, dur = cur.dur(cur.motion);
      cur.a.pose(cur.motion as never, t % (dur + 0.6)); // одиночные движения повторяются с паузой
      cur.a.root.rotation.y = 0.5 + Math.sin(performance.now() / 2500) * 0.6;
      vr.render(vs, vc);
    }
  }
  requestAnimationFrame(loop);
})();
