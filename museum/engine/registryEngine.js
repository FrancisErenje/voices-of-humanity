/*
===========================================
Voices of Humanity Interactive Museum
Global Registry
Version 2.0
===========================================
*/

class MuseumRegistry {

    constructor() {

        this.buildings = new Map();
        this.districts = new Map();
        this.trees = new Map();
        this.roads = new Map();
        this.gardens = new Map();

        this.languages = new Map();
        this.collections = new Map();

        this.visitors = new Map();

    }

    /* ==========================
       ADD METHODS
    ========================== */

    addBuilding(building) {
        this.buildings.set(building.id, building);
    }

    addDistrict(district) {
        this.districts.set(district.id, district);
    }

    addTree(tree) {
        this.trees.set(tree.id, tree);
    }

    addRoad(road) {
        this.roads.set(road.id, road);
    }

    addGarden(garden) {
        this.gardens.set(garden.id, garden);
    }

    addLanguage(language) {
        this.languages.set(language.id, language);
    }

    addCollection(collection) {
        this.collections.set(collection.id, collection);
    }

    addVisitor(visitor) {
        this.visitors.set(visitor.id, visitor);
    }

    /* ==========================
       GET METHODS
    ========================== */

    getBuilding(id) {
        return this.buildings.get(id);
    }

    getDistrict(id) {
        return this.districts.get(id);
    }

    getTree(id) {
        return this.trees.get(id);
    }

    getRoad(id) {
        return this.roads.get(id);
    }

    getGarden(id) {
        return this.gardens.get(id);
    }

    getLanguage(id) {
        return this.languages.get(id);
    }

    getCollection(id) {
        return this.collections.get(id);
    }

    getVisitor(id) {
        return this.visitors.get(id);
    }

    /* ==========================
       LIST METHODS
    ========================== */

    getBuildings() {
        return [...this.buildings.values()];
    }

    getDistricts() {
        return [...this.districts.values()];
    }

    getTrees() {
        return [...this.trees.values()];
    }

    getRoads() {
        return [...this.roads.values()];
    }

    getGardens() {
        return [...this.gardens.values()];
    }

    getLanguages() {
        return [...this.languages.values()];
    }

    getCollections() {
        return [...this.collections.values()];
    }

    getVisitors() {
        return [...this.visitors.values()];
    }

}

const Registry = new MuseumRegistry();

console.log("Museum Registry Initialised");

Master.register("Registry Engine");