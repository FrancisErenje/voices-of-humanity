/* LocalMedia247 — viewport-root interaction target.
   The museum world is transformed and contains many overlapping visual layers.
   This single button lives directly under #viewport, outside #world, so its
   stacking context is independent of the transformed campus artwork. */
(function(){
  "use strict";
  if(window.__lm247ViewportInteraction) return;
  window.__lm247ViewportInteraction = true;

  var viewport, button, raf = 0;

  function panel(){
    return document.querySelector(".lm247-experience-overlay");
  }

  function open(event){
    var p = panel();
    if(!p || typeof p._open !== "function" || p.classList.contains("open")) return;
    if(event){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    var generic = document.getElementById("museum-video-panel");
    if(generic) generic.remove();
    p._open();
  }

  function ensure(){
    viewport = document.getElementById("viewport");
    if(!viewport) return false;

    if(!button){
      button = document.createElement("button");
      button.type = "button";
      button.id = "lm247ViewportHit";
      button.setAttribute("aria-label","Open LocalMedia247");
      button.title = "Open LocalMedia247";
      Object.assign(button.style,{
        position:"fixed",
        display:"block",
        margin:"0",
        padding:"0",
        border:"0",
        background:"transparent",
        boxShadow:"none",
        opacity:"0",
        pointerEvents:"auto",
        cursor:"pointer",
        zIndex:"2147483647",
        touchAction:"manipulation",
        WebkitTapHighlightColor:"transparent"
      });
      button.addEventListener("click",open,true);
      viewport.appendChild(button);
    }
    return true;
  }

  function sync(){
    raf=0;
    if(!ensure()) return;

    var building=document.getElementById("lm247Building");
    if(!building){
      button.style.display="none";
      return;
    }

    var r=building.getBoundingClientRect();
    if(r.width<=0 || r.height<=0 || r.bottom<=0 || r.right<=0 ||
       r.left>=window.innerWidth || r.top>=window.innerHeight){
      button.style.display="none";
      return;
    }

    /* Keep the transparent target strictly over the headquarters artwork.
       The live news wall is a sibling and therefore remains clickable. */
    button.style.display="block";
    button.style.left=Math.max(0,r.left)+"px";
    button.style.top=Math.max(0,r.top)+"px";
    button.style.width=Math.min(r.width,window.innerWidth-Math.max(0,r.left))+"px";
    button.style.height=Math.min(r.height,window.innerHeight-Math.max(0,r.top))+"px";
  }

  function schedule(){
    if(!raf) raf=requestAnimationFrame(sync);
  }

  function init(){
    if(!ensure()) return;
    sync();
    window.addEventListener("resize",schedule,{passive:true});
    window.addEventListener("scroll",schedule,{passive:true});
    if(window.ResizeObserver){
      var ro=new ResizeObserver(schedule);
      var b=document.getElementById("lm247Building");
      if(b) ro.observe(b);
    }
    (function tick(){
      sync();
      requestAnimationFrame(tick);
    })();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();