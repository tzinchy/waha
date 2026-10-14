/** Atlas lifecycle checks used by the browser QA harness; no simulation or resource changes. */
import * as THREE from 'three';
import { SpriteActor } from './sprite-actor.ts';
import type { FactionId } from './faction-models.ts';
export async function verifySpriteLifecycle(faction: FactionId) {
  const root = new THREE.Group(), actor = new SpriteActor(faction, 'guard', root);
  try {
    if (!await actor.ready) throw Error('Existing guard atlas failed to load');
    actor.update(0.1, 'idle', 0, 0, true, 2);
    const count = actor.squad.filter(s => s.visible).length;
    actor.update(0.1, 'idle', 0, 0, false, 0);
    const deadline = performance.now() + 10000;
    while (!String((actor.sprite.material.map?.image as HTMLImageElement | undefined)?.src).endsWith('/death.png')) {
      if (performance.now() > deadline) throw Error('Death atlas did not load');
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    actor.update(3, 'idle', 0, 0, false, 0);
    const first = actor.sprite.material.map!.offset.toArray();
    actor.update(3, 'idle', 0, 0, false, 0);
    const second = actor.sprite.material.map!.offset.toArray();
    actor.update(0.1, 'idle', 0, 0, true, 5);
    const revived = actor.squad.filter(s => s.visible).length;
    const anchor = actor.sprite.center.toArray();
    actor.dispose();
    const removed = root.children.length === 0;
    return { members: count, revived, anchor, frozenDeath: JSON.stringify(first) === JSON.stringify(second), removed };
  } finally { actor.dispose(); }
}
