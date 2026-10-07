/* LocalMedia247 — independent building interaction.
   The headquarters and the live news screen are deliberately separate
   interaction surfaces. The building is detected from its real transformed
   viewport rectangle, while the news wall is explicitly excluded. */

(function(){
    "use strict";

    if(window.__lm247IndependentBuildingLayer) return;
    window.__lm247IndependentBuildingLayer = true;

    function getBuilding(){
        return document.getElementById("lm247Building");
    }

    function getScreen(){
        return document.getElementById("lm247NewsWall");
    }

    function inside(rect,x,y){
        return !!rect &&
               x >= rect.left && x <= rect.right &&
               y >= rect.top && y <= rect.bottom;
    }

    function isInsideBuildingButNotScreen(event){
        if(!event || typeof event.clientX !== "number" || typeof event.clientY !== "number") {
            return false;
        }

        var building = getBuilding();
        if(!building) return false;

        var buildingRect = building.getBoundingClientRect();

        /* The news wall owns its entire visible interaction area. */
        var screen = getScreen();
        var screenRect = screen ? screen.getBoundingClientRect() : null;
        if(screenRect && inside(screenRect,event.clientX,event.clientY)) {
            return false;
        }

        return inside(buildingRect,event.clientX,event.clientY);
    }

    function openBuilding(event){
        if(!event) return false;

        var panel = document.querySelector(".lm247-experience-overlay");
        if(!panel || typeof panel._open !== "function") return false;
        if(panel.classList.contains("open")) return true;

        event.preventDefault();
        event.stopImmediatePropagation();
        panel._open();
        return true;
    }

    function handlePointer(event){
        /* Mouse clicks and touch taps both use the same independent
           building hit test. Do not interfere with the news screen. */
        if(event.type === "pointerup" && event.pointerType === "mouse") return;
        if(!isInsideBuildingButNotScreen(event)) return;
        openBuilding(event);
    }

    function handleClick(event){
        if(!isInsideBuildingButNotScreen(event)) return;
        openBuilding(event);
    }

    function install(){
        if(window.__lm247IndependentBuildingInstalled) return;
        if(!getBuilding()) return;
        window.__lm247IndependentBuildingInstalled=true;

        /* Capture before the museum's generic world/building handlers.
           This is deliberately scoped to the LocalMedia247 building. */
        window.addEventListener("pointerup",handlePointer,true);
        window.addEventListener("touchend",handlePointer,true);
        window.addEventListener("click",handleClick,true);

        var building=getBuilding();
        building.setAttribute("tabindex","0");
        building.setAttribute("role","button");
        building.setAttribute("aria-label","Open LocalMedia247");
        building.style.cursor="pointer";

        building.addEventListener("keydown",function(event){
            if(event.key === "Enter" || event.key === " "){
                event.preventDefault();
                event.stopImmediatePropagation();
                openBuilding(event);
            }
        },true);

        /* Direct building listener: the building owns its own interaction.
           The news wall is a separate sibling and remains untouched. */
        building.addEventListener("click",function(event){
            if(event.target && event.target.closest && event.target.closest("#lm247NewsWall")) return;
            openBuilding(event);
        },true);
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded",install,{once:true});
    }else{
        install();
    }

    window.addEventListener("load",function(){
        /* The building is normally already present; this retry only protects
           against the museum being initialized after DOMContentLoaded. */
        install();
    },{once:true});
})();