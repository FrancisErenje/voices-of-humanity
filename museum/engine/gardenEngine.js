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
            /* Keyboard activation opens the same direct exhibit as a mouse click. */
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
                    '<span>The living archive continues with each new reflection.</span>' +
                '</div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    const todayPanel = overlay.querySelector('[data-view-panel="today"]');
    /* The Garden's "today" card is deliberately anchored to the
     * current Voices of Humanity daily reflection rather than any
     * older cached reflection record. This keeps the elegant Garden
     * presentation while ensuring the first thing visitors see is
     * today's reflection. */
    /* Always use the current reflection from data/reflections.js.
     * This prevents the Garden from displaying an older hard-coded card. */
    const current = {
        number: Number(data.current.number),
        heading: data.current.heading,
        quote: data.current.quote,
        date: data.current.date,
        image: data.current.image || "",
        note: data.current.note
    };

    /* The Reflection Garden displays the actual official reflection card
     * supplied for today's reflection. The card itself contains the
     * complete visual identity, numbering, quote and artwork. */
    todayPanel.innerHTML =
        '<article class="reflection-card-live reflection-card-textual">' +
            (current.image ? '<img class="reflection-card-image" src="' + current.image + '" alt="Voices of Humanity Reflection No. ' + current.number + ' — ' + current.heading + '">' : '') +
            '<div class="reflection-text-content">' +
                '<div class="reflection-text-number">REFLECTION ' + String(current.number).padStart(3, "0") + '</div>' +
                '<div class="reflection-text-date">' + current.date + '</div>' +
                '<h3>' + current.heading + '</h3>' +
                '<blockquote>“' + current.quote + '”</blockquote>' +
                '<p>' + current.note + '</p>' +
            '</div>' +
        '</article>';

    function open() {
        overlay.hidden = false;
        overlay.style.display = "flex";
        overlay.style.visibility = "visible";
        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "auto";
        overlay.style.zIndex = "2147483646";
        overlay.classList.add("open");
        document.body.classList.add("reflection-garden-open");
    }

    function close() {
        overlay.classList.remove("open");
        overlay.hidden = true;
        overlay.style.display = "none";
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "-1";
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

    const closeButton = overlay.querySelector(".reflection-garden-close");

    function closeFromButton(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === "function") {
                event.stopImmediatePropagation();
            }
        }
        close();
        if (typeof returnToMuseumHomepage === "function") returnToMuseumHomepage();
    }

    closeButton.addEventListener("pointerdown", closeFromButton, true);
    closeButton.addEventListener("pointerup", closeFromButton, true);
    closeButton.addEventListener("mousedown", closeFromButton, true);
    closeButton.addEventListener("mouseup", closeFromButton, true);
    closeButton.addEventListener("touchend", closeFromButton, true);
    closeButton.addEventListener("click", closeFromButton, true);
    closeButton.onclick = closeFromButton;
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
