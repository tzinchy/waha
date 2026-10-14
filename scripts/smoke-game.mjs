/** Real lobby/UI + authoritative commands over the game's normal WebSocket. */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { FACTIONS } from './asset-catalog.mjs';
const port=Number(process.env.WAHA_SMOKE_PORT??5173),base=`http://127.0.0.1:${port}`;
const output='artifacts/browser';await mkdir(output,{recursive:true});
const game=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:String(port)},stdio:'inherit'});
let browser;const reports=[];
try{
  let live=false;
  for(let i=0;i<100;i++){
    if(game.exitCode!==null)throw Error('Game server exited: '+game.exitCode);
    try{const r=await fetch(base);if(r.ok){live=true;break}}catch{}
    await new Promise(ok=>setTimeout(ok,600));
  }
  assert.ok(live,'Game server did not become available');
  browser=await chromium.launch({headless:true,executablePath:process.env.WAHA_CHROMIUM_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
  for(const faction of (process.env.WAHA_SMOKE_FACTIONS?.split(',')??FACTIONS)){
    const context=await browser.newContext({viewport:{width:960,height:720}}),page=await context.newPage();
    const report={faction,errors:[],httpErrors:[],consoleErrors:[],screenshots:[],loadedAtlases:[],steps:[],status:'pending'};reports.push(report);
    page.on('pageerror',e=>report.errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
    page.on('response',r=>{if(r.ok()&&r.url().includes('/models/factions/')&&r.url().endsWith('.png'))report.loadedAtlases.push(r.url().split('/models/factions/')[1]);if(r.status()>=400)report.httpErrors.push({url:r.url(),status:r.status()});});
    await page.addInitScript(()=>{
      const Original=window.WebSocket;
      window.__probe={history:[],sent:[],socket:null,snap:null,start:null};
      window.WebSocket=class extends Original{
        constructor(...args){super(...args);if(String(args[0]).endsWith('/ws')){
          window.__probe.socket=this;this.addEventListener('message',event=>{
            const m=JSON.parse(event.data);if(m.t==='snap')window.__probe.snap=m.s;if(m.t==='start')window.__probe.start=m;
            window.__probe.history.push(m);if(window.__probe.history.length>1000)window.__probe.history.shift();
          });
        }}
        send(data){try{window.__probe.sent.push(JSON.parse(data));}catch{}return super.send(data);}
      };
    });
    try{
      await page.goto(base,{waitUntil:'domcontentloaded'});
      await page.locator('#factionChoice').selectOption(faction);await page.locator('#name').fill('QA '+faction);
      await page.locator('#create').click();await page.locator('#lobby:not(.hidden)').waitFor({timeout:30000});
      await page.locator('#addbot').click();await page.waitForFunction(()=>document.querySelectorAll('#plist li').length===2,null,{timeout:20000});
      await page.locator('#ready').click();await page.waitForFunction(()=>document.querySelector('#ready')?.textContent==='Не готов',null,{timeout:20000});
      await page.locator('#start').click();await page.locator('#game:not(.hidden)').waitFor({timeout:30000});
      await page.locator('#view canvas').first().waitFor({timeout:90000});
      await page.waitForFunction(()=>window.__probe.snap?.u.length>0);
      assert.equal(await page.evaluate(()=>window.__probe.start.players[0].captain.faction),faction);report.steps.push('real lobby, faction broadcast, bot, readiness, start');
      // Begin a real timed HQ upgrade using the HUD; no server time or resources are modified.
      await page.keyboard.press('h');await page.locator('[data-act="upgrade"]').click();report.steps.push('HQ upgrade via HUD');
      await page.keyboard.press('Space');
      const initial=await page.evaluate(()=>window.__probe.snap.u.find(u=>u[1]===0&&u[2]===0));
      const box=await page.locator('#view canvas').first().boundingBox();assert.ok(box);
      await page.mouse.click(box.x+box.width/2+80,box.y+box.height/2,{button:'right'});
      await page.waitForFunction(initial=>{const u=window.__probe.snap.u.find(u=>u[0]===initial[0]);return u&&Math.hypot(u[3]-initial[3],u[4]-initial[4])>5;},initial,{timeout:15000});
      await page.keyboard.press('s');report.steps.push('movement via right click and authoritative position');
      // Re-centre, throw through the normal J+click input, and prove throw -> impact snapshots.
      await page.keyboard.press('Space');await page.waitForTimeout(300);await page.keyboard.press('j');
      await page.mouse.click(box.x+box.width/2+30,box.y+box.height/2);
      await page.waitForFunction(()=>window.__probe.history.some(m=>m.t==='snap'&&m.s.grenades?.length),null,{timeout:10000});
      const eventId=await page.evaluate(()=>window.__probe.history.find(m=>m.t==='snap'&&m.s.grenades?.length).s.grenades[0][0]);
      await page.waitForFunction(id=>window.__probe.history.some(m=>m.t==='snap'&&m.s.blasts?.some(b=>b[4]===id)),eventId,{timeout:10000});
      report.grenadeEventId=eventId;
      if(faction==='legion') assert.ok(report.loadedAtlases.includes('legion/captain/sprites/throw_grenade.png'),'Real throw atlas did not load');
      report.steps.push('grenade via UI: server throw, flight, matching impact ID');
      // Exercise a real battle using the same public command socket. This targets an offscreen
      // enemy HQ without depending on camera projection or altering the server simulation.
      await page.evaluate(()=>{const p=window.__probe,hq=p.snap.u.find(u=>u[1]===1&&u[2]===3),captain=p.snap.u.find(u=>u[1]===0&&u[2]===0);p.socket.send(JSON.stringify({t:'cmd',cmd:{c:'attack',ids:[captain[0]],id:hq[0]}}));});
      await page.waitForFunction(()=>window.__probe.history.some(m=>m.t==='snap'&&m.s.sh.length>0),null,{timeout:60000});
      report.steps.push('authoritative battle shots');
      await page.keyboard.press('Space');
      const screenshot=`${output}/${faction}-battle.png`;await page.screenshot({timeout:90000,path:screenshot});report.screenshots.push(screenshot);
      await page.waitForFunction(()=>window.__probe.snap.pl[0][2]===2,null,{timeout:40000});report.steps.push('HQ upgrade completed on server');
      await page.keyboard.press('Space');
      for(let i=0;i<4;i++)await page.mouse.wheel(0,-100);
      await page.waitForTimeout(500);
      const closeup=`${output}/${faction}-closeup.png`;await page.screenshot({timeout:90000,path:closeup});report.screenshots.push(closeup);
      // Verify actual image/JSON loading, anchors, losses, frozen death, respawn and disposal.
      if(!['drukhari','daemons'].includes(faction)){
        report.sprite=await page.evaluate(async faction=>{
          const {verifySpriteLifecycle}=await import('/sprite-diagnostics.ts');return verifySpriteLifecycle(faction);
        },faction);
        assert.equal(report.sprite.members,2);assert.equal(report.sprite.revived,5);assert.equal(report.sprite.frozenDeath,true);assert.equal(report.sprite.removed,true);
      }
      report.fps=await page.evaluate(()=>new Promise(resolve=>{const begin=performance.now();let frames=0;function tick(now){frames++;if(now-begin>=2000)resolve(frames*1000/(now-begin));else requestAnimationFrame(tick);}requestAnimationFrame(tick);}));
      report.simulationEntities=await page.evaluate(()=>window.__probe.snap.u.length);
      assert.deepEqual(report.errors,[],'Runtime exceptions');assert.deepEqual(report.httpErrors,[],'HTTP errors');assert.deepEqual(report.consoleErrors,[],'Console errors');
      report.status='pass';console.log('BROWSER SMOKE PASSED',JSON.stringify(report));
    }catch(e){report.status='fail';report.failure=String(e);await page.screenshot({timeout:90000,path:`${output}/${faction}-failure.png`}).catch(()=>{});console.error('BROWSER SMOKE FAILED',faction,String(e));}
    finally{await writeFile(`${output}/${faction}.json`,JSON.stringify(report,null,2)+'\n');await context.close();}
  }
  const review=await browser.newPage({viewport:{width:960,height:720}});
  await review.goto(base+'/art-review.html',{waitUntil:'networkidle'});
  await review.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('Процедурный прототип'));
  await review.screenshot({timeout:90000,path:`${output}/art-review.png`,fullPage:true});await review.close();
}finally{await browser?.close();game.kill('SIGTERM');await writeFile(`${output}/report.json`,JSON.stringify({renderer:'Chromium headless / SwiftShader (software GPU)',reports},null,2)+'\n');}
if(reports.some(r=>r.status!=='pass'))process.exitCode=1;
