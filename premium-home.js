// TEMO premium homepage enhancements
(function(){
  document.addEventListener("DOMContentLoaded", function(){
    var header = document.querySelector(".p-header");
    function syncHeader(){
      if(!header) return;
      header.classList.toggle("scrolled", window.scrollY > 12);
    }
    syncHeader();
    window.addEventListener("scroll", syncHeader, {passive:true});

    var revealItems = document.querySelectorAll(
      ".p-trust-item, .p-product, .p-b2b-card, .p-cert-panel, .p-nature, .p-why-card, .p-cta-inner"
    );

    if("IntersectionObserver" in window){
      revealItems.forEach(function(el){ el.classList.add("p-reveal"); });
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, {threshold:0.12, rootMargin:"0px 0px -30px 0px"});
      revealItems.forEach(function(el){ observer.observe(el); });
    }

    var toggle = document.querySelector(".nav-toggle");
    var close = document.querySelector(".mobile-close");
    var nav = document.querySelector(".mobile-nav");
    if(toggle && nav){
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
      toggle.addEventListener("click", function(){
        requestAnimationFrame(function(){
          toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
        });
      });
    }
    if(close && toggle && nav){
      close.addEventListener("click", function(){
        requestAnimationFrame(function(){
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  });
})();