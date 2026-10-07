/* LocalMedia247 — authoritative screen-space hit layer.
   The museum camera transforms #world, and decorative/camera layers can
   become the browser's normal hit target. These fixed transparent controls
   track the building's actual viewport rectangle, so the visible building
   remains clickable regardless of which world element is painted above it. */
(function(){
    "use strict";

    var installed = false;
    var zones = [];

    function pointInside(rect,x,y){
        return x >= rect.left && x <= rect.right &&
               y >= rect.top && y <= rect.bottom;
    }

    function openStudio(event){
        var panel = document.querySelector(".lm247-experience-overlay");
        if(!panel || typeof panel._open !== "function") return;

        if(event){
            event.preventDefault();
            if(event.stopImmediatePropagation) event.stopImmediatePropagation();
            else if(event.stopPropagation) event.stopPropagation();
        }

        /* Never open the studio twice from the same gesture. */
        if(panel.classList.contains("open")) return;
        panel._open();

        zones.forEach(function(zone){
            zone.style.pointerEvents = "none";
        });
    }

    function syncZones(){
        var building = document.getElementById("lm247Building");
        if(!building || !zones.length) return;

        var rect = building.getBoundingClientRect();

        /* Three zones deliberately leave the live news screen uncovered:
           left body, upper-right building strip, lower-right building strip. */
        var specs = [
            {left:0, top:0, width:Math.max(0,rect.width - 108), height:rect.height},
            {left:rect.width - 108, top:0, width:108, height:48},
            {left:rect.width - 108, top:190, width:108, height:Math.max(0,rect.height - 190)}
        ];

        specs.forEach(function(spec,index){
            var zone = zones[index];
            if(!zone) return;

            zone.style.left = Math.round(rect.left + spec.left) + "px";
            zone.style.top = Math.round(rect.top + spec.top) + "px";
            zone.style.width = Math.round(spec.width) + "px";
            zone.style.height = Math.round(spec.height) + "px";
        });
    }

    function createZones(){
        if(installed) return;
        var building = document.getElementById("lm247Building");
        if(!building) return;

        installed = true;

        for(var i=0;i<3;i++){
            var zone = document.createElement("button");
            zone.type = "button";
            zone.className = "lm247-authoritative-hit-zone";
            zone.setAttribute("aria-label","Open LocalMedia247");
            zone.setAttribute("title","Open LocalMedia247");
            zone.style.position = "fixed";
            zone.style.margin = "0";
            zone.style.padding = "0";
            zone.style.border = "0";
            zone.style.background = "transparent";
            zone.style.outline = "none";
            zone.style.cursor = "pointer";
            zone.style.touchAction = "manipulation";
            zone.style.pointerEvents = "auto";
            zone.style.zIndex = "2147483000";

            zone.addEventListener("pointerdown",openStudio,true);
            zone.addEventListener("mousedown",openStudio,true);
            zone.addEventListener("touchstart",openStudio,true);
            zone.addEventListener("click",openStudio,true);

            document.body.appendChild(zone);
            zones.push(zone);
        }

        syncZones();

        /* The camera updates #world with transform. Observe that transform
           instead of running a permanent animation loop. */
        var world = document.getElementById("world");
        if(world){
            var observer = new MutationObserver(syncZones);
            observer.observe(world,{attributes:true,attributeFilter:["style"]});
        }

        window.addEventListener("resize",syncZones,{passive:true});
        window.addEventListener("scroll",syncZones,{passive:true});
        window.addEventListener("pointermove",function(){
            if(window.__lm247SyncQueued) return;
            window.__lm247SyncQueued = true;
            requestAnimationFrame(function(){
                window.__lm247SyncQueued = false;
                syncZones();
            });
        },{passive:true});

        /* Catch late camera/layout initialization without a permanent loop. */
        setTimeout(syncZones,100);
        setTimeout(syncZones,500);
        setTimeout(syncZones,1500);
    }

    function reenableAfterClose(){
        var panel = document.querySelector(".lm247-experience-overlay");
        var open = panel && panel.classList.contains("open");
        zones.forEach(function(zone){
            zone.style.pointerEvents = open ? "none" : "auto";
        });
    }

    function init(){
        createZones();
        reenableAfterClose();

        var observer = new MutationObserver(reenableAfterClose);
        observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","style","hidden"]});
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded",init,{once:true});
    }else{
        init();
    }

    window.addEventListener("load",function(){
        createZones();
        syncZones();
    },{once:true});
})();
