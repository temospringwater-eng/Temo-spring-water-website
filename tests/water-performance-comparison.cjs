'use strict';
// Paired mobile Lighthouse lab comparison. This isolates only the visual water feature;
// it is NOT a historical production baseline or real-user field data.
const fs=require('node:fs');
const {spawn,execFileSync}=require('node:child_process');
const original=fs.readFileSync('index.html','utf8');
const baseline=original
 .replace(/<link rel="stylesheet" href="water-effects\.css">\s*/,'')
 .replace(/<script src="water-effects\.js" defer><\/script>\s*/,'')
 .replace(/<div class="temo-water-layer" data-temo-water aria-hidden="true">[\s\S]*?<\/div>/,'');
if(baseline===original||baseline.includes('data-temo-water')||baseline.includes('water-effects.css'))throw Error('Unable to isolate baseline safely');
fs.writeFileSync('water-baseline-qa.html',baseline);
fs.mkdirSync('water-comparison-results',{recursive:true});
const server=spawn('python3',['-m','http.server','8771','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 try{
  await sleep(1500);
  const results=[];
  for(const [iteration,page] of [[1,'water-baseline-qa.html'],[1,'index.html'],[2,'index.html'],[2,'water-baseline-qa.html']]){
   const key=(page==='index.html'?'effects':'baseline')+'-'+iteration;
   const file='water-comparison-results/'+key+'.json';
   execFileSync('npx',['lighthouse','http://127.0.0.1:8771/'+page,'--quiet','--chrome-flags=--headless --no-sandbox','--only-categories=performance','--output=json','--output-path='+file],{timeout:180000,stdio:'inherit'});
   const report=JSON.parse(fs.readFileSync(file,'utf8'));
   const a=report.audits;
   results.push({key,score:report.categories.performance.score*100,LCP_ms:a['largest-contentful-paint']?.numericValue,CLS:a['cumulative-layout-shift']?.numericValue,TBT_ms:a['total-blocking-time']?.numericValue});
  }
  fs.writeFileSync('water-comparison-results/summary.json',JSON.stringify({note:'Local paired lab data, no production comparison',results},null,2));
  results.forEach(x=>console.log(JSON.stringify(x)));
 }finally{server.kill();fs.rmSync('water-baseline-qa.html',{force:true})}
})().catch(e=>{console.error(e);process.exitCode=1;fs.rmSync('water-baseline-qa.html',{force:true})});
