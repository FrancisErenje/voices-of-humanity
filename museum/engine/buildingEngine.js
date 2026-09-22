class MuseumBuilding {

    constructor(data) {

        this.id = data.id;

        this.name = data.name;

        this.type = data.type;

        this.district = data.district;

        this.position=new Coordinate(

    data.x,

    data.y

);

        this.width = data.width;

        this.height = data.height;

        this.status = "active";

    }

}