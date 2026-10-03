document.addEventListener("DOMContentLoaded",function(){
  var loginForm=document.querySelector("[data-auth-login]");
  if(loginForm){
    loginForm.addEventListener("submit",async function(e){
      e.preventDefault();
      var status=loginForm.parentElement.querySelector(".wc-auth-status");
      var button=loginForm.querySelector("button[type='submit']");
      var identifier=String(loginForm.elements.identifier?.value||"").trim();
      var password=String(loginForm.elements.password?.value||"");
      if(status){status.classList.add("show");status.textContent="Signing in securely...";}
      if(button)button.disabled=true;
      try{
        var response=await fetch("/api/water-club/auth/login",{
          method:"POST",
          credentials:"same-origin",
          headers:{"content-type":"application/json"},
          body:JSON.stringify({identifier:identifier,password:password})
        });
        var data={};
        try{data=await response.json();}catch(_){}
        if(!response.ok||!data.ok){
          throw new Error(data.message||"Member login is not available yet.");
        }
        loginForm.reset();
        if(status)status.textContent="Login successful. Opening your member dashboard...";
        window.setTimeout(function(){window.location.href="water-club-account.html";},350);
      }catch(error){
        if(status){
          status.classList.add("show");
          status.textContent=error.message||"Unable to sign in.";
        }
      }finally{
        if(button)button.disabled=false;
      }
    });
  }

  document.querySelectorAll("[data-auth-prototype]").forEach(function(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var status=form.parentElement.querySelector(".wc-auth-status");
      if(status){
        status.classList.add("show");
        status.textContent="Phone OTP signup is intentionally disabled until an approved OTP provider is connected. No account or credential was created.";
      }
    });
  });
});