/* LocalMedia247 — one authoritative interaction path. */
(function(){
  "use strict";
  if(window.__lm247SingleInteraction) return;
  window.__lm247SingleInteraction = true;

  function inside(r,x,y){
    return r && r.width>0 && r.height>0 &&
      x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
  }

  function openStudio(event){
    if(!event || (event.type!=="pointerdown" && event.type!=="click")) return;
    if(event.button!==undefined && event.button!==0) return;

    var building=document.getElementById("lm247Building");
    var title=building && building.querySelector(".lm247Title");
    var screen=document.getElementById("lm247NewsWall");
    var panel=document.querySelector(".lm247-experience-overlay");
    if(!building || !panel || typeof panel._open!=="function" || panel.classList.contains("open")) return;

    var x=event.clientX, y=event.clientY;
    var hit=inside(building.getBoundingClientRect(),x,y) ||
            (title && inside(title.getBoundingClientRect(),x,y));
    if(!hit) return;

    if(screen && inside(screen.getBoundingClientRect(),x,y)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    window.__lm247OpeningUntil=Date.now()+1000;

    var generic=document.getElementById("museum-video-panel");
    if(generic) generic.remove();

    panel._open();
  }

  window.addEventListener("pointerdown",openStudio,true);
  window.addEventListener("click",openStudio,true);
})();