/* TEMO water effect lifecycle — optional enhancement; no content mutation. */
(()=>{'use strict';
const layer=document.querySelector('[data-temo-water]');
if(!layer)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let inView=true;
const sync=()=>layer.classList.toggle('is-paused',document.hidden||!inView||reduce.matches);
if('IntersectionObserver'in window){
 const observer=new IntersectionObserver(entries=>{inView=entries[0]?.isIntersecting??true;sync()},{rootMargin:'80px'});
 observer.observe(layer);
}
document.addEventListener('visibilitychange',sync,{passive:true});
if(typeof reduce.addEventListener==='function')reduce.addEventListener('change',sync);
else if(typeof reduce.addListener==='function')reduce.addListener(sync);
sync();
})();
