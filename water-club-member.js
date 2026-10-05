(() => {
  const $ = id => document.getElementById(id);
  const money = v => Number(v || 0).toLocaleString('en-PK') + ' PKR';
  const message = (text,error=false) => { $('wc-message').textContent=text; $('wc-message').dataset.error=String(error); };
  const text = (id,value) => { $(id).textContent=value; };
  let rewards, code, refreshSequence=0;
  async function api(route,method='GET',body) {
    const r=await fetch('/api/water-club/'+route,{ method,credentials:'same-origin',headers:{ 'Content-Type':'application/json' },...(body?{ body:JSON.stringify(body) }:{}) });
    let payload={};try{ payload=await r.json(); }catch{}
    if(r.status===401){ location.replace('water-club-login.html');throw Error('Please sign in.'); }
    if(!r.ok || !payload.ok)throw Error(payload.message || 'This request could not be completed.');
    return payload.data;
  }
  const key=()=>crypto.randomUUID();
  function bind(id,route,prepare=x=>x) {
    const form=$(id);let pending;
    form.addEventListener('submit',async e=>{
      e.preventDefault();const button=form.querySelector('button');if(button.disabled)return;
      button.disabled=true;
      const body=prepare(Object.fromEntries(new FormData(form)));const signature=JSON.stringify(body);
      if(!pending || pending.signature!==signature)pending={ signature,key:key() };
      try{ await api(route,'POST',{ ...body,requestKey:pending.key });pending=null;message('Saved successfully.');await load(); }
      catch(e){ message(e.message,true); }finally{ button.disabled=false; }
    });
  }
  function list(id,rows,format) {
    $(id).replaceChildren();if(!rows.length){ $(id).textContent='No records yet.';return; }
    rows.forEach(row=>{ const p=document.createElement('p');p.textContent=format(row);$(id).append(p); });
  }
  async function load() {
    const current=++refreshSequence;
    try {
      const data=await api('dashboard');if(current!==refreshSequence)return;
      const c=data.customer||{}, schedules=data.subscriptions||[];
      text('wc-api-state','Member account connected');text('wc-welcome','Welcome, '+c.name);text('wc-account-meta',c.email||c.phone||'');
      text('wc-orders',(data.orders||[]).length);text('wc-subscriptions',schedules.length);text('wc-bottles',data.bottleBalance||0);text('wc-bottle-ledger',data.bottleBalance||0);text('wc-outstanding',money(data.account?.outstanding));text('wc-address',c.address||'Set a delivery address');
      const profile=$('wc-profile-form');for(const name of ['name','phone','address'])profile.elements[name].value=c[name]||'';
      const active=schedules.find(s=>s.status==='active');text('wc-next-product',active ? active.quantity+' × '+active.product_name : 'No active delivery plan');text('wc-next-schedule',active ? active.frequency+' · '+active.next_due_date : 'Set a schedule below');text('wc-plan-status',active?.status||'Not active');
      $('wc-orders-body').replaceChildren();
      for(const order of data.orders||[]){ const tr=document.createElement('tr');for(const value of [String(order.created_at||'').slice(0,10),'#'+order.id,order.status,money(order.total_amount)]){ const td=document.createElement('td');td.textContent=value;tr.append(td); }$('wc-orders-body').append(tr); }
      $('wc-schedules').replaceChildren();
      for(const s of schedules){
        const row=document.createElement('div');row.className='wc-schedule-row';const label=document.createElement('p');label.textContent=`${s.quantity} × ${s.product_name} · ${s.frequency} · ${s.status} · ${s.next_due_date}`;row.append(label);
        if(['active','paused'].includes(s.status))for(const action of (s.status==='active'?['pause','skip','cancel']:['resume','cancel'])){
          const button=document.createElement('button');button.type='button';button.textContent=action[0].toUpperCase()+action.slice(1);const requestKey=key();button.onclick=async()=>{ button.disabled=true;try{ await api(`subscriptions/${s.id}/${action}`,'POST',{ requestKey });message('Schedule updated.');await load(); }catch(e){ message(e.message,true);button.disabled=false; } };row.append(button);
        }$('wc-schedules').append(row);
      }
      const catalog=await api('catalog');
      document.querySelectorAll('[data-catalog]').forEach(select=>{
        const selected=select.value;select.replaceChildren();for(const p of catalog){ const option=document.createElement('option');option.value=p.id;option.textContent=p.name+' · '+money(p.sale_price);select.append(option); }if([...select.options].some(o=>o.value===selected))select.value=selected;
      });
      if(!catalog.length)message('The delivery catalog is being configured. Contact TEMO for help.');
      try{
        rewards=await api('rewards');$('wc-join-form').hidden=true;
        text('wc-points',rewards.points);text('wc-reward-rule',rewards.redemptionPoints+' points = one free 19L refill');text('wc-points-debt',rewards.pointsDebt ? rewards.pointsDebt+' points reversed after refund; future earnings cover this balance.' : '');
        $('wc-redeem').disabled=!rewards.member.rewards_enabled || rewards.points<rewards.redemptionPoints;
        list('wc-reward-history',rewards.transactions.slice(0,8),r=>`${r.points>0?'+':''}${r.points} · ${r.description}`);
        const referrals=await api('referrals');code=referrals.code;text('wc-referral-code',code);
        list('wc-referral-history',referrals.referrals,r=>'Referral · '+r.status);
        const deliveries=await api('deliveries');list('wc-deliveries',deliveries,r=>`Order #${r.order_id} · ${r.status} · ${r.scheduled_date||'Awaiting schedule'}`);
      }catch(e){ $('wc-join-form').hidden=false;text('wc-points','—');$('wc-redeem').disabled=true;message(e.message); }
    }catch(e){ text('wc-api-state','Connection unavailable');message(e.message,true); }
  }
  bind('wc-join-form','membership');
  bind('wc-order-form','orders',b=>({ items:[{ productId:Number(b.productId),quantity:Number(b.quantity) }] }));
  bind('wc-schedule-form','subscriptions',b=>({ ...b,quantity:Number(b.quantity),productId:Number(b.productId),customInterval:Number(b.customInterval) }));
  bind('wc-referral-form','referrals');bind('wc-support-form','support',b=>({ ...b,priority:'normal' }));
  $('wc-profile-form').onsubmit=async e=>{ e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{ await api('profile','PATCH',Object.fromEntries(new FormData(e.currentTarget)));message('Account details updated.');await load(); }catch(e){ message(e.message,true); }finally{ b.disabled=false; } };
  let redemptionKey;
  $('wc-redeem').onclick=async()=>{ $('wc-redeem').disabled=true;redemptionKey ||= key();try{ const order=await api('rewards/redeem','POST',{ requestKey:redemptionKey });redemptionKey=null;message('Free refill order #'+order.id+' created.');await load(); }catch(e){ message(e.message,true);$('wc-redeem').disabled=false; } };
  $('wc-copy-referral').onclick=async()=>{ try{ if(code)await navigator.clipboard.writeText(code);message('Referral code copied.'); }catch{message('Your code: '+(code||'Join Water Club first.'));} };
  $('wc-logout').onclick=async()=>{ $('wc-logout').disabled=true;try{await api('auth/logout','POST');location.replace('water-club-login.html');}catch(e){message(e.message,true);$('wc-logout').disabled=false;} };
  const today=new Date().toISOString().slice(0,10);$('wc-schedule-form').elements.startDate.min=today;$('wc-schedule-form').elements.startDate.value=today;
  load();
})();
