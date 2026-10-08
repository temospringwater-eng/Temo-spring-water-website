'use strict';
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const pages=['index.html','about.html','products.html','contact.html','business.html','dealer.html'];
const server=spawn('python3',['-m','http.server','8793','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
let browser;
try{
 await sleep(1500);
 browser=await chromium.launch({headless:true});
 fs.mkdirSync('premium-qa-screenshots',{recursive:true});
 for(const width of [360,390,768,1280]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const name of pages){
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:8793/'+name,{waitUntil:'load'});
   assert.equal(response.status(),200,name+' response');
   const check=await page.evaluate(()=>{
    const hero=document.querySelector('.hero,.page-hero');
    const h1=document.querySelector('h1');
    return {premium:document.body.classList.contains('temo-premium'),
      stylesheet:[...document.styleSheets].some(s=>s.href?.includes('premium-redesign.css')),
      horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2,
      heroVisible:!!hero&&hero.getBoundingClientRect().height>200,
      titleVisible:!!h1&&getComputedStyle(h1).visibility!=='hidden',
      canonical:!!document.querySelector('link[rel="canonical"]'),
      formCount:document.querySelectorAll('form').length
    };
   });
   assert.ok(check.premium&&check.stylesheet&&!check.horizontalOverflow&&check.heroVisible&&check.titleVisible&&check.canonical, name+' @'+width+': '+JSON.stringify(check));
   assert.deepEqual(errors,[],name+' JS errors');
   if(['contact.html','business.html','dealer.html'].includes(name)){
     assert.equal(check.formCount,1,name+' form preservation');
     assert.match(await page.locator('form').getAttribute('action'),/^https:\/\/formsubmit\.co\//);
   }
   if(name==='index.html'){
     assert.equal(await page.locator('a[href="business.html"]').count()>0,true,'B2B CTA');
     assert.equal(await page.locator('a[href="products.html"]').count()>0,true,'shop CTA');
   }
   if(width===390||width===1280)await page.screenshot({path:'premium-qa-screenshots/'+name.replace('.html','')+'-'+width+'.png',fullPage:true});
   console.log('PASS '+name+' '+width+'px');
  }
  await context.close();
 }
 console.log('Premium QA PASS: 24 responsive page checks');
}finally{await browser?.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
