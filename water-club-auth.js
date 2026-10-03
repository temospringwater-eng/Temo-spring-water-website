document.addEventListener("DOMContentLoaded",function(){
  document.querySelectorAll("[data-auth-prototype]").forEach(function(form){
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var status=form.parentElement.querySelector(".wc-auth-status");
      if(status){
        status.classList.add("show");
        status.textContent="Secure Water Club authentication backend is not connected on this preview branch yet. No login, OTP, password or customer data was sent or stored.";
      }
    });
  });
});