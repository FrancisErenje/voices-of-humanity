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
            /* The Reflection Garden opens directly, like LocalMedia247.
             * Do not move the museum camera when opening an exhibit. */
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
     * REFLECTION GARDEN EXPERIENCE
     *======================================*/
    if (garden.id === "reflection-garden") {
        createReflectionGardenExperience(element);
    }

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

/*======================================*
 * REFLECTION GARDEN EXPERIENCE
 *======================================*/

function createReflectionGardenExperience(gardenElement) {

    if (document.querySelector(".reflection-garden-overlay")) return;

    const data = window.ReflectionGardenCollection;
    if (!data || !data.current) return;

    const overlay = document.createElement("div");
    overlay.className = "reflection-garden-overlay";
    overlay.innerHTML =
        '<div class="reflection-garden-dialog" role="dialog" aria-modal="true" aria-label="Reflection Garden">' +
            '<button class="reflection-garden-close" type="button" aria-label="Close Reflection Garden">×</button>' +
            '<div class="reflection-garden-kicker">VOICES OF HUMANITY · LIVING ARCHIVE</div>' +
            '<h2>Reflection Garden</h2>' +
            '<p class="reflection-garden-intro">A quiet place in the museum where our daily reflections are preserved, one voice at a time.</p>' +
            '<nav class="reflection-garden-menu" aria-label="Reflection Garden menu">' +
                '<button class="active" type="button" data-view="today">TODAY’S REFLECTION</button>' +
                '<button type="button" data-view="archive">REFLECTION ARCHIVE</button>' +
            '</nav>' +
            '<div class="reflection-garden-view" data-view-panel="today"></div>' +
            '<div class="reflection-garden-view reflection-garden-archive" data-view-panel="archive" hidden>' +
                '<div class="reflection-archive-empty">' +
                    '<div class="archive-symbol">✦</div>' +
                    '<h3>The archive is growing.</h3>' +
                    '<p>Reflection Nos. 001–058 will be added here when the historical card collection is uploaded.</p>' +
                    '<span>Today begins the living archive.</span>' +
                '</div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    const todayPanel = overlay.querySelector('[data-view-panel="today"]');
    const current = data.current;

    todayPanel.innerHTML =
        '<article class="reflection-card-live">' +
            '<div class="reflection-card-orbit"></div>' +
            (current.image ? '<img class="reflection-card-image" src="' + current.image + '" alt="Voices of Humanity Reflection No. ' + current.number + ' — ' + current.heading + '">' : '') +
            '<div class="reflection-card-brand">VOICES<br><span>OF</span><br>HUMANITY</div>' +
            '<div class="reflection-card-motto">EVERY VOICE MATTERS</div>' +
            '<div class="reflection-card-title">DAILY REFLECTION</div>' +
            '<div class="reflection-card-number">REFLECTION No. ' + current.number + '</div>' +
            '<div class="reflection-card-heading">' + current.heading + '</div>' +
            '<div class="reflection-card-quote">“' + current.quote + '”</div>' +
            '<div class="reflection-card-icons"><span>◉</span><span>OUR LANGUAGES</span><i></i><span>●</span><span>OUR CULTURES</span><i></i><span>▢</span><span>OUR FUTURE</span></div>' +
            '<div class="reflection-card-footer">VOICES OF HUMANITY DIGITAL MUSEUM<br><small>DAILY REFLECTION ARCHIVE</small></div>' +
            '<div class="reflection-card-date">' + current.date + '</div>' +
        '</article>' +
        '<div class="reflection-today-note">' + current.note + '</div>';

    function open() {
        overlay.classList.add("open");
        document.body.classList.add("reflection-garden-open");
    }

    function close() {
        overlay.classList.remove("open");
        document.body.classList.remove("reflection-garden-open");
    }

    gardenElement.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();
        /* Keep the current museum overview position. The exhibit is an
         * overlay, so closing it returns the visitor to the same overview. */
        open();
    }, true);

    gardenElement.addEventListener("keydown", function(event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        open();
    });

    overlay.querySelector(".reflection-garden-close").addEventListener("click", close);
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) close();
    });

    overlay.querySelectorAll(".reflection-garden-menu button").forEach(function(button) {
        button.addEventListener("click", function() {
            const view = button.dataset.view;
            overlay.querySelectorAll(".reflection-garden-menu button").forEach(function(item) {
                item.classList.toggle("active", item === button);
            });
            overlay.querySelectorAll(".reflection-garden-view").forEach(function(panel) {
                panel.hidden = panel.dataset.viewPanel !== view;
            });
        });
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && overlay.classList.contains("open")) close();
    });
}
