/* =========================================================
   VOICES OF HUMANITY
   LANDSCAPE ENGINE v5.2
   ---------------------------------------------------------
   Purpose:
   - Create intentional tree groupings
   - Create planting beds
   - Soften building edges
   - Frame pedestrian routes
   - Protect important sight lines
   ========================================================= */

(function () {

    "use strict";

    const campus =
        document.getElementById("campus");

    if (!campus) {
        console.error(
            "✗ Landscape Engine: #campus not found"
        );
        return;
    }

    const SVG_NS =
        "http://www.w3.org/2000/svg";

    const WIDTH = 3000;
    const HEIGHT = 3000;


    /* =====================================================
       REMOVE PREVIOUS LANDSCAPE LAYER
       ===================================================== */

    const oldLayer =
        document.getElementById(
            "museum-landscape-layer"
        );

    if (oldLayer) {
        oldLayer.remove();
    }


    /* =====================================================
       CREATE SVG LANDSCAPE LAYER
       ===================================================== */

    const svg =
        document.createElementNS(
            SVG_NS,
            "svg"
        );

    svg.id =
        "museum-landscape-layer";

    svg.setAttribute(
        "width",
        WIDTH
    );

    svg.setAttribute(
        "height",
        HEIGHT
    );

    svg.setAttribute(
        "viewBox",
        `0 0 ${WIDTH} ${HEIGHT}`
    );

    Object.assign(
        svg.style,
        {
            position: "absolute",
            left: "0",
            top: "0",
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
            pointerEvents: "none",
            zIndex: "2"
        }
    );

    campus.appendChild(svg);


    /* =====================================================
       BOTANICAL DEFINITIONS
       -----------------------------------------------------
       Soft gradients and filters give foliage and ground
       texture more depth without adding image assets.
       ===================================================== */

    const defs = el("defs");

    const grassGradient = el("linearGradient", {
        id: "grassBladeGradient",
        x1: "0", y1: "0", x2: "0", y2: "1"
    });
    grassGradient.appendChild(el("stop", { offset: "0%", "stop-color": "#9dcc68" }));
    grassGradient.appendChild(el("stop", { offset: "55%", "stop-color": "#5f9a49" }));
    grassGradient.appendChild(el("stop", { offset: "100%", "stop-color": "#3e7339" }));

    const trunkGradient = el("linearGradient", {
        id: "treeTrunkGradient",
        x1: "0", y1: "0", x2: "1", y2: "0"
    });
    trunkGradient.appendChild(el("stop", { offset: "0%", "stop-color": "#4b2f1b" }));
    trunkGradient.appendChild(el("stop", { offset: "48%", "stop-color": "#8a5a32" }));
    trunkGradient.appendChild(el("stop", { offset: "100%", "stop-color": "#3f2918" }));

    const leafGradient = el("radialGradient", {
        id: "treeLeafGradient",
        cx: "35%", cy: "28%", r: "75%"
    });
    leafGradient.appendChild(el("stop", { offset: "0%", "stop-color": "#8fc95d" }));
    leafGradient.appendChild(el("stop", { offset: "42%", "stop-color": "#4f9a4b" }));
    leafGradient.appendChild(el("stop", { offset: "100%", "stop-color": "#245f35" }));

    const leafShadow = el("radialGradient", {
        id: "treeLeafShadow",
        cx: "50%", cy: "35%", r: "70%"
    });
    leafShadow.appendChild(el("stop", { offset: "0%", "stop-color": "#4f9947" }));
    leafShadow.appendChild(el("stop", { offset: "100%", "stop-color": "#1f5731" }));

    const treeShadow = el("filter", { id: "treeSoftShadow", x: "-40%", y: "-40%", width: "180%", height: "190%" });
    treeShadow.appendChild(el("feGaussianBlur", { stdDeviation: "3" }));

    defs.appendChild(grassGradient);
    defs.appendChild(trunkGradient);
    defs.appendChild(leafGradient);
    defs.appendChild(leafShadow);
    defs.appendChild(treeShadow);
    svg.appendChild(defs);


    /* =====================================================
       GRASS PATCHES
       -----------------------------------------------------
       Small, varied tufts are kept low on the ground layer.
       They sit underneath roads/buildings and never become
       movement obstacles.
       ===================================================== */

    function createGrassPatch(x, y, count = 12, radius = 70) {
        const group = el("g", { class: "landscape-grass-patch", transform: `translate(${x} ${y})` });

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = radius * (0.25 + ((i * 37) % 70) / 100);
            const gx = Math.cos(angle) * distance;
            const gy = Math.sin(angle) * distance * 0.58;
            const h = 7 + ((i * 11) % 9);
            const lean = -8 + ((i * 17) % 17);

            group.appendChild(el("path", {
                d: `M ${gx} ${gy + 2} Q ${gx + lean} ${gy - h * .55} ${gx + lean * .55} ${gy - h}`,
                fill: "none",
                stroke: "url(#grassBladeGradient)",
                "stroke-width": "2.2",
                "stroke-linecap": "round",
                opacity: "0.78"
            }));
        }

        svg.appendChild(group);
    }

    [
        [430, 1050, 16, 110], [760, 1030, 13, 90],
        [430, 1780, 15, 110], [760, 2050, 16, 120],
        [1080, 520, 14, 100], [1300, 500, 12, 90],
        [1700, 500, 12, 90], [2050, 520, 14, 100],
        [2380, 1120, 14, 100], [2600, 1760, 16, 120],
        [2350, 2050, 14, 105], [700, 2350, 15, 115],
        [2300, 2350, 15, 115], [1500, 2650, 18, 130]
    ].forEach(p => createGrassPatch(...p));


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

        Object.entries(
            attributes
        ).forEach(
            ([key, value]) => {

                node.setAttribute(
                    key,
                    value
                );

            }
        );

        return node;
    }


    /* =====================================================
       TREE
       ===================================================== */

    function createTree(
        x,
        y,
        scale = 1
    ) {

        const group = el("g", {
            class: "landscape-tree",
            transform: `translate(${x} ${y}) scale(${scale})`,
            filter: "url(#treeSoftShadow)"
        });

        /* Ground shadow */
        group.appendChild(el("ellipse", {
            cx: "0", cy: "7", rx: "30", ry: "11",
            fill: "#172d1c", opacity: "0.24"
        }));

        /* Trunk with slight taper */
        group.appendChild(el("path", {
            d: "M -6 8 L -4 -43 Q 0 -48 5 -43 L 7 8 Q 1 12 -6 8 Z",
            fill: "url(#treeTrunkGradient)"
        }));

        /* Branches */
        group.appendChild(el("path", {
            d: "M 0 -25 C -12 -34 -18 -39 -22 -48 M 2 -30 C 12 -38 19 -43 23 -51",
            fill: "none", stroke: "#56371f", "stroke-width": "5", "stroke-linecap": "round"
        }));

        /* Deep foliage mass */
        [
            [-18, -48, 20], [8, -57, 27], [29, -44, 18],
            [-2, -75, 22], [20, -75, 18], [-28, -67, 16]
        ].forEach(([cx, cy, r]) => {
            group.appendChild(el("circle", {
                cx, cy, r, fill: "url(#treeLeafShadow)"
            }));
        });

        /* Lit foliage lobes */
        [
            [-10, -62, 17], [11, -70, 18], [25, -55, 13], [-24, -57, 12]
        ].forEach(([cx, cy, r]) => {
            group.appendChild(el("circle", {
                cx, cy, r, fill: "url(#treeLeafGradient)"
            }));
        });

        /* Small leaf highlights */
        [
            [-18, -69, 3], [1, -82, 3.5], [18, -63, 2.8], [27, -49, 2.5]
        ].forEach(([cx, cy, r]) => {
            group.appendChild(el("circle", {
                cx, cy, r, fill: "#b0d86b", opacity: "0.68"
            }));
        });

        svg.appendChild(group);
    }


    /* =====================================================
       FLOWER BED
       ===================================================== */

    function createFlowerBed(
        x,
        y,
        width,
        height,
        rotation = 0
    ) {

        const group =
            el(
                "g",
                {
                    class:
                        "landscape-flower-bed",
                    transform:
                        `translate(${x} ${y}) rotate(${rotation})`
                }
            );


        /* Outer bed */

        group.appendChild(
            el(
                "ellipse",
                {
                    cx: "0",
                    cy: "0",
                    rx: width / 2,
                    ry: height / 2,
                    fill: "#557d3e",
                    stroke: "#8fa75b",
                    "stroke-width": "3"
                }
            )
        );


        /* Flowers */

        const flowers = [
            [-width * .28, 0],
            [-width * .12, -height * .18],
            [0, height * .12],
            [width * .15, -height * .10],
            [width * .28, height * .04]
        ];


        flowers.forEach(
            ([fx, fy], index) => {

                group.appendChild(
                    el(
                        "circle",
                        {
                            cx: fx,
                            cy: fy,
                            r: "5",
                            fill:
                                index % 2 === 0
                                    ? "#e6c85c"
                                    : "#d8878d"
                        }
                    )
                );

            }
        );


        svg.appendChild(
            group
        );
    }


    /* =====================================================
       TREE GROUP HELPER
       ===================================================== */

    function treeGroup(
        trees
    ) {

        trees.forEach(
            tree => {

                createTree(
                    tree.x,
                    tree.y,
                    tree.scale || 1
                );

            }
        );
    }


    /* =====================================================
       HALL OF HUMANITY FRAME
       -----------------------------------------------------
       Trees frame the Hall but do not block it.
       ===================================================== */

    treeGroup([

        { x: 1080, y: 1120, scale: .95 },
        { x: 1160, y: 1040, scale: .80 },

        { x: 1920, y: 1040, scale: .80 },
        { x: 2000, y: 1120, scale: .95 },

        { x: 1080, y: 1510, scale: .90 },
        { x: 1160, y: 1580, scale: .75 },

        { x: 1920, y: 1580, scale: .75 },
        { x: 2000, y: 1510, scale: .90 }

    ]);


    /* =====================================================
       WESTERN LANDSCAPE
       ===================================================== */

    treeGroup([

        { x: 520, y: 1100, scale: .90 },
        { x: 650, y: 1160, scale: 1.05 },
        { x: 790, y: 1100, scale: .80 },

        { x: 520, y: 1450, scale: .85 },
        { x: 620, y: 1510, scale: 1.00 },

        { x: 500, y: 2140, scale: 1.05 },
        { x: 650, y: 2210, scale: .90 },
        { x: 820, y: 2160, scale: 1.00 }

    ]);


    /* =====================================================
       EASTERN LANDSCAPE
       ===================================================== */

    treeGroup([

        { x: 2200, y: 850, scale: .90 },
        { x: 2340, y: 900, scale: 1.00 },
        { x: 2470, y: 850, scale: .85 },

        { x: 2360, y: 1280, scale: .90 },
        { x: 2470, y: 1350, scale: 1.05 },

        { x: 2380, y: 1850, scale: .90 },
        { x: 2490, y: 1920, scale: 1.00 }

    ]);


    /* =====================================================
       NORTHERN LANDSCAPE
       ===================================================== */

    treeGroup([

        { x: 850, y: 450, scale: .90 },
        { x: 1050, y: 380, scale: 1.10 },
        { x: 1200, y: 450, scale: .85 },

        { x: 1800, y: 450, scale: .85 },
        { x: 1950, y: 380, scale: 1.10 },
        { x: 2150, y: 450, scale: .90 }

    ]);


    /* =====================================================
       CINEMA APPROACH
       ===================================================== */

    createFlowerBed(
        1200,
        1940,
        210,
        65,
        -8
    );

    createFlowerBed(
        1800,
        1940,
        210,
        65,
        8
    );


    /* =====================================================
       REFLECTION GARDEN
       CONFIRMED POSITION:
       x = 1930
       y = 1910
       ===================================================== */

    createFlowerBed(
        1790,
        1910,
        150,
        55,
        -20
    );

    createFlowerBed(
        2070,
        1910,
        150,
        55,
        20
    );


    treeGroup([

        { x: 1770, y: 1810, scale: .75 },
        { x: 1840, y: 1740, scale: .65 },

        { x: 2070, y: 1740, scale: .65 },
        { x: 2140, y: 1810, scale: .75 },

        { x: 1770, y: 2040, scale: .75 },
        { x: 1840, y: 2110, scale: .65 },

        { x: 2070, y: 2110, scale: .65 },
        { x: 2140, y: 2040, scale: .75 }

    ]);


    /* =====================================================
       ENTRANCE LANDSCAPING
       ===================================================== */

    createFlowerBed(
        1270,
        2450,
        260,
        70,
        -5
    );

    createFlowerBed(
        1730,
        2450,
        260,
        70,
        5
    );


    /* =====================================================
       ENTRANCE TREE PAIRS
       ===================================================== */

    treeGroup([

        { x: 1050, y: 2450, scale: 1.00 },
        { x: 1150, y: 2530, scale: .80 },

        { x: 1950, y: 2530, scale: .80 },
        { x: 2050, y: 2450, scale: 1.00 }

    ]);


    /* =====================================================
       CAMPUS PERIMETER
       -----------------------------------------------------
       Sparse trees create a park-like boundary.
       ===================================================== */

    treeGroup([

        { x: 280, y: 600, scale: .85 },
        { x: 400, y: 700, scale: .70 },
        { x: 280, y: 900, scale: .90 },

        { x: 2720, y: 600, scale: .85 },
        { x: 2600, y: 700, scale: .70 },
        { x: 2720, y: 900, scale: .90 },

        { x: 280, y: 2350, scale: .85 },
        { x: 400, y: 2250, scale: .70 },

        { x: 2720, y: 2350, scale: .85 },
        { x: 2600, y: 2250, scale: .70 }

    ]);


    /* =====================================================
       METADATA
       ===================================================== */

    svg.dataset.engine =
        "Voices of Humanity Landscape Engine v5.2";

    svg.dataset.treeCount =
        svg.querySelectorAll(
            ".landscape-tree"
        ).length;

    svg.dataset.flowerBedCount =
        svg.querySelectorAll(
            ".landscape-flower-bed"
        ).length;


    console.log(
        "✓ Landscape Engine v5.2 Loaded"
    );

    console.log(
        "✓ Trees:",
        svg.dataset.treeCount
    );

    console.log(
        "✓ Flower beds:",
        svg.dataset.flowerBedCount
    );

})();