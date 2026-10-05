// TEMO SPRING WATER — shared site behaviour
(function(){
  var WA_NUMBER = "923106666369";
  var LEAD_WEBHOOK = "https://babar5635.app.n8n.cloud/webhook/temo-lead";

  function waLink(message){
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function normalizeAssetUrls(){
    document.querySelectorAll("[src],[href]").forEach(function(el){
      var attrs = [];
      if (el.hasAttribute("src")) attrs.push("src");
      if (el.hasAttribute("href")) attrs.push("href");

      attrs.forEach(function(attr){
        var value = el.getAttribute(attr);
        if (!value || value.startsWith("#") || value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("http") || value.startsWith("data:")) return;

        var fixed = value
          .replace(/^(?:\.\/)?,?\/assets\//, "/")
          .replace(/assets\//g, "")
          .replace(/\/assets\//g, "/");

        if (fixed !== value) {
          el.setAttribute(attr, fixed);
        }
      });
    });

    document.querySelectorAll("style").forEach(function(style){
      var css = style.textContent || "";
      if (!css.includes("assets/")) return;
      style.textContent = css
        .replace(/\/assets\/fonts\//g, "/")
        .replace(/assets\//g, "")
        .replace(/\/assets\//g, "/");
    });
  }

  // ---------- Mobile nav ----------
  document.addEventListener("DOMContentLoaded", function(){
    normalizeAssetUrls();

    var toggle = document.querySelector(".nav-toggle");
    var closeBtn = document.querySelector(".mobile-close");
    var mobileNav = document.querySelector(".mobile-nav");
    if(toggle && closeBtn && mobileNav){
      var previousOverflow = "";
      function setMenu(open){
        if(open) previousOverflow = document.body.style.overflow;
        mobileNav.classList.toggle("open", open);
        mobileNav.inert = !open;
        mobileNav.setAttribute("aria-hidden", String(!open));
        toggle.setAttribute("aria-expanded", String(open));
        document.body.style.overflow = open ? "hidden" : previousOverflow;
        if(open) closeBtn.focus();
        else if(mobileNav.contains(document.activeElement)) toggle.focus();
      }
      toggle.addEventListener("click", function(){ setMenu(true); });
      closeBtn.addEventListener("click", function(){ setMenu(false); });
      mobileNav.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", function(){ setMenu(false); });
      });
      document.addEventListener("keydown", function(e){
        if(!mobileNav.classList.contains("open")) return;
        if(e.key === "Escape") { e.preventDefault(); setMenu(false); }
        if(e.key === "Tab"){
          var items = mobileNav.querySelectorAll('a[href], button');
          var first = items[0], last = items[items.length - 1];
          if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
        }
      });
      window.addEventListener("resize", function(){
        if(window.innerWidth > 980 && mobileNav.classList.contains("open")) setMenu(false);
      });
    }

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

    // Email uses the native FormSubmit POST. Never claim delivery or clear
    // customer details before a provider response. WhatsApp is an explicit draft.
    document.querySelectorAll("form[data-inquiry]").forEach(function(form){
      var prepare = form.querySelector("[data-prepare-whatsapp]");
      var panel = form.querySelector(".form-success");
      var link = form.querySelector("[data-whatsapp-draft]");
      if(!prepare || !panel || !link) return;
      prepare.addEventListener("click", function(){
        if(!form.reportValidity()) return;
        var lines = [form.getAttribute("data-inquiry") + " — new inquiry"];
        form.querySelectorAll("input, select, textarea").forEach(function(el){
          if(!el.name || el.type === "hidden" || el.name[0] === "_" || el.disabled) return;
          var value = el.value.trim();
          if(value) lines.push((el.getAttribute("data-label") || el.name.replace(/_/g, " ")) + ": " + value);
        });
        link.href = waLink(lines.join("\n"));
        panel.classList.add("show");
        link.focus();
      });
      // Do not let a previously prepared message silently contain stale values.
      form.addEventListener("input", function(){
        panel.classList.remove("show");
        link.removeAttribute("href");
      });

      // Preserve the existing B2B/dealer lead integration, but acknowledge
      // success only after a successful response. Email remains a native fallback.
      if(form.hasAttribute("data-lead-form")){
        var status = form.querySelector("[data-lead-status]");
        var submit = form.querySelector("[data-lead-submit]");
        var pending = false;
        form.addEventListener("submit", async function(e){
          if(e.submitter && e.submitter.hasAttribute("data-email-fallback")) return;
          e.preventDefault();
          if(pending || !form.reportValidity()) return;
          if(form.querySelector('[name="_honey"]').value) return;
          pending = true;
          submit.disabled = true;
          status.textContent = "Sending your request…";
          var controller = new AbortController();
          var timeout = setTimeout(function(){ controller.abort(); }, 10000);
          try{
            var data = new FormData(form);
            var details = [];
            form.querySelectorAll("input, select, textarea").forEach(function(el){
              if(!el.name || el.type === "hidden" || el.name[0] === "_") return;
              if(el.value.trim()) details.push((el.getAttribute("data-label") || el.name.replace(/_/g, " ")) + ": " + el.value.trim());
            });
            var response = await fetch(LEAD_WEBHOOK, {
              method:"POST", headers:{"Content-Type":"application/json"},
              signal:controller.signal,
              body:JSON.stringify({name:data.get("name") || "", email:data.get("email") || "", phone:data.get("phone") || "", city:data.get("city") || "", product:data.get("product") || form.getAttribute("data-inquiry"), message:details.join("\n"), source:form.getAttribute("data-inquiry"), page:window.location.href})
            });
            if(!response.ok) throw new Error("Request was not accepted");
            status.textContent = "Your request was accepted. For urgent assistance, contact us on WhatsApp.";
          }catch(err){
            status.textContent = "We could not confirm receipt. Your details are still here. Please use Send by email or WhatsApp below.";
          }finally{
            clearTimeout(timeout);
            pending = false;
            submit.disabled = false;
          }
        });
      }
    });

    // ---------- WhatsApp quick links with product-specific messages ----------
    document.querySelectorAll("[data-wa-msg]").forEach(function(el){
      el.href = waLink(el.getAttribute("data-wa-msg"));
    });

    // ---------- Active nav link ----------
    function pageName(url){
      return url.split("#")[0].split("?")[0].replace(/\/$/, "").split("/").pop().replace(/\.html$/, "") || "index";
    }
    var path = pageName(window.location.pathname);
    document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(function(a){
      var active = pageName(a.getAttribute("href") || "") === path;
      a.classList.toggle("active", active);
      if(active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  });
})();
