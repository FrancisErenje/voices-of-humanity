class MuseumWorld {

    constructor() {

        this.name = "Voices of Humanity";

        this.version = "1.1";

        this.districts = [];

    }

    addDistrict(district) {

        this.districts.push(district);

    }

}

const World = new MuseumWorld();