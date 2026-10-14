/** Import only an explicitly reviewed, technically valid authored atlas. No image resampling. */
import { readFile, mkdir, copyFile, writeFile, rename } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { PNG } from 'pngjs';
import { validateAtlas } from '../client/sprite-atlas.ts';
import { FACTIONS, UNITS, BUILDINGS } from './asset-catalog.mjs';
const flags={};
for(let i=2;i<process.argv.length;i+=2){const key=process.argv[i];if(!key.startsWith('--')||!process.argv[i+1])throw Error('Usage: node --import tsx scripts/import-atlas.mjs --faction legion --role captain --action walk --png source.png --json source.json --provenance review.json');flags[key.slice(2)]=process.argv[i+1];}
const {faction,role,action,png,json,provenance}=flags;
if(!FACTIONS.includes(faction)||![...UNITS,...BUILDINGS].includes(role)||!action||!/^[a-z_]+$/.test(action)||!png||!json||!provenance)throw Error('Invalid import arguments');
const meta=validateAtlas(JSON.parse(await readFile(json,'utf8'))),rights=JSON.parse(await readFile(provenance,'utf8'));
if(meta.faction!==faction||meta.role!==role||meta.animation!==action)throw Error('Faction/role/action do not match metadata');
if(meta.rows!==8||new Set(meta.directionsDegrees).size!==8)throw Error('Eight unique directions required');
if(!rights.source||!rights.rights||rights.visualQA?.status!=='accepted'||!rights.visualQA?.reviewer||!rights.visualQA?.evidence?.length)throw Error('Require source, rights and accepted visual QA with reviewer and evidence');
const bytes=await readFile(png),image=PNG.sync.read(bytes);
if(image.width!==meta.columns*meta.cellWidth||image.height!==meta.rows*meta.cellHeight)throw Error('PNG size disagrees with metadata');
let clear=false,visible=false;
for(let i=3;i<image.data.length;i+=4){clear ||= image.data[i]===0;visible ||= image.data[i]===255;}
if(!clear||!visible)throw Error('PNG needs a transparent background and visible opaque pixels');
for(const row of meta.frames)for(const f of row){
  let count=0;
  for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++)if(image.data[(y*image.width+x)*4+3]>35){
    count++;if(x===f.x||x===f.x+f.w-1||y===f.y||y===f.y+f.h-1)throw Error(`Sprite touches cell edge at ${f.x},${f.y}; supply transparent gutters`);
  }
  if(!count&&action!=='death')throw Error('Empty authored animation frame');
}
const dest=join('client/public/models/factions',faction,role,'sprites');await mkdir(dest,{recursive:true});
const old=join(dest,action+'.png');
// Preserve the previous working files as a migration source before replacement.
const backup=join('art-src/previous',faction,role,action);await mkdir(backup,{recursive:true});
for(const ext of ['png','json','provenance.json'])try{await copyFile(join(dest,action+'.'+ext),join(backup,basename(action+'.'+ext)));}catch(e){if(e.code!=='ENOENT')throw e;}
await writeFile(old+'.pending',bytes);await rename(old+'.pending',old);
await writeFile(join(dest,action+'.json'),JSON.stringify({...meta,image:action+'.png',provenance:{source:rights.source,kind:'authored-pixel-art',productionArtApproved:true}},null,2)+'\n');
await writeFile(join(dest,action+'.provenance.json'),JSON.stringify(rights,null,2)+'\n');
console.log('Imported reviewed atlas:',faction,role,action,image.width,image.height,'Run npm run assets:audit to refresh inventory.');
