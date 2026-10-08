'use strict';
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const server=spawn('python3',['-m','http.server','8766','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let browser;
 try{
  await sleep(1300);
  browser=await chromium.launch({headless:true});
  fs.mkdirSync('water-motion-evidence',{recursive:true});
  for(const width of [390,1280]){
   const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'no-preference'});
   const page=await context.newPage();
   for(const name of ['index.html','about.html','products.html','contact.html']){
    const response=await page.goto('http://127.0.0.1:8766/'+name,{waitUntil:'networkidle'});
    if(response?.status()!==200)throw Error(name+' response '+response?.status());
    const info=await page.evaluate(()=>{
     const layer=document.querySelector('[data-temo-water]');
     const drop=layer?.querySelector('.temo-water-drop');
     return {layer:!!layer,drop:!!drop,animation:getComputedStyle(drop).animationName,motion:matchMedia('(prefers-reduced-motion: no-preference)').matches,paused:layer.classList.contains('is-paused'),pointer:getComputedStyle(layer).pointerEvents,scrollOverflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    if(!info.layer||!info.drop||info.animation==='none'||!info.motion||info.paused||info.pointer!=='none'||info.scrollOverflow)throw Error(name+' '+width+': '+JSON.stringify(info));
    const first=await page.evaluate(()=>getComputedStyle(document.querySelector('.temo-water-drop')).transform);
    await sleep(500);
    const second=await page.evaluate(()=>getComputedStyle(document.querySelector('.temo-water-drop')).transform);
    if(first===second)throw Error(name+' '+width+' droplet not visibly moving');
    await page.screenshot({path:'water-motion-evidence/'+name.replace('.html','')+'-'+width+'.png',fullPage:true});
    console.log('PASS motion '+name+' width '+width);
   }
   await context.close();
  }
  console.log('Motion QA complete: 8/8');
 }finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
