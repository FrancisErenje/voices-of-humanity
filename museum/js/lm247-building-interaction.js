/* LocalMedia247 — single authoritative interaction path. */
(function(){
  "use strict";
  if(window.__lm247SingleInteraction) return;
  window.__lm247SingleInteraction = true;

  function openStudio(event){
    if(!event) return;
    if(event.type !== "pointerdown" && event.type !== "click") return;
    if(event.button !== undefined && event.button !== 0) return;

    var complex=document.getElementById("lm247Complex");
    var screen=document.getElementById("lm247NewsWall");
    var panel=document.querySelector(".lm247-experience-overlay");
    if(!complex || !panel || typeof panel._open !== "function" || panel.classList.contains("open")) return;

    var r=complex.getBoundingClientRect();
    var x=event.clientX, y=event.clientY;
    if(!r.width || !r.height || x<r.left || x>r.right || y<r.top || y>r.bottom) return;

    if(screen){
      var sr=screen.getBoundingClientRect();
      if(x>=sr.left && x<=sr.right && y>=sr.top && y<=sr.bottom) return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    window.__lm247OpeningUntil=Date.now()+800;

    var generic=document.getElementById("museum-video-panel");
    if(generic) generic.remove();

    panel._open();
  }

  window.addEventListener("pointerdown",openStudio,true);
  window.addEventListener("click",openStudio,true);
})();