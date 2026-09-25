/*======================================*
 * VOICES OF HUMANITY
 * VISITOR ENGINE v4.1
 * BUILDING-SAFE, DISTRIBUTED CAMPUS MOVEMENT
 *======================================*
 *
 * Visitors use the museum's rendered circulation network, but they are
 * never allowed to enter a building footprint. Roads, walkways, footpaths
 * and roundabouts are legal movement surfaces; building interiors are not.
 *
 * Visitors are deliberately distributed across the museum's connected
 * circulation areas rather than being spawned only in the largest area.
 * Each visitor then explores within its assigned circulation component,
 * creating visible life across the campus while preserving safe routing.
 * Visitors continuously circulate during daylight and remain still at night.
 *======================================*/

(function () {
    "use strict";

    const campus = document.getElementById("campus");
    const visitors = [];

    const VisitorTypes = ["tourist", "student", "researcher", "family"];
    const VisitorBehaviour = {
        tourist:    { minSpeed: 0.32, maxSpeed: 0.48, minStay: 1400, maxStay: 3200 },
        student:    { minSpeed: 0.55, maxSpeed: 0.78, minStay: 900,  maxStay: 2200 },
        researcher: { minSpeed: 0.25, maxSpeed: 0.40, minStay: 1800, maxStay: 3800 },
        family:     { minSpeed: 0.35, maxSpeed: 0.52, minStay: 1200, maxStay: 3000 }
    };

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function isNight() {
        return campus && campus.classList.contains("night");
    }

    /*----------------------------------*
     * BUILDING COLLISION MAP
     *----------------------------------*/

    const BUILDING_SELECTORS = [
        "#hall-humanity",
        "#cinema",
        "#africaMuseum",
        "#asiaMuseum",
        "#europeMuseum",
        "#americasMuseum",
        "#oceaniaMuseum",
        "#lm247Building",
        ".visitor-centre"
    ];

    const BuildingMap = {
        rects: [],
        ready: false,
        margin: 18
    };

    function campusRect() {
        return campus.getBoundingClientRect();
    }

    function domRectToWorld(element) {
        const campusBox = campusRect();
        const elementBox = element.getBoundingClientRect();
        const scaleX = campus.offsetWidth ? campusBox.width / campus.offsetWidth : 1;
        const scaleY = campus.offsetHeight ? campusBox.height / campus.offsetHeight : 1;

        return {
            left: (elementBox.left - campusBox.left) / scaleX,
            top: (elementBox.top - campusBox.top) / scaleY,
            right: (elementBox.right - campusBox.left) / scaleX,
            bottom: (elementBox.bottom - campusBox.top) / scaleY
        };
    }

    function refreshBuildingMap() {
        BuildingMap.rects = [];

        BUILDING_SELECTORS.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                const rect = domRectToWorld(element);
                if (!Number.isFinite(rect.left) || !Number.isFinite(rect.top)) return;

                BuildingMap.rects.push({
                    left: rect.left - BuildingMap.margin,
                    top: rect.top - BuildingMap.margin,
                    right: rect.right + BuildingMap.margin,
                    bottom: rect.bottom + BuildingMap.margin,
                    element
                });
            });
        });

        BuildingMap.ready = BuildingMap.rects.length > 0;
        console.log("✓ Visitor building safety map:", BuildingMap.rects.length, "buildings");
        return BuildingMap.ready;
    }

    function pointInsideRect(point, rect) {
        return point.x >= rect.left && point.x <= rect.right &&
               point.y >= rect.top && point.y <= rect.bottom;
    }

    function orientation(a, b, c) {
        const value = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
        if (Math.abs(value) < 0.0001) return 0;
        return value > 0 ? 1 : 2;
    }

    function onSegment(a, b, c) {
        return b.x <= Math.max(a.x, c.x) + 0.001 &&
               b.x + 0.001 >= Math.min(a.x, c.x) &&
               b.y <= Math.max(a.y, c.y) + 0.001 &&
               b.y + 0.001 >= Math.min(a.y, c.y);
    }

    function segmentsIntersect(a, b, c, d) {
        const o1 = orientation(a, b, c);
        const o2 = orientation(a, b, d);
        const o3 = orientation(c, d, a);
        const o4 = orientation(c, d, b);

        if (o1 !== o2 && o3 !== o4) return true;
        if (o1 === 0 && onSegment(a, c, b)) return true;
        if (o2 === 0 && onSegment(a, d, b)) return true;
        if (o3 === 0 && onSegment(c, a, d)) return true;
        if (o4 === 0 && onSegment(c, b, d)) return true;
        return false;
    }

    function segmentIntersectsRect(a, b, rect) {
        if (pointInsideRect(a, rect) || pointInsideRect(b, rect)) return true;

        const topLeft = { x: rect.left, y: rect.top };
        const topRight = { x: rect.right, y: rect.top };
        const bottomRight = { x: rect.right, y: rect.bottom };
        const bottomLeft = { x: rect.left, y: rect.bottom };

        return segmentsIntersect(a, b, topLeft, topRight) ||
               segmentsIntersect(a, b, topRight, bottomRight) ||
               segmentsIntersect(a, b, bottomRight, bottomLeft) ||
               segmentsIntersect(a, b, bottomLeft, topLeft);
    }

    function isLegalPoint(point) {
        if (!BuildingMap.ready) return true;
        return !BuildingMap.rects.some(function (rect) {
            return pointInsideRect(point, rect);
        });
    }

    function isLegalSegment(a, b) {
        if (!BuildingMap.ready) return true;
        return !BuildingMap.rects.some(function (rect) {
            return segmentIntersectsRect(a, b, rect);
        });
    }

    /*----------------------------------*
     * ROAD / PATH NAVIGATION GRAPH
     *----------------------------------*/

    const MovementGraph = {
        nodes: [],
        edges: new Map(),
        ready: false
    };

    let CirculationComponents = [];
    let LargestCirculationComponent = [];

    function addNode(x, y, meta) {
        if (!isLegalPoint({ x, y })) return null;

        const id = MovementGraph.nodes.length;
        MovementGraph.nodes.push({ id, x, y, meta: meta || null });
        MovementGraph.edges.set(id, []);
        return id;
    }

    function addEdge(a, b, weight) {
        if (a === null || b === null || a === undefined || b === undefined || a === b) return;

        const nodeA = MovementGraph.nodes[a];
        const nodeB = MovementGraph.nodes[b];
        if (!nodeA || !nodeB || !isLegalSegment(nodeA, nodeB)) return;

        MovementGraph.edges.get(a).push({ to: b, weight });
        MovementGraph.edges.get(b).push({ to: a, weight });
    }

    function connectNearbyNodes(maxDistance) {
        const nodes = MovementGraph.nodes;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const d = distance(nodes[i], nodes[j]);
                if (d <= maxDistance && isLegalSegment(nodes[i], nodes[j])) {
                    addEdge(i, j, d);
                }
            }
        }
    }

    function addSvgPath(path, sampleSpacing) {
        let length;
        try {
            length = path.getTotalLength();
        } catch (error) {
            return;
        }

        if (!Number.isFinite(length) || length <= 0) return;

        const samples = Math.max(2, Math.ceil(length / sampleSpacing));
        let previousId = null;

        for (let i = 0; i <= samples; i++) {
            const point = path.getPointAtLength(Math.min(length, (length * i) / samples));
            const id = addNode(point.x, point.y, {
                type: "path",
                source: path.dataset.roadId || "campus-path",
                roadType: path.dataset.roadType || "path"
            });

            if (id === null) {
                previousId = null;
                continue;
            }

            if (previousId !== null) {
                const a = MovementGraph.nodes[previousId];
                const b = MovementGraph.nodes[id];
                addEdge(previousId, id, distance(a, b));
            }

            previousId = id;
        }
    }

    function addRoundabout(circle, sampleCount) {
        const cx = Number(circle.getAttribute("cx"));
        const cy = Number(circle.getAttribute("cy"));
        const radius = Number(circle.getAttribute("r"));
        if (![cx, cy, radius].every(Number.isFinite)) return;

        const ids = [];
        const step = (Math.PI * 2) / sampleCount;

        for (let i = 0; i < sampleCount; i++) {
            const angle = i * step;
            const id = addNode(
                cx + Math.cos(angle) * radius,
                cy + Math.sin(angle) * radius,
                { type: "roundabout", source: circle.parentNode?.dataset?.roundaboutId || "roundabout" }
            );
            ids.push(id);
        }

        for (let i = 0; i < sampleCount; i++) {
            const a = ids[i];
            const b = ids[(i + 1) % sampleCount];
            if (a !== null && b !== null) {
                addEdge(a, b, distance(MovementGraph.nodes[a], MovementGraph.nodes[b]));
            }
        }
    }

    function buildMovementGraph() {
        MovementGraph.nodes.length = 0;
        MovementGraph.edges.clear();
        MovementGraph.ready = false;

        const roadSvg = document.getElementById("museum-road-network");
        if (!roadSvg) {
            console.warn("Visitor Engine: road network not ready.");
            return false;
        }

        refreshBuildingMap();

        roadSvg.querySelectorAll("path.museum-road").forEach(function (path) {
            addSvgPath(path, 30);
        });

        roadSvg.querySelectorAll("g.museum-roundabout circle").forEach(function (circle) {
            const strokeWidth = Number(circle.getAttribute("stroke-width")) || 0;
            const radius = Number(circle.getAttribute("r")) || 0;
            if (strokeWidth === 52 && radius > 0) {
                addRoundabout(circle, 36);
            }
        });

        connectNearbyNodes(72);

        MovementGraph.ready = MovementGraph.nodes.length > 0;
        console.log("✓ Visitor movement graph built:", MovementGraph.nodes.length, "building-safe circulation nodes");
        return MovementGraph.ready;
    }

    function buildCirculationComponents() {
        CirculationComponents = [];
        const visited = new Set();

        MovementGraph.nodes.forEach(function (node) {
            if (visited.has(node.id)) return;

            const component = [];
            const queue = [node.id];
            visited.add(node.id);

            while (queue.length) {
                const current = queue.shift();
                component.push(current);

                (MovementGraph.edges.get(current) || []).forEach(function (edge) {
                    if (visited.has(edge.to)) return;
                    visited.add(edge.to);
                    queue.push(edge.to);
                });
            }

            CirculationComponents.push(component);
        });

        CirculationComponents.sort(function (a, b) { return b.length - a.length; });
        LargestCirculationComponent = CirculationComponents[0] || [];

        console.log(
            "✓ Visitor circulation components:",
            CirculationComponents.length,
            "· largest:",
            LargestCirculationComponent.length,
            "nodes"
        );

        return LargestCirculationComponent;
    }

    function usableCirculationComponents() {
        return CirculationComponents.filter(function (component) {
            return component.length >= 4;
        });
    }

    function randomNodeFromComponent(component, visitor) {
        if (!component || !component.length) return null;

        let id = component[Math.floor(Math.random() * component.length)];
        let attempts = 0;

        while (attempts < 24 && visitor) {
            const candidate = component[Math.floor(Math.random() * component.length)];
            const node = MovementGraph.nodes[candidate];
            if (node && distance(visitor, node) > 180) {
                id = candidate;
                break;
            }
            attempts++;
        }

        return MovementGraph.nodes[id] || null;
    }

    function randomCirculationNode(visitor) {
        const component = visitor && visitor.component && visitor.component.length
            ? visitor.component
            : LargestCirculationComponent;

        return randomNodeFromComponent(component, visitor);
    }

    function nearestNode(point, component) {
        let best = null;
        let bestDistance = Infinity;
        const pool = component && component.length ? component : MovementGraph.nodes.map(function (node) {
            return node.id;
        });

        pool.forEach(function (id) {
            const node = MovementGraph.nodes[id];
            if (!node) return;

            const d = distance(point, node);
            if (d < bestDistance) {
                bestDistance = d;
                best = node;
            }
        });

        return best;
    }

    /*----------------------------------*
     * SHORTEST LEGAL ROUTE
     *----------------------------------*/

    function findNodeRoute(startId, targetId) {
        if (startId === targetId) return [startId];

        const distances = new Map();
        const previous = new Map();
        const open = new Set();

        MovementGraph.nodes.forEach(function (node) {
            distances.set(node.id, Infinity);
            previous.set(node.id, null);
            open.add(node.id);
        });
        distances.set(startId, 0);

        while (open.size) {
            let current = null;
            let smallest = Infinity;

            open.forEach(function (id) {
                const value = distances.get(id);
                if (value < smallest) {
                    smallest = value;
                    current = id;
                }
            });

            if (current === null || current === targetId) break;
            open.delete(current);

            (MovementGraph.edges.get(current) || []).forEach(function (edge) {
                if (!open.has(edge.to)) return;
                const candidate = smallest + edge.weight;
                if (candidate < distances.get(edge.to)) {
                    distances.set(edge.to, candidate);
                    previous.set(edge.to, current);
                }
            });
        }

        if (!Number.isFinite(distances.get(targetId))) return [];

        const route = [];
        let current = targetId;
        while (current !== null) {
            route.unshift(current);
            current = previous.get(current);
        }
        return route[0] === startId ? route : [];
    }

    function compressRoute(route) {
        return route.slice();
    }

    function buildRoute(startPoint, destinationPoint, component) {
        if (!MovementGraph.ready) return [];

        const startNode = nearestNode(startPoint, component);
        const destinationNode = nearestNode(destinationPoint, component);
        if (!startNode || !destinationNode) return [];

        const nodeRoute = findNodeRoute(startNode.id, destinationNode.id);
        if (!nodeRoute.length) return [];

        return compressRoute(nodeRoute).map(function (id) {
            const node = MovementGraph.nodes[id];
            return { x: node.x, y: node.y };
        });
    }

    /*----------------------------------*
     * VISITOR CREATION
     *----------------------------------*/

    function createVisitor(x, y, component) {
        const person = document.createElement("div");
        const type = VisitorTypes[Math.floor(Math.random() * VisitorTypes.length)];
        const behaviour = VisitorBehaviour[type];

        person.className = "visitor " + type;
        person.style.left = x + "px";
        person.style.top = y + "px";
        person.setAttribute("aria-hidden", "true");

        const head = document.createElement("span"); head.className = "visitor-head";
        const torso = document.createElement("span"); torso.className = "visitor-torso";
        const leftArm = document.createElement("span"); leftArm.className = "visitor-arm visitor-arm-left";
        const rightArm = document.createElement("span"); rightArm.className = "visitor-arm visitor-arm-right";
        const leftLeg = document.createElement("span"); leftLeg.className = "visitor-leg visitor-leg-left";
        const rightLeg = document.createElement("span"); rightLeg.className = "visitor-leg visitor-leg-right";

        person.append(head, torso, leftArm, rightArm, leftLeg, rightLeg);
        campus.appendChild(person);

        const visitor = {
            element: person,
            type,
            x,
            y,
            component: component || LargestCirculationComponent,
            speed: randomBetween(behaviour.minSpeed, behaviour.maxSpeed),
            targetX: x,
            targetY: y,
            waiting: false,
            state: "night",
            destination: "circulation",
            route: [],
            routeIndex: 0,
            stayMin: behaviour.minStay,
            stayMax: behaviour.maxStay,
            thinkingDelay: randomBetween(250, 1300),
            directionX: 0,
            directionY: 1
        };

        visitors.push(visitor);
        return visitor;
    }

    /*----------------------------------*
     * DESTINATION / ROUTE CONTROL
     *----------------------------------*/

    function setDestination(visitor, destinationNode) {
        if (isNight()) {
            visitor.state = "night";
            visitor.waiting = true;
            return false;
        }

        if (!destinationNode) return false;

        const route = buildRoute(
            { x: visitor.x, y: visitor.y },
            { x: destinationNode.x, y: destinationNode.y },
            visitor.component
        );

        if (!route.length) return false;

        visitor.destination = "circulation";
        visitor.route = route;
        visitor.routeIndex = 0;
        visitor.state = "walking";
        visitor.waiting = false;
        moveToNextWaypoint(visitor);
        return true;
    }

    function moveToNextWaypoint(visitor) {
        if (!visitor.route || visitor.routeIndex >= visitor.route.length) return;
        const point = visitor.route[visitor.routeIndex];
        visitor.targetX = point.x;
        visitor.targetY = point.y;
        visitor.state = "walking";
        visitor.waiting = false;
    }

    function chooseNextStop(visitor) {
        if (isNight()) {
            visitor.state = "night";
            visitor.waiting = true;
            return;
        }

        const destinationNode = randomCirculationNode(visitor);
        if (!setDestination(visitor, destinationNode)) {
            window.setTimeout(function () { chooseNextStop(visitor); }, 250);
        }
    }

    function handleArrival(visitor) {
        if (visitor.waiting) return;

        visitor.waiting = true;
        visitor.state = "waiting";

        window.setTimeout(function () {
            if (isNight()) {
                visitor.state = "night";
                visitor.waiting = true;
                return;
            }

            if (visitor.routeIndex < visitor.route.length - 1) {
                visitor.routeIndex++;
                visitor.waiting = false;
                moveToNextWaypoint(visitor);
                return;
            }

            visitor.waiting = false;
            chooseNextStop(visitor);
        }, 120);
    }

    /*----------------------------------*
     * MOVEMENT LOOP
     *----------------------------------*/

    function updateVisitors() {
        const night = isNight();

        visitors.forEach(function (visitor) {
            if (night) {
                if (visitor.state !== "waiting") visitor.state = "night";
                visitor.element.style.setProperty("--visitor-paused", "1");
                return;
            }

            visitor.element.style.removeProperty("--visitor-paused");

            if (visitor.state === "night") {
                visitor.waiting = false;
                chooseNextStop(visitor);
                return;
            }

            if (visitor.state === "waiting") return;

            const dx = visitor.targetX - visitor.x;
            const dy = visitor.targetY - visitor.y;
            const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

            if (distanceToTarget <= Math.max(3, visitor.speed + 1)) {
                visitor.x = visitor.targetX;
                visitor.y = visitor.targetY;
                visitor.element.style.left = visitor.x + "px";
                visitor.element.style.top = visitor.y + "px";
                handleArrival(visitor);
                return;
            }

            const directionX = dx / distanceToTarget;
            const directionY = dy / distanceToTarget;
            const nextPoint = {
                x: visitor.x + directionX * visitor.speed,
                y: visitor.y + directionY * visitor.speed
            };

            if (!isLegalPoint(nextPoint) || !isLegalSegment({ x: visitor.x, y: visitor.y }, nextPoint)) {
                visitor.waiting = false;
                visitor.state = "walking";
                chooseNextStop(visitor);
                return;
            }

            visitor.directionX = directionX;
            visitor.directionY = directionY;
            visitor.x = nextPoint.x;
            visitor.y = nextPoint.y;
            visitor.element.style.left = visitor.x + "px";
            visitor.element.style.top = visitor.y + "px";

            const angle = Math.atan2(directionY, directionX) * 180 / Math.PI;
            visitor.element.style.setProperty("--visitor-angle", angle + "deg");
        });

        window.requestAnimationFrame(updateVisitors);
    }

    /*----------------------------------*
     * START
     *----------------------------------*/

    function startVisitors() {
        if (!campus) {
            console.warn("Visitor Engine: campus not found.");
            return;
        }

        if (!buildMovementGraph()) {
            console.warn("Visitor Engine: legal movement network unavailable; retrying shortly.");
            window.setTimeout(startVisitors, 250);
            return;
        }

        campus.querySelectorAll(".visitor").forEach(function (visitor) { visitor.remove(); });
        visitors.length = 0;

        buildCirculationComponents();

        const usableComponents = usableCirculationComponents();
        if (!usableComponents.length) {
            console.warn("Visitor Engine: no usable connected circulation areas found.");
            return;
        }

        /*
         * DISTRIBUTION RULE:
         * Assign visitors round-robin across the largest usable circulation
         * areas first. This prevents all 15 people from appearing in one
         * location and makes the campus feel inhabited from the start.
         */
        const visitorCount = 18;
        const usedStarts = [];

        for (let i = 0; i < visitorCount; i++) {
            const component = usableComponents[i % usableComponents.length];

            let node = null;
            let attempts = 0;

            while (attempts < 30) {
                const candidateId = component[Math.floor(Math.random() * component.length)];
                const candidate = MovementGraph.nodes[candidateId];

                if (candidate && isLegalPoint(candidate) && usedStarts.every(function (point) {
                    return distance(candidate, point) > 70;
                })) {
                    node = candidate;
                    break;
                }

                attempts++;
            }

            if (!node) {
                node = MovementGraph.nodes[
                    component[i % component.length]
                ];
            }

            usedStarts.push({ x: node.x, y: node.y });

            const visitor = createVisitor(node.x, node.y, component);
            window.setTimeout(function () {
                chooseNextStop(visitor);
            }, visitor.thinkingDelay + (i * 90));
        }

        console.log("✓ Visitors distributed across", usableComponents.length, "circulation areas");
        updateVisitors();
    }

    function visitorStatus() {
        console.log("================================");
        console.log("VOICES OF HUMANITY");
        console.log("VISITOR ENGINE v4.1");
        console.log("================================");
        console.log("Visitors:", visitors.length);
        console.log("Legal movement nodes:", MovementGraph.nodes.length);
        console.log("Circulation areas:", CirculationComponents.length);
        console.log("Usable circulation areas:", usableCirculationComponents().length);
        console.log("Buildings protected:", BuildingMap.rects.length);
        console.log("Night mode:", isNight());
        console.log("Network ready:", MovementGraph.ready);
        console.log("================================");
    }

    window.VoicesVisitorEngine = {
        visitors,
        startVisitors,
        visitorStatus,
        rebuildMovementGraph: buildMovementGraph
    };

    console.log("✓ Visitor Engine v4.1 Loaded");
})();