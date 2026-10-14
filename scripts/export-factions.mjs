/**
 * Deterministic browser-based asset exporter for the procedural faction catalog.
 * The browser renders GLB + eight-direction PNG atlases. A local-only upload endpoint
 * saves files directly; no base64 transfers and no dependency on GitHub browser downloads.
 */
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import { validateAtlas } from '../client/sprite-atlas.ts';
import { FACTIONS, UNITS, BUILDINGS, motions } from './asset-catalog.mjs';

const missingOnly = process.env.EXPORT_SCOPE !== 'all';
const dest = 'client/public/models/factions';
const filter = process.env.EXPORT_FILTER;
const selectedActions = process.env.EXPORT_ACTIONS?.split(',');
if (filter && !FACTIONS.some(f=>[...UNITS,...BUILDINGS].some(r=>filter===f+'/'+r))) throw Error('Unknown export filter: '+filter);
const exists = async path => {
  try {
    const bytes=await readFile(join(dest,path));
    if(path.endsWith('.png')){const png=PNG.sync.read(bytes);return png.width>0&&png.height>0;}
    if(path.endsWith('.json')){validateAtlas(JSON.parse(bytes.toString()));return true;}
    return bytes.toString('ascii',0,4)==='glTF'&&bytes.readUInt32LE(8)===bytes.length;
  } catch { return false; }
};
const reviewed = async path => {
  try {const p=JSON.parse(await readFile(join(dest,path),'utf8'));return p.visualQA?.status==='accepted';}
  catch {return false;}
};
const targets = [];
for (const faction of FACTIONS) for (const role of [...UNITS,...BUILDINGS]) {
  if (filter && filter!==faction+'/'+role) continue;
  const model = !missingOnly || !(await exists(`${faction}/${role}/model.glb`));
  const actions = [];
  if (UNITS.includes(role)) for (const action of motions(role)) {
    if (selectedActions && !selectedActions.includes(action)) continue;
    if (await reviewed(`${faction}/${role}/sprites/${action}.provenance.json`)) continue;
    if (!missingOnly || !(await exists(`${faction}/${role}/sprites/${action}.png`)) || !(await exists(`${faction}/${role}/sprites/${action}.json`))) actions.push(action);
  }
  if (model || actions.length) targets.push({ faction, role, model, actions });
}
console.log('Procedural prototype export jobs:',targets.length,'scope:',missingOnly?'missing':'all');
// The exporter intentionally does not certify production art or replace authored atlases.
const files = [];
const server = createServer(async (req,res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') { res.writeHead(204); res.end(); return; }
  if(req.method!=='POST' || !req.url?.startsWith('/upload?')) {res.writeHead(404);res.end();return;}
  try {
    const relative = new URL(req.url,'http://localhost').searchParams.get('path') ?? '';
    if(!/^(legion|heretics|scrap|necrons|drukhari|daemons)\/(captain|guard|builder|sniper|heavy|flamer|elite|medic|transport|tank|walker|artillery|titan|hq|barracks|post|turret|generator|factory|armory|relic|wall|gate)\/(model\.glb|sprites\/[a-z_]+\.(png|json))$/.test(relative)) throw new Error('Invalid export path: '+relative);
    const chunks=[];for await(const chunk of req)chunks.push(chunk);
    const b=Buffer.concat(chunks);const file=join(dest,relative);
    await mkdir(dirname(file),{recursive:true});await writeFile(file,b);
    files.push({file:relative,bytes:b.byteLength});res.writeHead(200);res.end('ok');
  } catch(e) {res.writeHead(400);res.end(String(e));}
});
await new Promise(resolve=>server.listen(4174,'127.0.0.1',resolve));
const vite = spawn(process.execPath,['node_modules/vite/bin/vite.js','client','--host','127.0.0.1','--port','4173','--strictPort'],{stdio:'inherit'});
let browser;
try {
  for(let attempt=0;attempt<90;attempt++) {
    try {const r=await fetch('http://127.0.0.1:4173/asset-lab.html');if(r.ok)break;}catch{}
    await new Promise(r=>setTimeout(r,1000));
    if(attempt===89)throw Error('Vite failed to start');
  }
  browser=await chromium.launch({headless:true,executablePath:process.env.WAHA_CHROMIUM_PATH || undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-web-security']});
  const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
  page.on('console',m=>{if(m.type()==='error')console.error('[browser]',m.text())});
  page.on('pageerror',e=>console.error('[browser exception]',e.message));
  await page.goto('http://127.0.0.1:4173/asset-lab.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.assetLab?.glb,null,{timeout:120000});
  page.setDefaultTimeout(180000);
  for(const job of targets) {
    console.log('Exporting prototype:',job.faction,job.role,job.actions.join(','));
    const result=await page.evaluate(async job=>{
      const api=window.assetLab;
      const upload=async(path,bytes,type='application/octet-stream')=>{
        const response=await fetch('http://127.0.0.1:4174/upload?path='+encodeURIComponent(path),{method:'POST',body:bytes,headers:{'Content-Type':type}});
        if(!response.ok)throw Error(path+': '+await response.text());
      };
      const prefix=job.faction+'/'+job.role;
      if(job.model)await upload(prefix+'/model.glb',await api.glb(job.faction,job.role),'model/gltf-binary');
      for(const motion of job.actions){
        const data=await api.spriteAtlas(job.faction,job.role,motion);
        if(data.metadata.animation!==motion)throw Error('Exporter substituted '+data.metadata.animation+' for '+motion);
        data.metadata.image=motion+'.png';
        data.metadata.provenance={source:'client/faction-models.ts',kind:'procedural-prototype',productionArtApproved:false};
        await upload(prefix+'/sprites/'+motion+'.png',data.blob,'image/png');
        await upload(prefix+'/sprites/'+motion+'.json',JSON.stringify(data.metadata,null,2)+'\n','application/json');
      }
      return {model:job.model,atlases:job.actions.length};
    },job);
    console.log('  exported:',result);
  }
  const audit=spawn(process.execPath,['--import','tsx','scripts/audit-assets.mjs','--write',...(filter||selectedActions?[]:['--require-complete'])],{stdio:'inherit'});
  await new Promise((resolve,reject)=>{audit.on('error',reject);audit.on('exit',code=>code===0?resolve():reject(Error('Exported asset audit failed: '+code)));});
  console.log('DONE: exported',files.length,'prototype files. Artistic acceptance remains separate.');
} finally {
  await browser?.close();
  vite.kill('SIGTERM');
  server.close();
}
