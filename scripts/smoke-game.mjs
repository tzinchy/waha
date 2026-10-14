import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const game=spawn('npx',['tsx','server/index.ts'],{env:{...process.env,PORT:'5173'},stdio:'inherit'});
let browser;
try{
  let live=false;
  for(let i=0;i<100;i++){
    try{const r=await fetch('http://127.0.0.1:5173/');if(r.ok){live=true;break}}catch{}
    await new Promise(ok=>setTimeout(ok,600));
  }
  assert.ok(live,'Game server did not become available');
  browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'domcontentloaded'});
  await page.locator('#factionChoice').selectOption('necrons');
  await page.locator('#name').fill('Smoke Tester');
  await page.locator('#create').click();
  await page.locator('#lobby:not(.hidden)').waitFor({timeout:30000});
  await page.locator('#addbot').click();
  await page.waitForFunction(()=>document.querySelectorAll('#plist li').length===2,{timeout:20000});
  await page.locator('#ready').click();
  await page.waitForFunction(()=>document.querySelector('#ready')?.textContent==='Не готов',{timeout:20000});
  await page.locator('#start').click();
  await page.locator('#game:not(.hidden)').waitFor({timeout:30000});
  await page.locator('#view canvas').first().waitFor({timeout:90000});
  await page.waitForTimeout(4000);
  assert.equal(errors.length,0,'Browser runtime exceptions: '+errors.join('; '));
  const state=await page.evaluate(()=>({
    canvas:!!document.querySelector('#view canvas'),
    visible:!document.querySelector('#game')?.classList.contains('hidden'),
    hud:document.querySelector('#hud-req')?.textContent,
    faction:document.querySelector('#factionChoice')?.value,
  }));
  assert.ok(state.canvas&&state.visible,'Game canvas or HUD not shown');
  assert.equal(state.faction,'necrons');
  console.log('BROWSER SMOKE PASSED',JSON.stringify(state));
  await page.screenshot({path:'smoke-game.png',fullPage:true});
} finally{await browser?.close();game.kill('SIGTERM');}
