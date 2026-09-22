/*======================================*
 * VOICES OF HUMANITY
 * NAVIGATION ENGINE v1.0
 * CAMPUS WAYPOINT ROUTING SYSTEM
 *======================================*/

(function () {

    "use strict";

    /*==================================
      ENGINE HEADER
    ==================================*/

    console.log(
        "================================"
    );

    console.log(
        "VOICES OF HUMANITY"
    );

    console.log(
        "NAVIGATION ENGINE v1.0"
    );

    console.log(
        "================================"
    );


    /*==================================
      INTERNAL STATE
    ==================================*/

    const NavigationEngine = {

        version: "1.0",

        waypoints: [],

        graph: new Map(),

        routes: new Map(),

        ready: false

    };


    /*==================================
      LOAD WAYPOINTS
    ==================================*/

    function loadWaypoints() {

        if (
            typeof Waypoints === "undefined"
        ) {

            console.error(
                "✗ Navigation Engine: Waypoints not found"
            );

            return false;

        }


        NavigationEngine.waypoints =
            Waypoints.map(function (point) {

                return {

                    name: point.name,

                    x: Number(point.x),

                    y: Number(point.y)

                };

            });


        console.log(
            "✓ Navigation Engine: Loaded " +
            NavigationEngine.waypoints.length +
            " waypoints"
        );


        return true;

    }


    /*==================================
      CREATE GRAPH NODES
    ==================================*/

    function createNodes() {

        NavigationEngine.graph.clear();


        NavigationEngine.waypoints.forEach(
            function (point) {

                NavigationEngine.graph.set(
                    point.name,
                    {

                        name: point.name,

                        x: point.x,

                        y: point.y,

                        connections: []

                    }
                );

            }
        );


        console.log(
            "✓ Navigation graph nodes created"
        );

    }


    /*==================================
      ADD CONNECTION
    ==================================*/

    function connect(
        from,
        to
    ) {

        const source =
            NavigationEngine.graph.get(from);

        const destination =
            NavigationEngine.graph.get(to);


        if (
            !source ||
            !destination
        ) {

            console.warn(
                "Navigation connection skipped:",
                from,
                "→",
                to
            );

            return;

        }


        source.connections.push(to);


        /*
         * Roads are treated as
         * bidirectional by default.
         */

        destination.connections.push(from);

    }


    /*==================================
      BUILD CAMPUS NETWORK
    ==================================*/

    function buildNetwork() {

        /*
         * SOUTHERN APPROACH
         */

        connect(
            "Visitor Centre",
            "Main Gate"
        );


        connect(
            "Main Gate",
            "Documentary Cinema"
        );


        /*
         * CENTRAL AXIS
         */

        connect(
            "Documentary Cinema",
            "Hall Entrance"
        );


        connect(
            "Hall Entrance",
            "Hall Centre"
        );


        /*
         * HALL → HERITAGE
         */

        connect(
            "Hall Centre",
            "Heritage Square"
        );


        connect(
            "Heritage Square",
            "North Exit"
        );


        /*
         * HALL → AFRICA
         */

        connect(
            "Hall Centre",
            "African Museum"
        );


        /*
         * HALL → ASIA
         */

        connect(
            "Hall Centre",
            "Asian Museum"
        );


        console.log(
            "✓ Campus navigation network built"
        );

    }


    /*==================================
      FIND WAYPOINT
    ==================================*/

    function getWaypoint(
        name
    ) {

        return NavigationEngine.graph.get(
            name
        ) || null;

    }


    /*==================================
      DISTANCE BETWEEN POINTS
    ==================================*/

    function distance(
        a,
        b
    ) {

        const dx =
            a.x - b.x;

        const dy =
            a.y - b.y;

        return Math.sqrt(
            dx * dx +
            dy * dy
        );

    }


    /*==================================
      FIND SHORTEST ROUTE
    ==================================*/

    function findRoute(
        start,
        destination
    ) {

        const startNode =
            getWaypoint(start);

        const destinationNode =
            getWaypoint(destination);


        if (
            !startNode ||
            !destinationNode
        ) {

            console.warn(
                "Navigation route failed:",
                start,
                "→",
                destination
            );

            return [];

        }


        if (
            start === destination
        ) {

            return [start];

        }


        /*
         * Dijkstra-style search
         */

        const distances =
            new Map();

        const previous =
            new Map();

        const unvisited =
            new Set();


        NavigationEngine.graph.forEach(
            function (node, name) {

                distances.set(
                    name,
                    Infinity
                );

                previous.set(
                    name,
                    null
                );

                unvisited.add(
                    name
                );

            }
        );


        distances.set(
            start,
            0
        );


        while (
            unvisited.size > 0
        ) {

            let current = null;

            let smallest =
                Infinity;


            unvisited.forEach(
                function (name) {

                    const value =
                        distances.get(name);


                    if (
                        value < smallest
                    ) {

                        smallest = value;

                        current = name;

                    }

                }
            );


            if (
                current === null
            ) {

                break;

            }


            if (
                current === destination
            ) {

                break;

            }


            unvisited.delete(
                current
            );


            const currentNode =
                NavigationEngine.graph.get(
                    current
                );


            currentNode.connections.forEach(
                function (neighborName) {

                    if (
                        !unvisited.has(
                            neighborName
                        )
                    ) {

                        return;

                    }


                    const neighbor =
                        NavigationEngine.graph.get(
                            neighborName
                        );


                    const currentDistance =
                        distances.get(
                            current
                        );


                    const newDistance =
                        currentDistance +
                        distance(
                            currentNode,
                            neighbor
                        );


                    if (
                        newDistance <
                        distances.get(
                            neighborName
                        )
                    ) {

                        distances.set(
                            neighborName,
                            newDistance
                        );

                        previous.set(
                            neighborName,
                            current
                        );

                    }

                }
            );

        }


        /*
         * Reconstruct route
         */

        const route = [];

        let current =
            destination;


        while (
            current !== null
        ) {

            route.unshift(
                current
            );


            current =
                previous.get(
                    current
                );

        }


        /*
         * No valid route
         */

        if (
            route.length === 0 ||
            route[0] !== start
        ) {

            console.warn(
                "✗ No route found:",
                start,
                "→",
                destination
            );

            return [];

        }


        return route;

    }


    /*==================================
      CACHE ROUTE
    ==================================*/

    function cacheRoute(
        start,
        destination
    ) {

        const key =
            start +
            "→" +
            destination;


        const route =
            findRoute(
                start,
                destination
            );


        NavigationEngine.routes.set(
            key,
            route
        );


        return route;

    }


    /*==================================
      PUBLIC API
    ==================================*/

    NavigationEngine.getWaypoint =
        getWaypoint;

    NavigationEngine.findRoute =
        findRoute;

    NavigationEngine.cacheRoute =
        cacheRoute;


    /*==================================
      INITIALISE
    ==================================*/

    function initialise() {

        if (
            !loadWaypoints()
        ) {

            return;

        }


        createNodes();

        buildNetwork();


        NavigationEngine.ready =
            true;


        console.log(
            "✓ Navigation Engine v1.0 Ready"
        );


        console.log(
            "Waypoints:",
            NavigationEngine.waypoints.length
        );


        console.log(
            "Navigation nodes:",
            NavigationEngine.graph.size
        );

    }


    /*==================================
      START
    ==================================*/

    initialise();


    /*
     * Expose globally
     */

    window.NavigationEngine =
        NavigationEngine;


})();