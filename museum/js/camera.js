/*======================================*
 * VOICES OF HUMANITY MUSEUM
 * CAMERA ENGINE v2.1
 *======================================*
 *
 * Controls:
 *
 * LEFT MOUSE DRAG
 *     → Move around the museum
 *
 * TWO-FINGER TRACKPAD SCROLL
 *     → Pan around the museum
 *
 * CTRL + WHEEL / PINCH
 *     → Zoom in / out
 *
 *======================================*/


const viewport =
    document.getElementById("viewport");

const world =
    document.getElementById("world");


/*======================================*
 * CAMERA STATE
 *======================================*/

const Camera = {

    x: 0,

    y: 0,

    /*==================================
     * OPENING VIEW
     * Begin at the southern gate area,
     * zoomed far out so visitors see
     * the museum as a complete campus.
     *==================================*/

    scale: 0.34,

    minScale: 0.30,

    maxScale: 3,

    isDragging: false,

    startX: 0,

    startY: 0

};


/*======================================*
 * OPENING CAMERA POSITION
 *======================================*/

/*
 * The main gate is the visitor's
 * starting point.  We deliberately
 * begin zoomed far out so the first
 * impression is the entire living
 * museum campus, not its top-left
 * corner.
 */

const openingGateX = 1500;
const openingGateY = 1650;

Camera.x =
    (viewport.clientWidth / 2) -
    (openingGateX * Camera.scale);

Camera.y =
    (viewport.clientHeight / 2) -
    (openingGateY * Camera.scale);


/*======================================*
 * CAMERA RENDER
 *======================================*/

function updateCamera() {

    world.style.transform =
        `translate(${Camera.x}px, ${Camera.y}px)
         scale(${Camera.scale})`;

    requestAnimationFrame(updateCamera);

}


updateCamera();


console.log(
    "✓ Camera Engine v2.1 Loaded"
);


/*======================================*
 * MOUSE DRAG
 *======================================*/

viewport.addEventListener(
    "mousedown",
    (e) => {

        /*
         * Only respond to
         * left mouse button.
         */

        if (e.button !== 0) return;


        Camera.isDragging = true;


        Camera.startX =
            e.clientX - Camera.x;


        Camera.startY =
            e.clientY - Camera.y;


        viewport.classList.add(
            "camera-dragging"
        );

    }
);


/*======================================*
 * MOUSE RELEASE
 *======================================*/

window.addEventListener(
    "mouseup",
    () => {

        Camera.isDragging = false;


        viewport.classList.remove(
            "camera-dragging"
        );

    }
);


/*======================================*
 * MOUSE MOVE
 *======================================*/

window.addEventListener(
    "mousemove",
    (e) => {

        if (!Camera.isDragging) return;


        Camera.x =
            e.clientX -
            Camera.startX;


        Camera.y =
            e.clientY -
            Camera.startY;

    }
);


/*======================================*
 * TRACKPAD / WHEEL
 *======================================*
 *
 * IMPORTANT:
 *
 * Normal wheel / two-finger scrolling
 * now PANs the museum.
 *
 * Ctrl + wheel
 * performs ZOOM.
 *
 * This prevents normal two-finger
 * scrolling from accidentally zooming.
 *
 *======================================*/

viewport.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();


        /*==================================
         * ZOOM
         *==================================*/

        if (e.ctrlKey) {

            const zoomSpeed = 0.08;


            if (e.deltaY < 0) {

                Camera.scale += zoomSpeed;

            }

            else {

                Camera.scale -= zoomSpeed;

            }


            Camera.scale =
                Math.max(
                    Camera.minScale,
                    Math.min(
                        Camera.maxScale,
                        Camera.scale
                    )
                );


            return;

        }


        /*==================================
         * PAN
         *==================================*/

        /*
         * deltaX = horizontal movement
         * deltaY = vertical movement
         */

        Camera.x -= e.deltaX;

        Camera.y -= e.deltaY;

    },

    {
        passive: false
    }
);


/*======================================*
 * BUILDING FOCUS / FLY TO
 *======================================*
 *
 * Building focus uses explicit WORLD coordinates.
 * This is important because some buildings use CSS
 * transforms (for example the Hall is centered with
 * translateX(-50%)); offsetLeft therefore is NOT the
 * same thing as the building's visible centre.
 *
 * Each target below points toward the building's
 * FRONT ENTRANCE rather than its roof/outer box.
 *======================================*/

function focusWorldPoint(worldX, worldY, scale = 1.35) {

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    Camera.scale = scale;

    Camera.x =
        (viewportWidth / 2) -
        (worldX * Camera.scale);

    Camera.y =
        (viewportHeight / 2) -
        (worldY * Camera.scale);

}


const buildingFocusTargets = {

    "hall-humanity": {
        x: 1500,
        y: 1145,
        scale: 1.35
    },

    "africaMuseum": {
        x: 560,
        y: 1245,
        scale: 1.45
    },

    "asiaMuseum": {
        x: 2410,
        y: 1060,
        scale: 1.45
    },

    "europeMuseum": {
        x: 1500,
        y: 705,
        scale: 1.45
    },

    "americasMuseum": {
        x: 600,
        y: 1985,
        scale: 1.45
    },

    "oceaniaMuseum": {
        x: 2400,
        y: 1685,
        scale: 1.45
    },

    /* Supporting visitor destinations */
    "documentary-cinema": {
        x: 1500,
        y: 1760,
        scale: 1.30
    },

    "lm247-studio": {
        x: 720,
        y: 850,
        scale: 1.35
    },

    "reflection-garden": {
        x: 2110,
        y: 2030,
        scale: 1.35
    }

};


function focusBuilding(id) {

    const target = buildingFocusTargets[id];

    if (!target) return;

    focusWorldPoint(
        target.x,
        target.y,
        target.scale
    );

    console.log(
        `✓ Focusing ${id} at front entrance`
    );

}


function activateBuildingFocus(element, id) {

    if (!element || !buildingFocusTargets[id]) return;

    element.classList.add("building-focus-target");
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");

    element.addEventListener("click", (event) => {

        event.stopPropagation();
        focusBuilding(id);

    });

    element.addEventListener("keydown", (event) => {

        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        focusBuilding(id);

    });

}


/*
 * The Hall's visible centre is x=1500.
 * Its CSS uses left:50% + translateX(-50%),
 * so using offsetLeft here would shift the camera
 * 360px to the right. The explicit target fixes that.
 */

activateBuildingFocus(
    document.getElementById("hall-humanity"),
    "hall-humanity"
);

activateBuildingFocus(
    document.getElementById("africaMuseum"),
    "africaMuseum"
);

activateBuildingFocus(
    document.getElementById("asiaMuseum"),
    "asiaMuseum"
);

activateBuildingFocus(
    document.getElementById("europeMuseum"),
    "europeMuseum"
);

activateBuildingFocus(
    document.getElementById("americasMuseum"),
    "americasMuseum"
);

activateBuildingFocus(
    document.getElementById("oceaniaMuseum"),
    "oceaniaMuseum"
);

/* Documentary Cinema */
activateBuildingFocus(
    document.getElementById("cinema"),
    "documentary-cinema"
);

/* LocalMedia247 Studio / Headquarters building */
activateBuildingFocus(
    document.getElementById("lm247Building"),
    "lm247-studio"
);

/* Reflection Garden is created later by the Garden Engine, so use
 * delegated events and catch it as soon as the visitor clicks it. */
if (typeof campus !== "undefined" && campus) {
    campus.addEventListener("click", (event) => {
        const garden = event.target.closest(
            '.museum-garden[data-garden-id="reflection-garden"]'
        );
        if (!garden) return;
        event.stopPropagation();
        focusBuilding("reflection-garden");
    });

    campus.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const garden = event.target.closest(
            '.museum-garden[data-garden-id="reflection-garden"]'
        );
        if (!garden) return;
        event.preventDefault();
        event.stopPropagation();
        focusBuilding("reflection-garden");
    });
}

/*======================================*
 * CAMERA STATUS
 *======================================*/

console.log(
    "Camera Position:",
    Camera
);

/* =========================================================
 * RESPONSIVE CAMERA + TOUCH INPUT
 * Version 24 responsive pass
 * ========================================================= */

function applyResponsiveCameraDefaults() {

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    /*
     * The museum is intentionally a fixed 3000×3000 world.
     * Smaller screens begin farther out so visitors can see
     * a meaningful portion of the living museum immediately.
     */
    let openingScale = 0.34;
    let minimumScale = 0.30;

    if (width <= 767) {
        openingScale = 0.18;
        minimumScale = 0.12;

        if (width > height) {
            openingScale = 0.20;
        }
    }
    else if (width <= 1199) {
        openingScale = 0.26;
        minimumScale = 0.20;
    }

    Camera.scale = openingScale;
    Camera.minScale = minimumScale;

    Camera.x =
        (width / 2) -
        (openingGateX * Camera.scale);

    Camera.y =
        (height / 2) -
        (openingGateY * Camera.scale);
}

/*
 * Recalculate after the browser establishes the real viewport.
 * This is particularly important on mobile browsers where the
 * address bar changes the visual viewport height.
 */
window.addEventListener("resize", () => {
    if (!Camera.isDragging && !Camera.isTouching) {
        applyResponsiveCameraDefaults();
    }
});

window.addEventListener("orientationchange", () => {
    setTimeout(applyResponsiveCameraDefaults, 120);
});


/* =========================================================
 * TOUCH / PINCH GESTURES
 * ========================================================= */

Camera.isTouching = false;

let touchStartDistance = 0;
let touchStartScale = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchStartCameraX = 0;
let touchStartCameraY = 0;

function touchDistance(a, b) {
    return Math.hypot(
        a.clientX - b.clientX,
        a.clientY - b.clientY
    );
}

viewport.addEventListener("touchstart", (e) => {

    e.preventDefault();

    Camera.isTouching = true;

    if (e.touches.length === 1) {

        const t = e.touches[0];

        touchStartX = t.clientX;
        touchStartY = t.clientY;

        touchStartCameraX = Camera.x;
        touchStartCameraY = Camera.y;

    }
    else if (e.touches.length >= 2) {

        touchStartDistance =
            touchDistance(e.touches[0], e.touches[1]);

        touchStartScale = Camera.scale;
    }

}, { passive:false });


viewport.addEventListener("touchmove", (e) => {

    e.preventDefault();

    if (e.touches.length === 1) {

        const t = e.touches[0];

        Camera.x =
            touchStartCameraX +
            (t.clientX - touchStartX);

        Camera.y =
            touchStartCameraY +
            (t.clientY - touchStartY);

    }
    else if (e.touches.length >= 2) {

        const distance =
            touchDistance(e.touches[0], e.touches[1]);

        if (!touchStartDistance) return;

        const ratio =
            distance / touchStartDistance;

        Camera.scale =
            Math.max(
                Camera.minScale,
                Math.min(
                    Camera.maxScale,
                    touchStartScale * ratio
                )
            );
    }

}, { passive:false });


function finishTouch() {

    Camera.isTouching = false;
    touchStartDistance = 0;

}

viewport.addEventListener("touchend", finishTouch, { passive:true });
viewport.addEventListener("touchcancel", finishTouch, { passive:true });


/* Apply the responsive opening view after all camera code is loaded. */
applyResponsiveCameraDefaults();

console.log("✓ Responsive Camera + Touch Layer Loaded");
