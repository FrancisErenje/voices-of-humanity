/*======================================*
* VOICES OF HUMANITY
* ROAD ENGINE v3.0
* CURVED CAMPUS CIRCULATION SYSTEM
*======================================*/

(function () {

    const campus =
        document.getElementById("campus");

    if (!campus) {

        console.error(
            "✗ Road Engine: Campus not found"
        );

        return;

    }


    /*==================================
      REMOVE OLD GENERATED ROAD SYSTEM
    ==================================*/

    const oldNetwork =
        document.getElementById(
            "museum-road-network"
        );

    if (oldNetwork) {

        oldNetwork.remove();

    }


    /*==================================
      CREATE ROAD LAYER
    ==================================*/

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

    svg.id =
        "museum-road-network";

    svg.setAttribute(
        "width",
        "3000"
    );

    svg.setAttribute(
        "height",
        "3000"
    );

    svg.setAttribute(
        "viewBox",
        "0 0 3000 3000"
    );

    svg.style.position =
        "absolute";

    svg.style.left =
        "0";

    svg.style.top =
        "0";

    svg.style.width =
        "3000px";

    svg.style.height =
        "3000px";

    svg.style.pointerEvents =
        "none";

    svg.style.zIndex =
        "2";


    /*==================================
      PUT ROAD NETWORK BEHIND BUILDINGS
    ==================================*/

    campus.insertBefore(
        svg,
        campus.firstChild
    );


    /*==================================
      ROAD DEFINITIONS
    ==================================*/

    const roadStyles = {

        road: {

            width: 52,

            edge: 64,

            color: "#30313d",

            edgeColor: "#73727a"

        },

        walkway: {

            width: 24,

            edge: 32,

            color: "#c8c1b5",

            edgeColor: "#e5dfd4"

        },

        footpath: {

            width: 14,

            edge: 20,

            color: "#b7ae9f",

            edgeColor: "#d8d0c4"

        }

    };


    /*==================================
      CREATE SVG PATH
    ==================================*/

    function createPath(
        d,
        type,
        id
    ) {

        const style =
            roadStyles[type] ||
            roadStyles.road;


        /*
        Outer edge
        */

        const edge =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        edge.setAttribute(
            "d",
            d
        );

        edge.setAttribute(
            "fill",
            "none"
        );

        edge.setAttribute(
            "stroke",
            style.edgeColor
        );

        edge.setAttribute(
            "stroke-width",
            style.edge
        );

        edge.setAttribute(
            "stroke-linecap",
            "round"
        );

        edge.setAttribute(
            "stroke-linejoin",
            "round"
        );

        edge.classList.add(
            "museum-road-edge"
        );


        /*
        Main surface
        */

        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        path.setAttribute(
            "d",
            d
        );

        path.setAttribute(
            "fill",
            "none"
        );

        path.setAttribute(
            "stroke",
            style.color
        );

        path.setAttribute(
            "stroke-width",
            style.width
        );

        path.setAttribute(
            "stroke-linecap",
            "round"
        );

        path.setAttribute(
            "stroke-linejoin",
            "round"
        );

        path.dataset.roadId =
            id;

        /*
         * Keep the circulation type on the rendered path so other
         * systems can distinguish vehicle roads from pedestrian paths.
         */
        path.dataset.roadType =
            type;

        path.classList.add(
            "museum-road"
        );


        svg.appendChild(edge);

        svg.appendChild(path);


        /*
        Centre marking only on roads
        */

        if (type === "road") {

            const marking =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );

            marking.setAttribute(
                "d",
                d
            );

            marking.setAttribute(
                "fill",
                "none"
            );

            marking.setAttribute(
                "stroke",
                "#d8b84a"
            );

            marking.setAttribute(
                "stroke-width",
                "3"
            );

            marking.setAttribute(
                "stroke-dasharray",
                "24 20"
            );

            marking.setAttribute(
                "stroke-linecap",
                "round"
            );

            marking.classList.add(
                "museum-road-marking"
            );

            svg.appendChild(
                marking
            );

        }

    }


    /*==================================
      MAIN VISITOR ROAD
    ==================================*/

    createPath(

        `
        M 1500 2500
        C 1420 2380,
          1600 2250,
          1510 2120

        C 1430 2010,
          1420 1930,
          1500 1850
        `,

        "road",

        "visitor-to-cinema"

    );


    /*==================================
      CINEMA → HALL
      DELIBERATELY CURVED
    ==================================*/

    createPath(

        `
        M 1500 1850

        C 1320 1770,
          1370 1660,
          1500 1580

        C 1640 1490,
          1680 1390,
          1500 1300
        `,

        "road",

        "cinema-to-hall"

    );


    /*==================================
      CINEMA FOOTPATH / STEPPED APPROACH
    ==================================*/

    createPath(

        `
        M 1500 1770

        C 1420 1740,
          1420 1690,
          1500 1650

        C 1580 1610,
          1580 1570,
          1500 1530
        `,

        "walkway",

        "cinema-footpath"

    );


    /*==================================
      HALL → HERITAGE SQUARE
    ==================================*/

    createPath(

        `
        M 1500 1300

        C 1430 1220,
          1580 1130,
          1510 1050

        C 1470 1000,
          1490 950,
          1500 900
        `,

        "road",

        "hall-to-square"

    );


    /*==================================
      HALL → AFRICA

      REMOVED FROM THE HALL FORECOURT.
      The African complex keeps its own circulation, while the Hall
      forecourt remains visually open and the Asia road terminates
      at the established central approach point.
    ==================================*/


    /*==================================
      AFRICA → AMERICAS
    ==================================*/

    createPath(

        `
        M 1050 1300

        C 930 1370,
          940 1510,
          1050 1600

        C 1110 1650,
          1100 1710,
          1050 1750
        `,

        "walkway",

        "africa-to-americas"

    );


    /*==================================
      HALL → EUROPE
    ==================================*/

    createPath(

        `
        M 1500 1300

        C 1410 1220,
          1430 1110,
          1500 950
        `,

        "walkway",

        "hall-to-europe"

    );


/*==================================
  HALL → ASIA
  DEEP FORECOURT ROUTE
  ROAD PASSES IN FRONT OF ASIAN MUSEUM
==================================*/

createPath(

    `
    M 1570 1455

    C 1740 1500,
      1900 1545,
      2070 1560

    C 2240 1575,
      2390 1545,
      2490 1480

    C 2560 1435,
      2595 1375,
      2610 1310
    `,

    "road",

    "hall-to-asia"

);


/*==================================
  ASIA → OCEANIA
  CONTINUES AROUND EASTERN SIDE
  OF ASIAN MUSEUM
==================================*/

createPath(

    `
    M 2610 1310

    C 2660 1380,
      2660 1460,
      2600 1530

    C 2530 1610,
      2390 1640,
      2250 1620

    C 2210 1615,
      2180 1605,
      2150 1600
    `,

    "walkway",

    "asia-to-oceania"

);
    /*==================================
      AMERICAS → CINEMA
    ==================================*/



    /*==================================
      OCEANIA → CINEMA
    ==================================*/

    createPath(

        `
        M 2150 1600

        C 2070 1690,
          1930 1780,
          1600 1850
        `,

        "footpath",

        "oceania-to-cinema"

    );


    /*==================================
      CINEMA STEPS
    ==================================*/

    function createSteps() {

        const group =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );

        group.classList.add(
            "cinema-steps"
        );

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const step =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                );

            step.setAttribute(
                "x",
                1440 - i * 10
            );

            step.setAttribute(
                "y",
                1670 - i * 16
            );

            step.setAttribute(
                "width",
                120 + i * 20
            );

            step.setAttribute(
                "height",
                12
            );

            step.setAttribute(
                "rx",
                4
            );

            step.setAttribute(
                "fill",
                "#d8d0c4"
            );

            step.setAttribute(
                "stroke",
                "#aaa195"
            );

            step.setAttribute(
                "stroke-width",
                "2"
            );

            group.appendChild(
                step
            );

        }

        svg.appendChild(
            group
        );

    }

/*========================================================*
  VOICES OF HUMANITY
  ROAD ENGINE v4.1
  MASTER CIRCULATION UPGRADE
  --------------------------------------------------------
  This section preserves all existing V3 roads and adds:
  - Reflection Garden circulation
  - Southern entrance roundabout
  - Small landscape circles
*========================================================*/


/*========================================================*
  REFLECTION GARDEN
  CONFIRMED COORDINATE:
  X = 1930
  Y = 1910
*========================================================*/


/* Oceania → Reflection Garden */

createPath(
    `
    M 2150 1600

    C 2110 1690,
      2070 1780,
      2005 1845

    C 1980 1870,
      1950 1895,
      1930 1910
    `,
    "walkway",
    "oceania-to-reflection-garden"
);


/* Reflection Garden → Cinema */

createPath(
    `
    M 1930 1910

    C 1850 1900,
      1770 1880,
      1690 1860

    C 1650 1850,
      1615 1850,
      1600 1850
    `,
    "walkway",
    "reflection-garden-to-cinema"
);


/*========================================================*
  REFLECTION GARDEN CIRCULAR WALK
*========================================================*/

createPath(
    `
    M 1930 1910

    C 1990 1930,
      2010 1980,
      1980 2025

    C 1950 2070,
      1885 2085,
      1840 2055

    C 1795 2025,
      1785 1965,
      1820 1925

    C 1850 1890,
      1895 1885,
      1930 1910
    `,
    "footpath",
    "reflection-garden-loop"
);


/*========================================================*
  REFLECTION GARDEN INNER WALK
*========================================================*/

createPath(
    `
    M 1860 1960

    C 1885 1935,
      1910 1920,
      1930 1910

    C 1960 1935,
      1970 1965,
      1950 1990
    `,
    "footpath",
    "reflection-garden-inner-path"
);


/*========================================================*
  SOUTHERN ENTRANCE ROUNDABOUT
*========================================================*/

function createRoundabout(
    cx,
    cy,
    radius,
    id
) {

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

    group.classList.add(
        "museum-roundabout"
    );

    group.dataset.roundaboutId =
        id;


    /* Outer road edge */

    const outer =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    outer.setAttribute(
        "cx",
        cx
    );

    outer.setAttribute(
        "cy",
        cy
    );

    outer.setAttribute(
        "r",
        radius
    );

    outer.setAttribute(
        "fill",
        "none"
    );

    outer.setAttribute(
        "stroke",
        "#73727a"
    );

    outer.setAttribute(
        "stroke-width",
        "64"
    );


    /* Road surface */

    const road =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    road.setAttribute(
        "cx",
        cx
    );

    road.setAttribute(
        "cy",
        cy
    );

    road.setAttribute(
        "r",
        radius
    );

    road.setAttribute(
        "fill",
        "none"
    );

    road.setAttribute(
        "stroke",
        "#30313d"
    );

    road.setAttribute(
        "stroke-width",
        "52"
    );


    /* Central island */

    const island =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    island.setAttribute(
        "cx",
        cx
    );

    island.setAttribute(
        "cy",
        cy
    );

    island.setAttribute(
        "r",
        radius - 38
    );

    island.setAttribute(
        "fill",
        "#6fa85c"
    );

    island.setAttribute(
        "stroke",
        "#527d48"
    );

    island.setAttribute(
        "stroke-width",
        "5"
    );


    /* Central decorative circle */

    const centre =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    centre.setAttribute(
        "cx",
        cx
    );

    centre.setAttribute(
        "cy",
        cy
    );

    centre.setAttribute(
        "r",
        radius - 82
    );

    centre.setAttribute(
        "fill",
        "#d8d0c4"
    );

    centre.setAttribute(
        "stroke",
        "#aaa195"
    );

    centre.setAttribute(
        "stroke-width",
        "4"
    );


    group.appendChild(
        outer
    );

    group.appendChild(
        road
    );

    group.appendChild(
        island
    );

    group.appendChild(
        centre
    );


    svg.appendChild(
        group
    );
}


/*========================================================*
  AMERICAS ↔ CINEMA ROUNDABOUT
  Positioned between the Americas Languages Museum and
  the Documentary Cinema so the southern entrance remains
  visually separate from the cinema district.
*========================================================*/

createRoundabout(
    983,
    1943,
    110,
    "americas-cinema"
);


/*========================================================*
  AMERICAS → ROUNDABOUT
*========================================================*/

createPath(
    `
    M 1050 1750

    C 1040 1785,
      1028 1815,
      1019 1839
    `,
    "road",
    "americas-to-roundabout"
);


/*========================================================*
  ROUNDABOUT → CINEMA
*========================================================*/

createPath(
    `
    M 1500 1850

    C 1380 1870,
      1230 1905,
      1091 1924
    `,
    "road",
    "roundabout-to-cinema"
);

/* HALL → AMERICAS/CINEMA ROUNDABOUT
   Clean edge-to-edge connection; does not enter the roundabout center. */
createPath(
    `
    M 1280 1580
    C 1200 1660,
      1135 1760,
      1065 1848
    `,
    "road",
    "hall-to-americas-roundabout"
);

/* Keep the roundabout visually above every approach road so no connector
   paints through the central island; each connector terminates at its edge. */
const americasCinemaRoundabout =
    svg.querySelector('[data-roundabout-id="americas-cinema"]');

if (americasCinemaRoundabout) {
    svg.appendChild(americasCinemaRoundabout);
}


/*========================================================*
  EUROPE → ASIA
  SHORTENED EUROPE → ASIA CORRIDOR
  --------------------------------------------------------
  The road leaves the European museum and follows the same
  gentle rear corridor, but stops before reaching the Asian
  museum so there is a clear visual gap between the road and
  the Asian building.
*========================================================*/

createPath(
    `
    M 1500 680

    C 1740 685,
      1945 770,
      2140 860
    `,
    "road",
    "europe-to-asia"
);


/*========================================================*
  LANDSCAPE NODES
  These are garden features, NOT road roundabouts.
*========================================================*/

function createLandscapeNode(cx, cy, radius, id) {

    const group =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );

    group.classList.add("museum-landscape-node");
    group.dataset.nodeId = id;

    /* Outer planting bed */

    const bed =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    bed.setAttribute("cx", cx);
    bed.setAttribute("cy", cy);
    bed.setAttribute("r", radius);

    bed.setAttribute("fill", "#547d47");
    bed.setAttribute("stroke", "#8fae68");
    bed.setAttribute("stroke-width", "5");

    /* Inner garden */

    const garden =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    garden.setAttribute("cx", cx);
    garden.setAttribute("cy", cy);
    garden.setAttribute("r", radius - 15);

    garden.setAttribute("fill", "#6f9b58");
    garden.setAttribute("stroke", "#c7b76a");
    garden.setAttribute("stroke-width", "3");

    /* Central feature */

    const feature =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    feature.setAttribute("cx", cx);
    feature.setAttribute("cy", cy);
    feature.setAttribute("r", radius * 0.30);

    feature.setAttribute("fill", "#d8d0c4");
    feature.setAttribute("stroke", "#aaa195");
    feature.setAttribute("stroke-width", "3");

    group.appendChild(bed);
    group.appendChild(garden);
    group.appendChild(feature);

    svg.appendChild(group);
}


/* Western landscape node */

createLandscapeNode(
    980,
    1090,
    78,
    "western-landscape-node"
);


/* Eastern landscape node */

createLandscapeNode(
    2020,
    1430,
    78,
    "eastern-landscape-node"
);


/*========================================================*
  ENGINE STATUS
*========================================================*/

console.log(
    "✓ Road Engine v4.1 circulation upgrade loaded"
);

console.log(
    "✓ Reflection Garden locked at X:1930 Y:1910"
);

    createSteps();


    /*==================================
      ROAD LABEL
    ==================================*/

    console.log(
        "✓ Road Engine v3 Loaded"
    );

})();