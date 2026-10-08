'use strict';
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const pages = ['index.html','about.html','products.html','contact.html'];
const port = 8765;
const server = spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
  let browser;
  try{
    await sleep(1300);
    browser=await chromium.launch({headless:true});
    fs.mkdirSync('water-qa-screenshots',{recursive:true});
    for(const width of [390,1280]){
      const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
      const page=await context.newPage();
      for(const name of pages){
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        const response=await page.goto('http://127.0.0.1:'+port+'/'+name,{waitUntil:'load'});
        if(!response||response.status()!==200)throw Error(name+' HTTP status not 200');
        const check=await page.evaluate(()=>{
          const layer=document.querySelector('[data-temo-water]');
          const hero=document.querySelector('.hero,.page-hero');
          const bounds=layer?.getBoundingClientRect();
          return {layer:!!layer,cover:!!bounds&&bounds.width>0&&bounds.height>0,clickThrough:!!layer&&getComputedStyle(layer).pointerEvents==='none',ariaHidden:layer?.getAttribute('aria-hidden')==='true',horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,heading:!!document.querySelector('h1'),reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,hero:!!hero};
        });
        if(!check.layer||!check.cover||!check.clickThrough||!check.ariaHidden||check.horizontalOverflow||!check.heading||!check.reducedMotion||!check.hero||errors.length)throw Error(name+' '+width+': '+JSON.stringify({check,errors}));
        await page.screenshot({path:'water-qa-screenshots/'+name.replace('.html','')+'-'+width+'.png',fullPage:true});
        console.log('PASS '+name+' @'+width+'px reduced motion');
      }
      await context.close();
    }
    console.log('Browser smoke checks: 8/8 passed. Screenshots captured.');
  }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
