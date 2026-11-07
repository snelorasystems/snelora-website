/* Snelora shared behaviour: mobile menu and the "AI receptionist" nav dropdown.
   Loaded by every page, so the header behaves the same everywhere. */
(function(){
  var menuBtn = document.getElementById("menuBtn"), links = document.getElementById("siteLinks");
  var dd = document.querySelector(".site-head .dd");
  var ddBtn = dd && dd.querySelector(".dd-btn");
  var mobile = window.matchMedia("(max-width:900px)");
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)");

  function setDD(open){
    if(!dd) return;
    dd.classList.toggle("open", open);
    ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  /* Mobile menu */
  function setMenu(open){
    if(!menuBtn || !links) return;
    links.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if(open && mobile.matches) setDD(true);   // show both pages straight away in the phone menu
    if(!open) setDD(false);
  }
  if(menuBtn && links){
    menuBtn.addEventListener("click", function(){ setMenu(!links.classList.contains("open")); });
    links.addEventListener("click", function(e){ if(e.target.closest && e.target.closest("a")) setMenu(false); });
    document.addEventListener("click", function(e){
      if(links.classList.contains("open") && !links.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
    });
  }

  /* Dropdown */
  if(dd){
    var hoverTimer = null, openedByHover = false;
    ddBtn.addEventListener("click", function(){
      var open = dd.classList.contains("open");
      if(open && openedByHover){ openedByHover = false; return; }   // hover already opened it; a click keeps it open
      openedByHover = false;
      setDD(!open);
    });
    dd.addEventListener("mouseenter", function(){
      if(!canHover.matches || mobile.matches) return;
      clearTimeout(hoverTimer);
      if(!dd.classList.contains("open")){ openedByHover = true; setDD(true); }
    });
    dd.addEventListener("mouseleave", function(){
      if(!canHover.matches || mobile.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function(){ openedByHover = false; setDD(false); }, 180);
    });
    dd.addEventListener("focusout", function(e){
      if(!mobile.matches && !dd.contains(e.relatedTarget)) setDD(false);
    });
    document.addEventListener("click", function(e){
      if(!mobile.matches && dd.classList.contains("open") && !dd.contains(e.target)) setDD(false);
    });
  }

  document.addEventListener("keydown", function(e){
    if(e.key !== "Escape") return;
    if(dd && dd.classList.contains("open") && !mobile.matches){ setDD(false); ddBtn.focus(); return; }
    setMenu(false);
  });
  mobile.addEventListener("change", function(){ setMenu(false); });
})();
