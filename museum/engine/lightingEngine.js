/* =========================================================
   VOICES OF HUMANITY
   LIGHTING ENGINE v5.1
   ---------------------------------------------------------
   Purpose:
   - Create elegant campus street lighting
   - Follow existing museum circulation
   - Keep lighting data separate from roads/buildings
   - Support day / evening / night states
   ========================================================= */

(function () {

    "use strict";

    const campus =
        document.getElementById("campus");

    if (!campus) {

        console.error(
            "✗ Lighting Engine: #campus not found"
        );

        return;
    }


    /* =====================================================
       REMOVE PREVIOUS LIGHTING OUTPUT
       ===================================================== */

    const oldLayer =
        document.getElementById(
            "museum-lighting-layer"
        );

    if (oldLayer) {
        oldLayer.remove();
    }


    /* =====================================================
       CONSTANTS
       ===================================================== */

    const SVG_NS =
        "http://www.w3.org/2000/svg";

    const W = 3000;
    const H = 3000;


    /* =====================================================
       CREATE LIGHTING SVG
       ===================================================== */

    const svg =
        document.createElementNS(
            SVG_NS,
            "svg"
        );

    svg.id =
        "museum-lighting-layer";

    svg.setAttribute(
        "width",
        W
    );

    svg.setAttribute(
        "height",
        H
    );

    svg.setAttribute(
        "viewBox",
        `0 0 ${W} ${H}`
    );

    Object.assign(
        svg.style,
        {
            position: "absolute",
            left: "0",
            top: "0",
            width: `${W}px`,
            height: `${H}px`,
            pointerEvents: "none",
            zIndex: "3"
        }
    );


    /*
       Put lighting above roads,
       but below the main interactive buildings.
    */

    campus.appendChild(svg);


    /* =====================================================
       SVG DEFINITIONS
       ===================================================== */

    const defs =
        document.createElementNS(
            SVG_NS,
            "defs"
        );


    /* Warm lamp glow */

    const glow =
        document.createElementNS(
            SVG_NS,
            "radialGradient"
        );

    glow.id =
        "museumLampGlow";

    glow.innerHTML = `
        <stop
            offset="0%"
            stop-color="#fff5b0"
            stop-opacity="0.95"
        />

        <stop
            offset="35%"
            stop-color="#ffd96a"
            stop-opacity="0.55"
        />

        <stop
            offset="100%"
            stop-color="#ffd96a"
            stop-opacity="0"
        />
    `;

    defs.appendChild(glow);


    /* Soft lamp shadow */

    const filter =
        document.createElementNS(
            SVG_NS,
            "filter"
        );

    filter.id =
        "lampShadow";

    filter.setAttribute(
        "x",
        "-100%"
    );

    filter.setAttribute(
        "y",
        "-100%"
    );

    filter.setAttribute(
        "width",
        "300%"
    );

    filter.setAttribute(
        "height",
        "300%"
    );


    const shadow =
        document.createElementNS(
            SVG_NS,
            "feDropShadow"
        );

    shadow.setAttribute(
        "dx",
        "0"
    );

    shadow.setAttribute(
        "dy",
        "4"
    );

    shadow.setAttribute(
        "stdDeviation",
        "3"
    );

    shadow.setAttribute(
        "flood-color",
        "#000000"
    );

    shadow.setAttribute(
        "flood-opacity",
        "0.30"
    );

    filter.appendChild(
        shadow
    );

    defs.appendChild(
        filter
    );

    svg.appendChild(
        defs
    );


    /* =====================================================
       SVG HELPER
       ===================================================== */

    function el(
        name,
        attributes = {}
    ) {

        const node =
            document.createElementNS(
                SVG_NS,
                name
            );

        for (
            const [
                key,
                value
            ]
            of Object.entries(attributes)
        ) {

            node.setAttribute(
                key,
                value
            );
        }

        return node;
    }


    /* =====================================================
       CREATE ONE STREET LAMP
       ===================================================== */

    function createLamp(
        x,
        y,
        scale = 1,
        type = "street"
    ) {

        const group =
            el(
                "g",
                {
                    class:
                        "museum-lamp",
                    "data-lamp-type":
                        type,
                    transform:
                        `translate(${x} ${y}) scale(${scale})`
                }
            );


        /* Ground shadow */

        const groundShadow =
            el(
                "ellipse",
                {
                    cx: "0",
                    cy: "5",
                    rx: "15",
                    ry: "7",
                    fill: "#000",
                    opacity: "0.18"
                }
            );

        group.appendChild(
            groundShadow
        );


        /* Lamp pole */

        const pole =
            el(
                "rect",
                {
                    x: "-3",
                    y: "-72",
                    width: "6",
                    height: "72",
                    rx: "3",
                    fill: "#25262c",
                    filter:
                        "url(#lampShadow)"
                }
            );

        group.appendChild(
            pole
        );


        /* Decorative lower collar */

        const collar =
            el(
                "circle",
                {
                    cx: "0",
                    cy: "-12",
                    r: "7",
                    fill: "#383940",
                    stroke: "#bda85c",
                    "stroke-width": "2"
                }
            );

        group.appendChild(
            collar
        );


        /* Lamp arm */

        const arm =
            el(
                "path",
                {
                    d:
                        "M 0 -65 C 0 -78 11 -82 18 -82",
                    fill: "none",
                    stroke: "#25262c",
                    "stroke-width": "5",
                    "stroke-linecap": "round"
                }
            );

        group.appendChild(
            arm
        );


        /* Lantern body */

        const lantern =
            el(
                "rect",
                {
                    x: "13",
                    y: "-91",
                    width: "12",
                    height: "13",
                    rx: "3",
                    fill: "#25262c",
                    stroke: "#c5a94d",
                    "stroke-width": "2"
                }
            );

        group.appendChild(
            lantern
        );


        /* Warm light */

        const light =
            el(
                "circle",
                {
                    class:
                        "lightGlow",
                    cx: "19",
                    cy: "-84",
                    r: type === "accent"
                        ? "48"
                        : "34",
                    fill:
                        "url(#museumLampGlow)",
                    opacity: "0"
                }
            );

        group.appendChild(
            light
        );


        /* Small visible bulb */

        const bulb =
            el(
                "circle",
                {
                    class:
                        "lampBulb",
                    cx: "19",
                    cy: "-84",
                    r: "3.5",
                    fill: "#fff1a3"
                }
            );

        group.appendChild(
            bulb
        );


        svg.appendChild(
            group
        );
    }


    /* =====================================================
       MAIN ARRIVAL AVENUE
       ===================================================== */

    const avenueLamps = [

        [1500, 2920],
        [1500, 2780],
        [1500, 2630],
        [1500, 2480],

        [1500, 2180],
        [1500, 2010],

    ];


    avenueLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                1.10,
                "avenue"
            );

        }
    );


    /* =====================================================
       HALL / HERITAGE HEART
       ===================================================== */

    const hallLamps = [

        [1320, 1550],
        [1420, 1690],
        [1580, 1690],
        [1680, 1550],

        [1270, 1400],
        [1730, 1400],

        [1360, 1190],
        [1640, 1190]

    ];


    hallLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                1.0,
                "heritage"
            );

        }
    );


    /* =====================================================
       WESTERN CULTURAL ROUTE
       ===================================================== */

    const westLamps = [

        [1110, 1360],
        [970, 1400],

        [800, 1580],
        [760, 1740],

        [780, 1900],
        [920, 2010],

        [1100, 1950],
        [1280, 1880]

    ];


    westLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                0.90,
                "garden"
            );

        }
    );


    /* =====================================================
       EASTERN CULTURAL ROUTE
       ===================================================== */

    const eastLamps = [

        [2260, 1190],
        [2360, 1240],
        [2290, 1470],

        [2220, 1600],
        [2150, 1720],

        [2070, 1810],
        [1980, 1880]

    ];


    eastLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                0.90,
                "garden"
            );

        }
    );


    /* =====================================================
       NORTHERN CULTURAL AREA
       ===================================================== */

    const northLamps = [

        [1420, 880],
        [1500, 760],
        [1500, 640],

        [1660, 890],
        [1810, 930],
        [1980, 1000]

    ];


    northLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                0.85,
                "garden"
            );

        }
    );


    /* =====================================================
       REFLECTION GARDEN
       CONFIRMED: 1930,1910
       ===================================================== */

    const reflectionLamps = [

        [1860, 1950],
        [1930, 1840],
        [2010, 1930],
        [1930, 2040],

    ];


    reflectionLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                0.78,
                "reflection"
            );

        }
    );


    /* =====================================================
       CONTINENTAL MUSEUM APPROACHES
       ===================================================== */

    const continentalLamps = [

        /* Africa */

        [980, 1390],
        [900, 1320],
        [820, 1460],

        /* Americas */

        [850, 1900],
        [760, 2020],
        [900, 2080],

        /* Asia */

        [2130, 1040],
        [2250, 1080],
        [2220, 1160],

        /* Oceania */

        [2090, 1650],
        [2190, 1740],
        [2290, 1680],

        /* Europe */

        [1450, 1030],
        [1550, 1030],
        [1510, 900]

    ];


    continentalLamps.forEach(
        ([x, y]) => {

            createLamp(
                x,
                y,
                0.82,
                "museum"
            );

        }
    );


    /* =====================================================
       SPECIAL HALL ACCENT LIGHTS
       ===================================================== */

    createLamp(
        1430,
        1290,
        1.15,
        "accent"
    );

    createLamp(
        1570,
        1290,
        1.15,
        "accent"
    );


    /* =====================================================
       ENTRANCE ACCENT LIGHTS
       ===================================================== */

    createLamp(
        1360,
        2370,
        1.20,
        "accent"
    );

    createLamp(
        1640,
        2370,
        1.20,
        "accent"
    );


    /* =====================================================
       DAY / NIGHT CONTROLLER
       ===================================================== */

    function updateLighting() {

        const mode =
            campus.classList.contains(
                "night"
            )
                ? "night"

                : campus.classList.contains(
                    "evening"
                )
                    ? "evening"

                    : campus.classList.contains(
                        "morning"
                    )
                        ? "morning"

                        : "day";


        const lights =
            svg.querySelectorAll(
                ".lightGlow"
            );


        lights.forEach(
            light => {

                if (
                    mode === "night"
                    ||
                    mode === "evening"
                ) {

                    light.setAttribute(
                        "opacity",
                        "1"
                    );

                } else {

                    light.setAttribute(
                        "opacity",
                        "0"
                    );

                }

            }
        );


        /*
           During the day the bulbs remain
           subtle architectural details.
        */

        const bulbs =
            svg.querySelectorAll(
                ".lampBulb"
            );


        bulbs.forEach(
            bulb => {

                if (
                    mode === "night"
                    ||
                    mode === "evening"
                ) {

                    bulb.setAttribute(
                        "opacity",
                        "1"
                    );

                } else {

                    bulb.setAttribute(
                        "opacity",
                        "0.55"
                    );

                }

            }
        );

    }


    /* =====================================================
       WATCH FOR CAMPUS DAY/NIGHT CHANGES
       ===================================================== */

    const observer =
        new MutationObserver(
            updateLighting
        );


    observer.observe(
        campus,
        {
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );


    updateLighting();


    /* =====================================================
       ENGINE METADATA
       ===================================================== */

    svg.dataset.engine =
        "Voices of Humanity Lighting Engine v5.1";

    svg.dataset.lampCount =
        svg.querySelectorAll(
            ".museum-lamp"
        ).length;


    console.log(
        "✓ Lighting Engine v5.1 Loaded"
    );

    console.log(
        "✓ Museum lamps:",
        svg.dataset.lampCount
    );

})();