/* LocalMedia247 interaction — native building target.
   The headquarters itself is the authoritative hit target. Decorative
   children are disabled by CSS so the building receives the click. */
(function(){
  "use strict";
  if(window.__lm247NativeInteraction) return;
  window.__lm247NativeInteraction = true;

  function open(event){
    if(event && event.button !== undefined && event.button !== 0) return;
    var panel=document.querySelector(".lm247-experience-overlay");
    if(!panel || typeof panel._open !== "function" || panel.classList.contains("open")) return;
    if(event){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    var generic=document.getElementById("museum-video-panel");
    if(generic) generic.remove();
    panel._open();
  }

  function bind(){
    var building=document.getElementById("lm247Building");
    if(!building) return;
    if(building.dataset.nativeLm247Bound==="true") return;
    building.dataset.nativeLm247Bound="true";
    building.style.pointerEvents="auto";
    building.addEventListener("click",open,true);
    building.addEventListener("keydown",function(e){
      if(e.key==="Enter" || e.key===" "){
        e.preventDefault();
        open(e);
      }
    },true);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",bind,{once:true});
  }else{
    bind();
  }
  setTimeout(bind,500);
  setTimeout(bind,1500);
  window.addEventListener("resize",bind,{passive:true});
})();