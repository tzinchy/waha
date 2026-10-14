import assert from 'node:assert/strict';
import { test } from 'node:test';
import { atlasDirection, atlasFrame, atlasUV, validateAtlas, type AtlasMetadata } from '../client/sprite-atlas.ts';
const atlas: AtlasMetadata = { cellWidth: 160, cellHeight: 192, columns: 3, rows: 8, duration: 1, loop: false,
  anchor: { x: 80, y: 150 }, directionsDegrees: [0,45,90,135,180,225,270,315], camera: { orthographicHeight: 6, azimuthDegrees: 45 },
  frames: Array.from({length:8}, (_,r) => [0,0.3,1].map((time,c)=>({x:c*160,y:r*192,w:160,h:192,time}))) };
test('non-looping death holds the last authored frame; looping motion uses timestamps',()=>{
  assert.equal(atlasFrame(atlas, 10, 0).x,320);
  assert.equal(atlasFrame({...atlas,loop:true}, 1.35, 0).x,160);
  assert.equal(atlasFrame(atlas, -1, -1).y,7*192);
});
test('rectangular authored frames get texel-inset UVs and validated anchors',()=>{
  assert.equal(validateAtlas(atlas),atlas);
  const uv=atlasUV(atlas,atlas.frames[0][0]);
  assert.ok(uv.x>0 && uv.x+uv.w<1/3 && uv.y+uv.h<1);
  assert.throws(()=>validateAtlas({...atlas,anchor:{x:999,y:0}}));
  assert.throws(()=>validateAtlas({...atlas,frames:[[]]}));
});
test('direction includes source camera azimuth and simulation +X forward',()=>{
  assert.equal(atlasDirection(atlas,0,0),3);
  assert.equal(atlasDirection(atlas,Math.PI/2,0),1);
  assert.equal(atlasDirection(atlas,0,Math.PI/2),1);
});
