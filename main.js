// TEMO SPRING WATER — shared site behaviour
(function(){
  var WA_NUMBER = "923106666369";
  var LEAD_WEBHOOK = "https://babar5635.app.n8n.cloud/webhook/temo-lead";

  function waLink(message){
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // ---------- Mobile nav ----------
  document.addEventListener("DOMContentLoaded", function(){
    var toggle = document.querySelector(".nav-toggle");
    var closeBtn = document.querySelector(".mobile-close");
    var mobileNav = document.querySelector(".mobile-nav");
    if(toggle && mobileNav){
      toggle.addEventListener("click", function(){ mobileNav.classList.add("open"); document.body.style.overflow="hidden"; });
    }
    if(closeBtn && mobileNav){
      closeBtn.addEventListener("click", function(){ mobileNav.classList.remove("open"); document.body.style.overflow=""; });
    }
    mobileNav && mobileNav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){ mobileNav.classList.remove("open"); document.body.style.overflow=""; });
    });

    // ---------- Random gentle bubble placement in hero ----------
    document.querySelectorAll(".bubble").forEach(function(b, i){
      var size = 10 + Math.random()*26;
      b.style.width = size+"px";
      b.style.height = size+"px";
      b.style.left = (Math.random()*90)+"%";
      b.style.top = (10+Math.random()*70)+"%";
      b.style.animationDelay = (i*1.3)+"s";
      b.style.animationDuration = (10+Math.random()*8)+"s";
    });

    // ---------- Generic form handler ----------
    document.querySelectorAll("form[data-wa-form]").forEach(function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var data = new FormData(form);
        var fields = {};
        var lines = [];
        var label = form.getAttribute("data-wa-form");
        lines.push(label + " — new inquiry");
        form.querySelectorAll("[name]").forEach(function(el){
          var val = data.get(el.name);
          fields[el.name] = val || "";
          if(val){
            var fieldLabel = el.getAttribute("data-label") || el.name;
            lines.push(fieldLabel + ": " + val);
          }
        });
        var message = lines.join("\n");

        // Send the real submitted details to the TEMO lead inbox (best-effort;
        // never blocks the WhatsApp flow below if this fails or is blocked).
        try{
          fetch(LEAD_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fields.name || "",
              email: fields.email || "",
              phone: fields.phone || "",
              city: fields.city || "",
              product: fields.product || label,
              message: message,
              source: label,
              page: window.location.href
            })
          }).catch(function(){ /* ignore network/CORS errors, WhatsApp path still works */ });
        }catch(err){ /* fetch unsupported or blocked — no-op */ }

        var successBox = form.parentElement.querySelector(".form-success");
        if(successBox){ successBox.classList.add("show"); successBox.scrollIntoView({behavior:"smooth", block:"nearest"}); }

        var waBtn = form.parentElement.querySelector(".form-success a.btn");
        if(waBtn){ waBtn.href = waLink(message); }

        form.reset();
      });
    });

    // ---------- WhatsApp quick links with product-specific messages ----------
    document.querySelectorAll("[data-wa-msg]").forEach(function(el){
      el.href = waLink(el.getAttribute("data-wa-msg"));
    });

    // ---------- Active nav link ----------
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(function(a){
      var href = a.getAttribute("href");
      if(href === path || (path === "index.html" && href === "/")){
        a.classList.add("active");
      }
    });
  });
})();
