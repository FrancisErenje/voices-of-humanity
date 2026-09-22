/*
===========================================
Voices of Humanity Museum
Initializer
===========================================
*/

class MuseumInitializer {

    static loadBuildings() {

        Buildings.forEach(building => {

            Registry.addBuilding(building);

        });

        console.log(
            "Buildings Loaded:",
            Registry.getBuildings().length
        );

    }

    static loadDistricts() {

        Districts.forEach(district => {

            Registry.addDistrict(district);

        });

        console.log(
            "Districts Loaded:",
            Registry.getDistricts().length
        );

    }

    static loadLanguages() {

        Languages.forEach(language => {

            Registry.addLanguage(language);

        });

        console.log(
            "Languages Loaded:",
            Registry.getLanguages().length
        );

    }

    static initialise() {

        console.log("Initialising Museum...");

        this.loadBuildings();

        this.loadDistricts();

        this.loadLanguages();

        console.log("Museum Ready.");

    }

}