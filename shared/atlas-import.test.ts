import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), { PNG } = require('pngjs');
const script = resolve('scripts/import-atlas.mjs'), loader = require.resolve('tsx');
function fixture(edge: boolean) {
  const directory = mkdtempSync(join(tmpdir(), 'waha-atlas-import-'));
  const image = new PNG({width:4,height:32}); image.data.fill(0);
  for(let row=0;row<8;row++){const i=((row*4+1)*4+(edge?0:1))*4;image.data[i]=100;image.data[i+3]=255;}
  writeFileSync(join(directory,'source.png'),PNG.sync.write(image));
  const meta={faction:'legion',role:'captain',animation:'idle',cellWidth:4,cellHeight:4,columns:1,rows:8,duration:1,loop:true,anchor:{x:2,y:3},directionsDegrees:[0,45,90,135,180,225,270,315],frames:Array.from({length:8},(_,row)=>[{x:0,y:row*4,w:4,h:4,time:0}])};
  writeFileSync(join(directory,'source.json'),JSON.stringify(meta));
  writeFileSync(join(directory,'review.json'),JSON.stringify({source:'automated test fixture, not artwork',rights:'test pixels only',visualQA:{status:'accepted',reviewer:'test harness',evidence:['test fixture']}}));
  const dest=join(directory,'client/public/models/factions/legion/captain/sprites');mkdirSync(dest,{recursive:true});writeFileSync(join(dest,'idle.png'),'previous-working-bytes');
  return {directory,dest,run:()=>spawnSync(process.execPath,['--import',loader,script,'--faction','legion','--role','captain','--action','idle','--png','source.png','--json','source.json','--provenance','review.json'],{cwd:directory,encoding:'utf8'})};
}
test('clipped authored import is rejected before replacing the working atlas',()=>{
  const f=fixture(true);try{const result=f.run();assert.notEqual(result.status,0);assert.match(result.stderr,/touches cell edge/);assert.equal(readFileSync(join(f.dest,'idle.png'),'utf8'),'previous-working-bytes');assert.equal(existsSync(join(f.directory,'art-src/previous')),false);}finally{rmSync(f.directory,{recursive:true,force:true});}
});
test('reviewed import retains the previous atlas and writes matching JSON/provenance',()=>{
  const f=fixture(false);try{const result=f.run();assert.equal(result.status,0,result.stderr);assert.equal(readFileSync(join(f.directory,'art-src/previous/legion/captain/idle/idle.png'),'utf8'),'previous-working-bytes');const meta=JSON.parse(readFileSync(join(f.dest,'idle.json'),'utf8'));assert.equal(meta.image,'idle.png');assert.equal(meta.provenance.productionArtApproved,true);assert.ok(existsSync(join(f.dest,'idle.provenance.json')));}finally{rmSync(f.directory,{recursive:true,force:true});}
});
