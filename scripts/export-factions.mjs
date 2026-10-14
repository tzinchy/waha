/**
 * Deterministic browser-based asset exporter for the procedural faction catalog.
 * The browser renders GLB + eight-direction PNG atlases. A local-only upload endpoint
 * saves files directly; no base64 transfers and no dependency on GitHub browser downloads.
 */
import { createServer } from 'node:http';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const factions = ['legion','heretics','scrap','necrons','drukhari','daemons'];
const missingOnly = process.env.EXPORT_SCOPE !== 'all';
const targets = missingOnly ? factions.slice(4) : factions;
const dest = 'client/public/models/factions';
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
const vite = spawn('npx',['vite','--root','client','--host','127.0.0.1','--port','4173'],{stdio:'inherit'});
let browser;
try {
  for(let attempt=0;attempt<90;attempt++) {
    try {const r=await fetch('http://127.0.0.1:4173/asset-lab.html');if(r.ok)break;}catch{}
    await new Promise(r=>setTimeout(r,1000));
    if(attempt===89)throw Error('Vite failed to start');
  }
  browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--disable-web-security']});
  const page=await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
  page.on('console',m=>{if(m.type()==='error')console.error('[browser]',m.text())});
  page.on('pageerror',e=>console.error('[browser exception]',e.message));
  await page.goto('http://127.0.0.1:4173/asset-lab.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.assetLab?.glb,{timeout:120000});
  page.setDefaultTimeout(180000);
  for(const faction of targets) {
    console.log('Exporting faction:',faction);
    const result=await page.evaluate(async faction=>{
      const api=window.assetLab;
      const units=['captain','guard','builder','sniper','heavy','flamer','elite','medic','transport','tank','walker','artillery','titan'];
      const buildings=['hq','barracks','post','turret','generator','factory','armory','relic','wall','gate'];
      const actions={captain:['idle','walk','run','attack','throw_grenade','death'],guard:['idle','walk','run','shoot','death'],builder:['idle','walk','run','work','death'],elite:['idle','walk','run','shoot','attack_slash','throw_grenade','death']};
      const upload=async(path,bytes,type='application/octet-stream')=>{
        const response=await fetch('http://127.0.0.1:4174/upload?path='+encodeURIComponent(path),{method:'POST',body:bytes,headers:{'Content-Type':type}});
        if(!response.ok)throw Error(path+': '+await response.text());
      };
      const outcome=[];
      for(const role of [...units,...buildings]){
        const b=await api.glb(faction,role);
        await upload(faction+'/'+role+'/model.glb',b,'model/gltf-binary');
        outcome.push(role+':glb');
        if(!units.includes(role))continue;
        for(const motion of actions[role]??['idle','walk','run','shoot','death']) {
          const data=await api.spriteAtlas(faction,role,motion);
          const prefix=faction+'/'+role+'/sprites/'+motion;
          await upload(prefix+'.png',data.blob,'image/png');
          await upload(prefix+'.json',JSON.stringify(data.metadata),'application/json');
          outcome.push(role+':'+motion);
        }
      }
      return outcome;
    },faction);
    console.log('  assets exported:',result.length);
  }
  // Add newly generated records while preserving historical entries and file metadata.
  const manifestFile=join(dest,'manifest.json');
  const manifest=JSON.parse(await readFile(manifestFile,'utf8'));
  const existing=new Map(manifest.files.map(v=>[v.file,v]));
  for(const record of files.filter(f=>f.file.endsWith('/model.glb'))) {
    const [faction,role]=record.file.split('/');
    existing.set(record.file,{...(existing.get(record.file)??{}),faction,role,file:record.file,bytes:record.bytes});
  }
  manifest.files=[...existing.values()];
  manifest.models=manifest.files.length;
  const entries=await readdir(dest,{recursive:true});
  manifest.spriteAtlases=entries.filter(p=>p.endsWith('.png')&&p.includes('/sprites/')).length;
  manifest.animationClips=manifest.spriteAtlases;
  manifest.generator='client/faction-models.ts + scripts/export-factions.mjs';
  manifest.quality='baked procedural 3D pixel-sampled sprite atlases; still needs hand-authored high-resolution pixel art';
  await writeFile(manifestFile,JSON.stringify(manifest,null,2)+'\n');
  console.log('DONE:',files.length,'files,',manifest.models,'GLB,',manifest.spriteAtlases,'sprite atlases');
} finally {
  await browser?.close();
  vite.kill('SIGTERM');
  server.close();
}
