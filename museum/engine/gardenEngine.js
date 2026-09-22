/*======================================*
 * VOICES OF HUMANITY
 * GARDEN ENGINE
 *======================================*/

function createGarden(garden) {

    const element = document.createElement("div");

    element.className = "museum-garden";

    element.dataset.gardenId = garden.id;

    element.style.left = garden.x + "px";
    element.style.top = garden.y + "px";

    element.title = garden.name;

    /* Reflection Garden is an interactive visitor destination.
     * Register the click target when the garden is created so the
     * garden remains fully clickable even though it is generated
     * after the camera engine initializes. */
    if (garden.id === "reflection-garden") {
        element.classList.add("building-focus-target");
        element.setAttribute("tabindex", "0");
        element.setAttribute("role", "button");
        element.setAttribute("aria-label", "Focus on Reflection Garden");

        element.addEventListener("click", (event) => {
            event.stopPropagation();
            if (typeof focusBuilding === "function") {
                focusBuilding("reflection-garden");
            }
        });

        element.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            event.stopPropagation();
            if (typeof focusBuilding === "function") {
                focusBuilding("reflection-garden");
            }
        });
    }

    campus.appendChild(element);

    /*======================================*
     * REGISTER GARDEN
     *======================================*/

    if (
        typeof MuseumRegistry !== "undefined" &&
        typeof MuseumRegistry.registerGarden === "function"
    ) {

        MuseumRegistry.registerGarden(garden);

    }

    return element;
}


/*======================================*
 * LOAD GARDENS
 *======================================*/

function loadGardens() {

    if (typeof Gardens === "undefined") {

        console.warn(
            "✗ Garden Engine: Gardens data not found"
        );

        return;
    }


    if (typeof campus === "undefined") {

        console.warn(
            "✗ Garden Engine: Campus element not found"
        );

        return;
    }


    Gardens.forEach(garden => {

        createGarden(garden);

    });


    console.log(
        "✓ Garden Engine: Loaded",
        Gardens.length,
        "gardens"
    );
}


/*======================================*
 * ENGINE STATUS
 *======================================*/

console.log("✓ Garden Engine Loaded");