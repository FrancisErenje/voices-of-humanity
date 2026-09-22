class MuseumEngine {

    constructor() {

        this.version = "1.0";

        console.log("================================");
        console.log(" Voices of Humanity Museum");
        console.log(" Museum Engine Version " + this.version);
        console.log("================================");

    }

    start() {

        console.log("ROOT ENGINE LOADED");

        console.log("Registry:", Registry);

        console.log("World:", World);

console.log(
    "District Count:",
    World.districts.length
);

        console.log(
    "Hall Building:",
    Registry.getBuilding("hall-humanity")
);

    }

}

Master.register("Museum Engine");

const Engine = new MuseumEngine();

Engine.start();