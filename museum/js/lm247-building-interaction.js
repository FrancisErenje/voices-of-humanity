/* LocalMedia247 — authoritative click ownership.
   The museum camera transforms #world, so normal DOM hit-testing can be
   unreliable. We therefore test the final screen coordinates at window
   capture time, but activate ONLY on the completed click. This is important:
   opening on pointerdown/touchstart races with the studio's outside-click
   close guard and makes the panel appear not to open. */

(function(){
    "use strict";

    if(window.__lm247ClickOwnerInstalled) return;
    window.__lm247ClickOwnerInstalled = true;

    function inside(rect,x,y){
        return x >= rect.left && x <= rect.right &&
               y >= rect.top && y <= rect.bottom;
    }

    function openFromClick(event){
        if(!event || event.type !== "click") return;
        if(event.button !== undefined && event.button !== 0) return;

        var building = document.getElementById("lm247Building");
        var panel = document.querySelector(".lm247-experience-overlay");
        if(!building || !panel || typeof panel._open !== "function") return;
        if(panel.classList.contains("open")) return;

        var x = event.clientX;
        var y = event.clientY;
        if(typeof x !== "number" || typeof y !== "number") return;

        /* The visible brand title sits above the building's box. */
        var buildingRect = building.getBoundingClientRect();
        var title = building.querySelector(".lm247Title");
        var titleRect = title ? title.getBoundingClientRect() : null;

        var inBuilding = inside(buildingRect,x,y);
        var inTitle = titleRect ? inside(titleRect,x,y) : false;

        if(!inBuilding && !inTitle) return;

        /* The live news wall owns its own interaction. */
        var screen = document.getElementById("lm247NewsWall");
        if(screen && inside(screen.getBoundingClientRect(),x,y)) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        panel._open();
    }

    /* One event, one owner. This deliberately avoids pointerdown/mousedown/
       touchstart so the studio cannot be opened and then immediately closed
       by the browser's follow-up click. */
    window.addEventListener("click",openFromClick,true);
})();
