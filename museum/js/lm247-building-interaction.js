/* LocalMedia247 authoritative interaction layer.
   Uses the rendered building rectangle instead of an oversized transparent
   hit button, so the live news screen keeps its own visual and click layer. */
(function(){
    function init(){
        const viewport = document.getElementById("viewport");
        const building = document.getElementById("lm247Building");
        const screen = document.getElementById("lm247NewsWall");
        if(!viewport || !building) return;
        if(viewport.dataset.lm247AuthoritativePress === "true") return;
        viewport.dataset.lm247AuthoritativePress = "true";

        let sx=0, sy=0, active=false;

        function inRect(rect,x,y){
            return x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom;
        }

        function openStudio(e){
            const panel=document.querySelector(".lm247-experience-overlay");
            if(!panel || typeof panel._open!=="function") return;
            e.preventDefault();
            e.stopPropagation();
            if(e.stopImmediatePropagation) e.stopImmediatePropagation();
            panel._open();
        }

        viewport.addEventListener("pointerdown",function(e){
            if(e.button!==undefined && e.button!==0) return;
            sx=e.clientX; sy=e.clientY; active=true;
        },true);

        function tryBuildingOpen(e){
            const br=building.getBoundingClientRect();
            if(!inRect(br,e.clientX,e.clientY)) return false;
            if(screen){
                const sr=screen.getBoundingClientRect();
                if(inRect(sr,e.clientX,e.clientY)) return false;
            }
            openStudio(e);
            return true;
        }

        viewport.addEventListener("pointerup",function(e){
            if(!active) return;
            active=false;
            if(Math.hypot(e.clientX-sx,e.clientY-sy)>10) return;
            tryBuildingOpen(e);
        },true);

        document.addEventListener("click",function(e){
            if(e.defaultPrevented) return;
            tryBuildingOpen(e);
        },true);dia247 authoritative interaction layer.
   Uses the rendered building rectangle instead of an oversized transparent
   hit button, so the live news screen keeps its own visual and click layer. */
(function(){
    function init(){
        const viewport = document.getElementById("viewport");
        const building = document.getElementById("lm247Building");
        const screen = document.getElementById("lm247NewsWall");
        if(!viewport || !building) return;
        if(viewport.dataset.lm247AuthoritativePress === "true") return;
        viewport.dataset.lm247AuthoritativePress = "true";

        let sx=0, sy=0, active=false;

        function inRect(rect,x,y){
            return x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom;
        }

        function openStudio(e){
            const panel=document.querySelector(".lm247-experience-overlay");
            if(!panel || typeof panel._open!=="function") return;
            e.preventDefault();
            e.stopPropagation();
            if(e.stopImmediatePropagation) e.stopImmediatePropagation();
            panel._open();
        }

        viewport.addEventListener("pointerdown",function(e){
            if(e.button!==undefined && e.button!==0) return;
            sx=e.clientX; sy=e.clientY; active=true;
        },true);

        viewport.addEventListener("pointerup",function(e){
            if(!active) return;
            active=false;
            if(Math.hypot(e.clientX-sx,e.clientY-sy)>10) return;

            const br=building.getBoundingClientRect();
            if(!inRect(br,e.clientX,e.clientY)) return;

            if(screen){
                const sr=screen.getBoundingClientRect();
                if(inRect(sr,e.clientX,e.clientY)) return;
            }

            openStudio(e);
        },true);
    }

    if(document.readyState==="loading"){
        document.addEventListener("DOMContentLoaded",init,{once:true});
    }else{
        init();
    }
    setTimeout(init,500);
    setTimeout(init,1500);
})();