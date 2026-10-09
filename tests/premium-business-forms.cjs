'use strict';
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const server=spawn('python3',['-m','http.server','8794','--bind','127.0.0.1'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{let browser;try{
 await sleep(1500);browser=await chromium.launch({headless:true});
 for(const file of ['business.html','dealer.html']){
  const context=await browser.newContext();
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:8794/'+file);
  const form=page.locator('form[data-lead-form]'),name=form.locator('[name="name"]'),phone=form.locator('[name="phone"]');
  assert.equal(await form.count(),1);
  assert.equal(await form.getAttribute('method'),'POST');
  assert.match(await form.getAttribute('action'),/^https:\/\/formsubmit\.co\//);
  assert.equal(await form.locator('[data-email-fallback]').count(),1);
  assert.equal(await form.locator('[data-prepare-whatsapp]').count(),1);
  // Block BOTH external lead endpoints; never send a real request.
  await page.route('https://formsubmit.co/**',route=>route.abort('blockedbyclient'));
  await page.route('https://babar5635.app.n8n.cloud/**',route=>route.abort('blockedbyclient'));
  await name.fill('TEMO QA');
  await phone.fill('03000000000');
  if(file==='business.html'){
   await form.locator('[name="company"]').fill('QA Company');
   await form.locator('[name="city"]').fill('Islamabad');
  }
  await form.locator('[data-prepare-whatsapp]').click();
  assert.match(await form.locator('[data-whatsapp-draft]').getAttribute('href'),/^https:\/\/wa\.me\//);
  await phone.fill('03111111111');
  assert.equal(await form.locator('[data-whatsapp-draft]').getAttribute('href'),null,'stale draft invalidated');
  // Verify the email fallback request and encoded form fields without transmitting.
  let blocked=0;
  await page.unroute('https://formsubmit.co/**');
  await page.route('https://formsubmit.co/**',async route=>{
   blocked++;
   assert.equal(route.request().method(),'POST');
   const params=new URLSearchParams(route.request().postData()||'');
   assert.equal(params.get('name'),'TEMO QA');
   assert.equal(params.get('phone'),'03111111111');
   await route.abort('blockedbyclient');
  });
  await form.locator('[data-email-fallback]').click();
  await page.waitForTimeout(350);
  assert.equal(blocked,1,file+' email fallback request intercepted');
  console.log('PASS '+file+' form, preview, safe intercepted email fallback');
  await context.close();
 }
}finally{await browser?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1});
