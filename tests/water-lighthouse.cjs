'use strict';
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const server=spawn('python3',['-m','http.server','8767','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 try{
  await sleep(1300);
  fs.mkdirSync('lighthouse-results',{recursive:true});
  for(const mode of ['mobile','desktop']){
   const args=['lighthouse','http://127.0.0.1:8767/index.html','--quiet','--chrome-flags=--headless --no-sandbox','--only-categories=performance,accessibility,seo','--output=json','--output-path=lighthouse-results/'+mode+'.json'];
   if(mode==='desktop')args.push('--preset=desktop');
   execFileSync('npx',args,{stdio:'inherit',timeout:180000});
   const r=JSON.parse(fs.readFileSync('lighthouse-results/'+mode+'.json','utf8'));
   const a=r.audits;
   console.log(JSON.stringify({mode,performance:r.categories.performance.score,accessibility:r.categories.accessibility.score,seo:r.categories.seo.score,LCP:a['largest-contentful-paint']?.numericValue,CLS:a['cumulative-layout-shift']?.numericValue,TBT:a['total-blocking-time']?.numericValue}));
  }
 }finally{server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
