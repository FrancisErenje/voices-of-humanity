/* LocalMedia247 authoritative interaction layer.
   The building uses the same document-level pointer strategy as the
   working Hall of Humanity interaction, while excluding the live news wall. */
(function(){
    "use strict";

    function init(){
        const building = document.getElementById("lm247Building");
        const screen = document.getElementById("lm247NewsWall");
        if(!building) return;

        if(document.documentElement.dataset.lm247AuthoritativePress === "true") return;
        document.documentElement.dataset.lm247AuthoritativePress = "true";

        let startX = null;
        let startY = null;

        function inside(rect,x,y){
            return x >= rect.left && x <= rect.right &&
                   y >= rect.top && y <= rect.bottom;
        }

        function isOnScreen(e){
            if(!screen) return false;
            const r = screen.getBoundingClientRect();
            return inside(r,e.clientX,e.clientY);
        }

        function openStudio(e){
            if(isOnScreen(e)) return false;

            const panel = document.querySelector(".lm247-experience-overlay");
            if(!panel || typeof panel._open !== "function") return false;

            e.preventDefault();
            e.stopImmediatePropagation();
            panel._open();
            return true;
        }

        document.addEventListener("pointerdown", function(e){
            if(e.button !== undefined && e.button !== 0) return;

            const r = building.getBoundingClientRect();
            if(inside(r,e.clientX,e.clientY) && !isOnScreen(e)){
                startX = e.clientX;
                startY = e.clientY;
            }else{
                startX = null;
                startY = null;
            }
        }, true);

        document.addEventListener("pointerup", function(e){
            if(startX === null || startY === null) return;

            const moved = Math.hypot(
                e.clientX - startX,
                e.clientY - startY
            );

            startX = null;
            startY = null;

            if(moved > 12) return;

            const r = building.getBoundingClientRect();
            if(inside(r,e.clientX,e.clientY) && !isOnScreen(e)){
                openStudio(e);
            }
        }, true);

        document.addEventListener("click", function(e){
            if(e.defaultPrevented) return;
            if(isOnScreen(e)) return;

            const r = building.getBoundingClientRect();
            if(!inside(r,e.clientX,e.clientY)) return;

            openStudio(e);
        }, true);

        building.style.pointerEvents = "auto";
        building.style.cursor = "pointer";
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded",init,{once:true});
    }else{
        init();
    }

    window.addEventListener("load",init,{once:true});
    setTimeout(init,500);
    setTimeout(init,1500);
})();