/* LocalMedia247 — final viewport interaction layer.
   The museum contains several global building hit surfaces at z-index
   2147483646. This layer intentionally sits one level above them so the
   LocalMedia247 headquarters cannot be masked by another building's
   transparent interaction surface. */

(function(){
    "use strict";

    if(window.__lm247FinalViewportLayer) return;
    window.__lm247FinalViewportLayer = true;

    var zones = [];
    var active = false;

    function inside(rect,x,y){
        return x >= rect.left && x <= rect.right &&
               y >= rect.top && y <= rect.bottom;
    }

    function openStudio(event){
        if(!event || event.type !== "click") return;

        var panel = document.querySelector(".lm247-experience-overlay");
        if(!panel || typeof panel._open !== "function") return;
        if(panel.classList.contains("open")) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        panel._open();
        setTimeout(syncZones, 0);
    }

    function syncZones(){
        var building = document.getElementById("lm247Building");
        if(!building || !zones.length) return;

        var rect = building.getBoundingClientRect();
        var screen = document.getElementById("lm247NewsWall");
        var screenRect = screen ? screen.getBoundingClientRect() : null;
        var title = building.querySelector(".lm247Title");
        var titleRect = title ? title.getBoundingClientRect() : null;

        /* Rebuild the four viewport zones from the building's actual
           transformed screen position. The news screen remains free. */
        var specs = [
            {l:rect.left,t:rect.top,w:Math.max(0,rect.width-108),h:rect.height},
            {l:rect.right-108,t:rect.top,w:108,h:48},
            {l:rect.right-108,t:rect.top+190,w:108,h:Math.max(0,rect.height-190)}
        ];

        specs.forEach(function(s,i){
            var z=zones[i];
            z.style.left=Math.round(s.l)+"px";
            z.style.top=Math.round(s.t)+"px";
            z.style.width=Math.round(s.w)+"px";
            z.style.height=Math.round(s.h)+"px";
        });

        var titleZone=zones[3];
        if(titleZone){
            if(titleRect){
                titleZone.style.left=Math.round(titleRect.left)+"px";
                titleZone.style.top=Math.round(titleRect.top)+"px";
                titleZone.style.width=Math.round(titleRect.width)+"px";
                titleZone.style.height=Math.round(titleRect.height)+"px";
                titleZone.style.display="block";
            }else{
                titleZone.style.display="none";
            }
        }

        /* If the live screen overlaps a zone because its responsive size
           changed, temporarily remove only the overlapping portion by
           keeping the screen's own layer above the hit layer. */
        if(screenRect) screen.style.zIndex = "2147483647";
    }

    function setEnabled(){
        var panel=document.querySelector(".lm247-experience-overlay");
        var open=panel && panel.classList.contains("open");
        zones.forEach(function(z){ z.style.pointerEvents=open ? "none" : "auto"; });
    }

    function create(){
        if(active) return;
        var building=document.getElementById("lm247Building");
        if(!building) return;

        active=true;

        for(var i=0;i<4;i++){
            var z=document.createElement("button");
            z.type="button";
            z.className="lm247-final-viewport-zone";
            z.setAttribute("aria-label","Open LocalMedia247");
            z.style.position="fixed";
            z.style.margin="0";
            z.style.padding="0";
            z.style.border="0";
            z.style.background="transparent";
            z.style.outline="none";
            z.style.cursor="pointer";
            z.style.touchAction="manipulation";
            z.style.pointerEvents="auto";
            z.style.zIndex="2147483647";
            z.style.display=i===3 ? "none" : "block";
            z.addEventListener("click",openStudio,true);
            document.body.appendChild(z);
            zones.push(z);
        }

        syncZones();
        setEnabled();

        var world=document.getElementById("world");
        if(world){
            new MutationObserver(function(){
                syncZones();
                setEnabled();
            }).observe(world,{attributes:true,attributeFilter:["style"]});
        }

        window.addEventListener("resize",syncZones,{passive:true});
        window.addEventListener("scroll",syncZones,{passive:true});
        window.addEventListener("load",syncZones,{once:true});

        setTimeout(syncZones,100);
        setTimeout(syncZones,500);
        setTimeout(syncZones,1500);

        var bodyObserver=new MutationObserver(setEnabled);
        bodyObserver.observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","hidden","style"]});
    }

    if(document.readyState==="loading"){
        document.addEventListener("DOMContentLoaded",create,{once:true});
    }else{
        create();
    }

    window.addEventListener("load",create,{once:true});
})();
