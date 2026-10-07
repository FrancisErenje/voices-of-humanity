/* LocalMedia247 — independent building interaction.
   The headquarters and the live news screen are deliberately separate
   interaction surfaces. The building is identified from the actual event
   path first, with its transformed viewport rectangle as a fallback. */

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

    function pathContains(event, selector){
        if(!event || typeof event.composedPath !== "function") return false;
        return event.composedPath().some(function(node){
            return node && node.nodeType === 1 &&
                   typeof node.matches === "function" &&
                   node.matches(selector);
        });
    }

    function isInsideBuildingButNotScreen(event){
        if(!event) return false;

        /* This is the authoritative test. It remains correct even when
           the museum world is scaled/translated by its camera transform. */
        if(pathContains(event, "#lm247NewsWall")) return false;
        if(pathContains(event, "#lm247Building")) return true;

        /* Fallback for gestures whose target path is unavailable. */
        if(typeof event.clientX !== "number" || typeof event.clientY !== "number") {
            return false;
        }

        var building = getBuilding();
        if(!building) return false;

        var screen = getScreen();
        var screenRect = screen ? screen.getBoundingClientRect() : null;
        if(screenRect && inside(screenRect,event.clientX,event.clientY)) return false;

        return inside(building.getBoundingClientRect(),event.clientX,event.clientY);
    }

    function openBuilding(event){
        /* Use the museum's single authoritative LocalMedia247 opener. */
        if(typeof window.__vohOpenLocalMedia247 === "function"){
            return window.__vohOpenLocalMedia247();
        }

        var panel = document.querySelector(".lm247-experience-overlay");
        if(!panel || typeof panel._open !== "function") return false;
        if(panel.classList.contains("open")) return true;

        if(event){
            event.preventDefault();
            if(typeof event.stopImmediatePropagation === "function"){
                event.stopImmediatePropagation();
            }else if(typeof event.stopPropagation === "function"){
                event.stopPropagation();
            }
        }

        var genericPanel = document.getElementById("museum-video-panel");
        if(genericPanel) genericPanel.remove();

        panel._open();
        return true;
    }

    function handlePointer(event){
        if(!isInsideBuildingButNotScreen(event)) return;

        /* Open on the initial pointerdown. This avoids relying on a later
           click event after the museum camera layer has processed the gesture. */
        if(event.type === "pointerdown" || event.type === "touchend"){
            openBuilding(event);
        }
    }

    function handleClick(event){
        if(!isInsideBuildingButNotScreen(event)) return;
        openBuilding(event);
    }

    function install(){
        if(window.__lm247IndependentBuildingInstalled) return;
        var building=getBuilding();
        if(!building) return;

        window.__lm247IndependentBuildingInstalled=true;

        window.addEventListener("pointerdown",handlePointer,true);
        window.addEventListener("touchend",handlePointer,true);
        window.addEventListener("click",handleClick,true);

        building.setAttribute("tabindex","0");
        building.setAttribute("role","button");
        building.setAttribute("aria-label","Open LocalMedia247");
        building.style.cursor="pointer";
        building.style.pointerEvents="auto";

        building.addEventListener("keydown",function(event){
            if(event.key === "Enter" || event.key === " "){
                event.preventDefault();
                event.stopImmediatePropagation();
                openBuilding(event);
            }
        },true);

        building.addEventListener("click",function(event){
            if(pathContains(event,"#lm247NewsWall")) return;
            openBuilding(event);
        },true);
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded",install,{once:true});
    }else{
        install();
    }

    window.addEventListener("load",install,{once:true});
    setTimeout(install,500);
    setTimeout(install,1500);
})();
