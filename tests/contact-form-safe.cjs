'use strict';
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const http = require('node:http');
const assert = require('node:assert/strict');
const server = spawn('python3', ['-m','http.server','8772','--bind','127.0.0.1'], {stdio:'ignore'});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
 let browser;
 try {
  await sleep(1400);
  browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const page = await context.newPage();
  const jsErrors=[];
  page.on('pageerror', e=>jsErrors.push(e.message));
  await page.goto('http://127.0.0.1:8772/contact.html', {waitUntil:'load'});
  const form=page.locator('form[data-inquiry="General inquiry"]');
  assert.equal(await form.count(),1,'contact form exists');
  assert.match(await form.getAttribute('action'),/^https:\/\/formsubmit\.co\//);
  assert.equal((await form.getAttribute('method')).toUpperCase(),'POST');
  assert.equal(await form.locator('input[name="name"]').getAttribute('required'),'');
  assert.equal(await form.locator('textarea[name="message"]').getAttribute('required'),'');
  // Native validation must block invalid forms and all external POSTs in the test.
  const submit=form.getByRole('button',{name:'Send message by email'});
  await submit.click();
  assert.equal(await form.locator('input[name="name"]').evaluate(el=>el.validity.valueMissing),true);
  // Fill local test data, then use the WhatsApp *preview* action only.
  await form.locator('input[name="name"]').fill('TEMO QA Test');
  await form.locator('input[name="phone"]').fill('03000000000');
  await form.locator('input[name="email"]').fill('qa@example.invalid');
  await form.locator('textarea[name="message"]').fill('Automated test; do not send.');
  await form.getByRole('button',{name:'Prepare WhatsApp message'}).click();
  const link=form.locator('[data-whatsapp-draft]');
  assert.match(await link.getAttribute('href'),/^https:\/\/wa\.me\//);
  assert.equal(await form.locator('.form-success').evaluate(el=>el.classList.contains('show')),true);
  await form.locator('textarea[name="message"]').fill('Modified unsent text');
  assert.equal(await link.getAttribute('href'),null,'stale WhatsApp draft removed');
  // Check that the native email form would POST, without allowing the network request.
  let intercepted=false;
  await page.route('https://formsubmit.co/**',async route=>{
    intercepted=true;
    const request=route.request();
    assert.equal(request.method(),'POST');
    assert.equal(new URLSearchParams(request.postData()||'').get('name'),'TEMO QA Test');
    await route.abort('blockedbyclient');
  });
  await submit.click();
  await page.waitForTimeout(400);
  assert.equal(intercepted,true,'form generated outbound request intercepted before delivery');
  assert.deepEqual(jsErrors,[],'no script exceptions');
  console.log('PASS contact form validation, WhatsApp draft lifecycle, intercepted POST — no real message delivered.');
  await context.close();
 }finally { await browser?.close();server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1});
