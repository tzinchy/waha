import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const base=process.env.WAHA_VISUAL_URL??'http://127.0.0.1:5173';
const output='artifacts/beauty';
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.WAHA_CHROMIUM_PATH??'/usr/bin/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const reports=[];
try{
  for(const [name,path,width,height] of [
    ['home','/home.html',1440,1000],['home-mobile','/home.html',390,844],
    ['gallery','/art-gallery.html',1440,1000],['gallery-mobile','/art-gallery.html',390,844],
    ['council','/lobby-lab.html',1440,1000],['lobby','/index.html',1440,1000],
    ['captain','/captain-lab.html',1440,1000]
  ]){
    const context=await browser.newContext({viewport:{width,height}});
    const page=await context.newPage();
    const report={name,errors:[],failedResponses:[],checks:[]};reports.push(report);
    page.on('pageerror',e=>report.errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)report.failedResponses.push({url:r.url(),status:r.status()})});
    await page.goto(base+path,{waitUntil:'networkidle',timeout:90000});
    await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{})}});
    const images=await page.evaluate(()=>Array.from(document.images).filter(i=>i.getAttribute('src')).map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0})));
    assert.ok(images.every(i=>i.loaded),name+': broken image');report.images=images;
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+': horizontal overflow');
    report.checks.push('images loaded','no horizontal overflow');
    if(name==='gallery'){
      assert.equal(await page.locator('.art-piece').count(),8);
      await page.locator('.art-piece img').first().click();
      await page.locator('dialog[open]').waitFor();
      await page.keyboard.press('Escape');
      await page.getByRole('button',{name:'Некроны',exact:true}).click();
      assert.equal(await page.locator('.art-piece').count(),2);
      await page.getByRole('button',{name:'Все армии',exact:true}).click();
      await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode().catch(()=>{})}});
      report.checks.push('8 artworks','zoom opens and closes','faction filter');
    }
    if(name==='lobby'){
      for(const faction of ['legion','heretics','scrap','necrons','drukhari','daemons']){
        await page.locator('#factionChoice').selectOption(faction);
        await page.locator('#commanderPortrait').evaluate(async img=>await img.decode());
        assert.equal(await page.locator('#commanderPortrait').getAttribute('src'),`/art/factions/${faction}/captain.png`);
      }
      await page.locator('#factionChoice').selectOption('legion');
      await page.locator('#commanderPortrait').evaluate(async img=>await img.decode());
      report.checks.push('six faction portraits');
    }
    await page.screenshot({path:`${output}/${name}.png`,fullPage:name!=='lobby',timeout:90000});
    assert.deepEqual(report.errors,[],name+': JS errors');
    assert.deepEqual(report.failedResponses,[],name+': HTTP errors');
    await context.close();
  }
}finally{await browser.close();await writeFile(`${output}/report.json`,JSON.stringify(reports,null,2)+'\n')}
console.log(JSON.stringify(reports.map(r=>({page:r.name,checks:r.checks,errors:r.errors,failedResponses:r.failedResponses})),null,2));
