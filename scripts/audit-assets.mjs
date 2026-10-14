/** Inventory the files on disk; technical validity does not imply artistic approval. */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { PNG } from 'pngjs';
import { validateAtlas } from '../client/sprite-atlas.ts';
import { FACTIONS, UNITS, BUILDINGS, motions } from './asset-catalog.mjs';
const root='client/public/models/factions';
const paths=(await readdir(root,{recursive:true})).filter(p=>/\.(glb|png)$/.test(p)).sort();
const errors=[],warnings=[],records=[],models=[];
let clips=0,totalBytes=0,approved=0;
for(const path of paths){
  const data=await readFile(join(root,path));totalBytes+=data.length;
  const [faction,role]=path.split('/');
  try{
    if(path.endsWith('.glb')){
      if(data.toString('ascii',0,4)!=='glTF'||data.readUInt32LE(4)!==2||data.readUInt32LE(8)!==data.length||data.toString('ascii',16,20)!=='JSON')throw Error('Invalid GLB header/length');
      const gltf=JSON.parse(data.toString('utf8',20,20+data.readUInt32LE(12)));
      const animations=(gltf.animations??[]).map(a=>a.name);clips+=animations.length;
      const pngs=paths.filter(p=>p.startsWith(`${faction}/${role}/sprites/`)&&p.endsWith('.png')).map(p=>basename(p,'.png'));
      models.push({faction,role,file:path,bytes:data.length,animations:pngs,glbAnimations:animations});
      records.push({file:path,bytes:data.length,glbAnimations:animations,technical:'pass',art:'prototype',runtime:BUILDINGS.slice(0,4).includes(role)||['captain','guard','builder'].includes(role)});
      continue;
    }
    const png=PNG.sync.read(data);
    const meta=validateAtlas(JSON.parse(await readFile(join(root,path.replace(/\.png$/,'.json')),'utf8')));
    if(meta.faction!==faction||meta.role!==role||meta.animation!==basename(path,'.png'))throw Error('Atlas identity disagrees with path');
    if(png.width!==meta.cellWidth*meta.columns||png.height!==meta.cellHeight*meta.rows)throw Error('PNG dimensions disagree with JSON');
    let transparent=0,opaque=0,partial=0;
    for(let i=3;i<png.data.length;i+=4){const alpha=png.data[i];if(alpha===0)transparent++;else if(alpha===255)opaque++;else partial++;}
    if(!transparent||!opaque)throw Error('Atlas needs both visible pixels and transparent background');
    const cells=[];
    for(const row of meta.frames)for(const f of row){
      let count=0,edge=0;
      for(let y=f.y;y<f.y+f.h;y++)for(let x=f.x;x<f.x+f.w;x++){
        if(png.data[(y*png.width+x)*4+3]>35){count++;if(x===f.x||x===f.x+f.w-1||y===f.y||y===f.y+f.h-1)edge++;}
      }
      cells.push({visiblePixels:count,edgePixels:edge});
    }
    if(cells.some(c=>c.edgePixels))warnings.push({file:path,issue:'silhouette touches a frame boundary',frames:cells.filter(c=>c.edgePixels).length});
    if(cells.some(c=>!c.visiblePixels))warnings.push({file:path,issue:'empty animation cells',frames:cells.filter(c=>!c.visiblePixels).length});
    if(meta.image!==basename(path))warnings.push({file:path,issue:'metadata image name disagrees with atlas filename',image:meta.image});
    const authored = meta.provenance?.kind === 'authored-pixel-art' && meta.provenance?.productionArtApproved === true;
    let accepted = false;
    if (authored) {
      const review = JSON.parse(await readFile(join(root,path.replace(/\.png$/,'.provenance.json')),'utf8'));
      accepted = review.visualQA?.status === 'accepted' && !!review.visualQA?.reviewer && !!review.visualQA?.evidence?.length && !!review.source && !!review.rights;
      if (!accepted) throw Error('Authored atlas lacks accepted provenance/visual QA');
      approved++;
    }
    records.push({file:path,bytes:data.length,width:png.width,height:png.height,frames:cells.length,transparentPixels:transparent,partialAlphaPixels:partial,cells,technical:'pass',art:accepted?'accepted-authored':'prototype',runtime:['captain','guard','builder'].includes(role)});
  }catch(e){errors.push({file:path,issue:String(e)});}
}
const missing=[];
for(const f of FACTIONS)for(const r of [...UNITS,...BUILDINGS]){
  if(!paths.includes(`${f}/${r}/model.glb`))missing.push(`${f}/${r}/model.glb`);
  if(UNITS.includes(r))for(const a of motions(r))for(const ext of ['png','json']){const file=`${f}/${r}/sprites/${a}.${ext}`;try{await readFile(join(root,file));}catch{missing.push(file);}}
}
const report={version:1,scope:'Technical inventory only. Procedural atlas art remains unapproved.',summary:{models:models.length,glbAnimationClips:clips,spriteAtlases:paths.filter(p=>p.endsWith('.png')).length,bytes:totalBytes,errors:errors.length,warnings:warnings.length,missing:missing.length,productionArtApproved:approved},factions:FACTIONS.map(f=>({faction:f,models:models.filter(m=>m.faction===f).length,spriteAtlases:records.filter(r=>r.file.startsWith(f+'/')&&r.file.endsWith('.png')).length,productionArtApproved:records.filter(r=>r.file.startsWith(f+'/')&&r.art==='accepted-authored').length})),missing,errors,warnings,files:records};
if(process.argv.includes('--write')){
  await mkdir('assets',{recursive:true});await writeFile('assets/art-audit.json',JSON.stringify(report,null,2)+'\n');
  let meshyFiles=[];try{meshyFiles=(await readdir('client/public/models/meshy',{recursive:true})).filter(p=>p.endsWith('.glb')).sort();}catch(e){if(e.code!=='ENOENT')throw e;}
  await writeFile('client/public/models/meshy-manifest.json',JSON.stringify({version:1,files:meshyFiles},null,2)+'\n');
  await writeFile(join(root,'manifest.json'),JSON.stringify({version:2,quality:`${approved} approved authored atlases; all other atlas art remains procedural prototype`,generator:'scripts/audit-assets.mjs (inventory from physical files)',models:models.length,animationClips:clips,spriteAtlases:report.summary.spriteAtlases,atlases:records.filter(r=>r.file.endsWith('.png')).map(r=>({file:r.file,art:r.art})),files:models},null,2)+'\n');
}
console.log(JSON.stringify(report.summary,null,2));
if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
if(process.argv.includes('--require-complete')&&missing.length){console.error('Missing required prototype assets:',missing.length);process.exitCode=1;}
