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

    /* Add a visible floral ring around the Reflection Garden. The flowers
     * are decorative only and never interfere with the Garden click target. */
    if (garden.id === "reflection-garden") {
        const flowerRing = document.createElement("div");
        flowerRing.className = "reflection-flower-ring";
        flowerRing.setAttribute("aria-hidden", "true");

        const flowerPositions = [
            "flower-a","flower-b","flower-c","flower-d","flower-e","flower-f",
            "flower-g","flower-h","flower-i","flower-j","flower-k","flower-l",
            "flower-m","flower-n","flower-o","flower-p","flower-q","flower-r",
            "flower-s","flower-t","flower-u","flower-v","flower-w","flower-x",
            "flower-y","flower-z","flower-aa","flower-ab"
        ];

        flowerPositions.forEach(function(name, index){
            const flower = document.createElement("span");
            flower.className = "reflection-flower " + name;
            flower.dataset.flowerIndex = String(index);
            flowerRing.appendChild(flower);
        });

        element.appendChild(flowerRing);
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
                '<div class="reflection-archive-heading">' +
                    '<span>DAILY REFLECTION ARCHIVE</span>' +
                    '<small>Preserved reflections remain here even when the current Garden changes.</small>' +
                '</div>' +
                '<div class="reflection-archive-list"></div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(overlay);

    /* Build the permanent reflection archive from the living data source. */
    const archivePanel = overlay.querySelector('.reflection-archive-list');
    const archiveItems = Array.isArray(data.archive) ? data.archive : [];

    if (archiveItems.length) {
        archivePanel.innerHTML = archiveItems.map(function(item){
            const isPending = item.format === "pending";
            const title = item.heading || ("Reflection " + item.number);
            const quote = item.quote ? '“' + item.quote + '”' : "Original card awaiting restoration from the saved source collection.";
            return '<article class="reflection-archive-card ' + (isPending ? 'is-pending' : '') + '">' +
                '<div class="reflection-archive-number">REFLECTION ' + item.number + '</div>' +
                '<div class="reflection-archive-date">' + (item.date || 'DATE TO BE RESTORED') + '</div>' +
                '<h3>' + title + '</h3>' +
                '<blockquote>' + quote + '</blockquote>' +
                '<p>' + (item.note || '') + '</p>' +
                '<span class="reflection-archive-format">' + (isPending ? 'SOURCE CARD TO BE RESTORED' : 'PRESERVED TEXT RECORD') + '</span>' +
            '</article>';
        }).join('');
    } else {
        archivePanel.innerHTML = '<div class="reflection-archive-empty"><div class="archive-symbol">✦</div><h3>The archive is ready.</h3><p>New reflection records will appear here automatically.</p></div>';
    }

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

    /* Hard hit-test fallback: the Garden can still open even when a
     * decorative campus layer becomes the browser event target. */
    if (!window.__vohReflectionGardenPriorityBound) {
        window.__vohReflectionGardenPriorityBound = true;
        function reflectionGardenPointInside(event) {
            if (!event || typeof event.clientX !== "number" || typeof event.clientY !== "number") return false;
            if (overlay.classList.contains("open")) return false;
            const rect = gardenElement.getBoundingClientRect();
            return event.clientX >= rect.left && event.clientX <= rect.right &&
                   event.clientY >= rect.top && event.clientY <= rect.bottom;
        }
        window.addEventListener("click", function(event) {
            if (!reflectionGardenPointInside(event)) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            open();
        }, true);
        window.addEventListener("pointerup", function(event) {
            if (event.pointerType === "mouse" || !reflectionGardenPointInside(event)) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            open();
        }, true);
    }

    const closeButton = overlay.querySelector(".reflection-garden-close");

    function closeFromButton(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            if (typeof event.stopImmediatePropagation === "function") {
                event.stopImmediatePropagation();
            }
        }

        /* Hard-close the Garden first. */
        close();

        /* Then restore the normal museum opening view. */
        if (typeof window.returnToMuseumHomepage === "function") {
            window.returnToMuseumHomepage();
        } else if (typeof returnToMuseumHomepage === "function") {
            returnToMuseumHomepage();
        }

        /* Keep the overview visibly interactive after closing. */
        document.body.classList.remove("reflection-garden-open");
        overlay.hidden = true;
        overlay.style.display = "none";
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "-1";
    }

    /* One authoritative close handler. The capture phase makes the
     * button independent of any older museum event listeners. */
    closeButton.addEventListener("click", closeFromButton, true);
    closeButton.addEventListener("pointerup", closeFromButton, true);
    closeButton.addEventListener("touchend", closeFromButton, true);
    closeButton.onclick = closeFromButton;
    overlay.addEventListener("click", function(event) {
        if (event.target === overlay) close();
    });

    const gardenMenu = overlay.querySelector(".reflection-garden-menu");
    const gardenMenuButtons = overlay.querySelectorAll(".reflection-garden-menu button");

    function showGardenView(view, activeButton) {
        gardenMenuButtons.forEach(function(item) {
            item.classList.toggle("active", item === activeButton);
            item.setAttribute("aria-selected", item === activeButton ? "true" : "false");
        });

        overlay.querySelectorAll(".reflection-garden-view").forEach(function(panel) {
            const shouldShow = panel.dataset.viewPanel === view;
            panel.hidden = !shouldShow;
            panel.style.display = shouldShow ? "block" : "none";
        });
    }

    /* Use a capture-layer handler for the Garden tabs so the Archive button
     * cannot be swallowed by any legacy museum click/camera listeners. */
    gardenMenuButtons.forEach(function(button) {
        button.style.pointerEvents = "auto";
        button.style.position = "relative";
        button.style.zIndex = "5";
        button.setAttribute("aria-selected", button.classList.contains("active") ? "true" : "false");

        function activateTab(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
                if (typeof event.stopImmediatePropagation === "function") {
                    event.stopImmediatePropagation();
                }
            }
            showGardenView(button.dataset.view, button);
        }

        button.addEventListener("click", activateTab, true);
        button.addEventListener("pointerup", function(event) {
            /* Fallback for browsers/devices where the final click is swallowed. */
            activateTab(event);
        }, true);
    });

    if (gardenMenu) {
        gardenMenu.style.pointerEvents = "auto";
        gardenMenu.style.position = "relative";
        gardenMenu.style.zIndex = "5";
    }

    /* Start explicitly on today's reflection. */
    showGardenView("today", overlay.querySelector('.reflection-garden-menu button[data-view="today"]'));

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && overlay.classList.contains("open")) close();
    });
}
