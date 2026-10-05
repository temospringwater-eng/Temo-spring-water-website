import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/index.js';

const env={ APP_ENV:'production',ALLOWED_ORIGIN:'https://www.temospringwater.com',ERP_API_BASE_URL:'https://erp.test' };
const token='a'.repeat(64);
function request(path,method='GET',body,headers={}){return new Request('https://www.temospringwater.com/api/water-club/'+path,{method,headers:{'content-type':'application/json',origin:env.ALLOWED_ORIGIN,cookie:'temo_wc_session='+token,...headers},...(body?{body:JSON.stringify(body)}:{})});}
test('Worker proxy security and route contracts',async t=>{
  const original=globalThis.fetch;let calls=[];
  t.after(()=>{globalThis.fetch=original;});
  globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({id:42,success:true,token}),{status:200,headers:{'content-type':'application/json'}});};
  await t.test('foreign origins cannot mutate authenticated records',async()=>{
    const before=calls.length;const r=await worker.fetch(request('orders','POST',{items:[]},{origin:'https://evil.test'}),env);assert.equal(r.status,403);assert.equal(calls.length,before);
  });
  await t.test('simple form content cannot bypass JSON CSRF boundary',async()=>{const r=await worker.fetch(request('orders','POST',{items:[]},{'content-type':'text/plain'}),env);assert.equal(r.status,415);});
  await t.test('missing and malformed cookies fail safely',async()=>{
    for(const cookie of ['','temo_wc_session=%oops'])assert.equal((await worker.fetch(request('rewards','GET',null,{cookie}),env)).status,401);
  });
  await t.test('oversized bodies rejected even without content-length',async()=>{const r=await worker.fetch(request('orders','POST',{padding:'x'.repeat(9000)}),env);assert.equal(r.status,400);});
  await t.test('customer mutation forwards server session and exact scoped route',async()=>{
    const r=await worker.fetch(request('subscriptions/123/skip','POST',{requestKey:'skip-00000001',companyId:999}),env);assert.equal(r.status,200);assert.equal(calls.at(-1).url,'https://erp.test/api/customer/water-club/subscriptions/123/skip');assert.equal(calls.at(-1).options.headers.get('authorization'),'Bearer '+token);assert.equal(r.headers.get('cache-control'),'no-store');
  });
  await t.test('login stores token only in HttpOnly secure cookie',async()=>{
    const r=await worker.fetch(request('auth/login','POST',{identifier:'test@example.test',password:'TestPassword'}),env);const data=await r.json();assert.equal(data.token,undefined);assert.match(r.headers.get('set-cookie'),/HttpOnly/);assert.match(r.headers.get('set-cookie'),/Secure/);
  });
  await t.test('upstream errors preserve forbidden response without deleting valid session',async()=>{
    globalThis.fetch=async()=>new Response(JSON.stringify({message:'Not allowed'}),{status:403});const r=await worker.fetch(request('rewards/redeem','POST',{requestKey:'redeem-000001'}),env);assert.equal(r.status,403);assert.equal(r.headers.get('set-cookie'),null);
  });
  await t.test('expired ERP session clears browser cookie',async()=>{
    globalThis.fetch=async()=>new Response('{}',{status:401});const r=await worker.fetch(request('dashboard'),env);assert.equal(r.status,401);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);
  });
  await t.test('production refuses insecure ERP URL and OTP remains disabled',async()=>{
    assert.equal((await worker.fetch(request('rewards'),{...env,ERP_API_BASE_URL:'http://erp.test'})).status,503);
    assert.equal((await worker.fetch(request('auth/start','POST',{phone:'555555555'}),env)).status,503);
  });
});
