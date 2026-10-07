/* LocalMedia247 — dedicated viewport interaction target.
   One target only. It sits directly under #viewport, outside the transformed
   museum world, so the camera and decorative building layers cannot swallow
   the opening gesture. */
(function(){
  "use strict";
  if(window.__lm247ViewportInteraction) return;
  window.__lm247ViewportInteraction = true;

  var viewport, button, raf = 0, openQueued = false;

  function getPanel(){
    return document.querySelector(".lm247-experience-overlay");
  }

  function openStudio(){
    if(openQueued) return;
    var p = getPanel();
    if(!p || typeof p._open !== "function" || p.classList.contains("open")) return;
    openQueued = true;
    window.setTimeout(function(){
      openQueued = false;
      var panel = getPanel();
      if(!panel || typeof panel._open !== "function" || panel.classList.contains("open")) return;
      var generic = document.getElementById("museum-video-panel");
      if(generic) generic.remove();
      panel._open();
    }, 0);
  }

  function consume(event){
    if(event){
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
    openStudio();
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

      /* Take ownership at the initial press. We deliberately do not call
         preventDefault(), so the browser may still synthesize a normal click.
         The later click is also consumed by this same target. */
      button.addEventListener("pointerdown", consume, true);
      button.addEventListener("mousedown", consume, true);
      button.addEventListener("touchstart", consume, true);
      button.addEventListener("click", consume, true);
      button.addEventListener("keydown", function(event){
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          event.stopImmediatePropagation();
          openStudio();
        }
      }, true);

      viewport.appendChild(button);
    }
    return true;
  }

  function sync(){
    raf = 0;
    if(!ensure()) return;

    var building = document.getElementById("lm247Building");
    if(!building){
      button.style.display = "none";
      return;
    }

    var r = building.getBoundingClientRect();
    if(r.width <= 0 || r.height <= 0 ||
       r.bottom <= 0 || r.right <= 0 ||
       r.left >= window.innerWidth || r.top >= window.innerHeight){
      button.style.display = "none";
      return;
    }

    button.style.display = "block";
    button.style.left = Math.max(0,r.left) + "px";
    button.style.top = Math.max(0,r.top) + "px";
    button.style.width =
      Math.min(r.width,window.innerWidth-Math.max(0,r.left)) + "px";
    button.style.height =
      Math.min(r.height,window.innerHeight-Math.max(0,r.top)) + "px";
  }

  function schedule(){
    if(!raf) raf = requestAnimationFrame(sync);
  }

  function init(){
    if(!ensure()) return;
    sync();
    window.addEventListener("resize",schedule,{passive:true});
    window.addEventListener("scroll",schedule,{passive:true});

    if(window.ResizeObserver){
      var ro = new ResizeObserver(schedule);
      var b = document.getElementById("lm247Building");
      if(b) ro.observe(b);
    }

    (function tick(){
      sync();
      requestAnimationFrame(tick);
    })();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();