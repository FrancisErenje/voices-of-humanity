/*======================================*
* VOICES OF HUMANITY
* ROAD GRAPH v3.0
*======================================*/

const RoadGraph = {

    /*==================================
      SOUTH
    ==================================*/

    visitorCentre: {
        id: "visitorCentre",
        name: "Visitor Centre",
        x: 1500,
        y: 2500,

        links: [
            "cinema"
        ]
    },


    /*==================================
      DOCUMENTARY DISTRICT
    ==================================*/

    cinema: {
        id: "cinema",
        name: "Documentary Cinema",
        x: 1500,
        y: 1850,

        links: [
            "visitorCentre",
            "hall",
            "americas",
            "oceania"
        ]
    },


    /*==================================
      CENTRAL HEART
    ==================================*/

    hall: {
        id: "hall",
        name: "Hall of Humanity",
        x: 1500,
        y: 1300,

        links: [
            "cinema",
            "africa",
            "europe",
            "asia",
            "square"
        ]
    },


    /*==================================
      WEST AFRICA
    ==================================*/

    africa: {
        id: "africa",
        name: "African Languages Museum",
        x: 1050,
        y: 1300,

        links: [
            "hall",
            "americas"
        ]
    },


    /*==================================
      AMERICAS
    ==================================*/

    americas: {
        id: "americas",
        name: "Americas Languages Museum",
        x: 1050,
        y: 1750,

        links: [
            "africa",
            "cinema"
        ]
    },


    /*==================================
      EUROPE
    ==================================*/

    europe: {
        id: "europe",
        name: "European Languages Museum",
        x: 1500,
        y: 950,

        links: [
            "hall",
            "asia"
        ]
    },


    /*==================================
      ASIA
    ==================================*/

    asia: {
        id: "asia",
        name: "Asian Languages Museum",

        /*
        Current visual position of Asia.
        The complex is at:

        left: 2150px
        top: 850px

        The museum itself sits 100px
        inside the complex.
        */

        x: 2250,
        y: 970,

        links: [
            "hall",
            "europe",
            "oceania"
        ]
    },


    /*==================================
      OCEANIA
    ==================================*/

    oceania: {
        id: "oceania",
        name: "Oceania Languages Museum",
        x: 2150,
        y: 1600,

        links: [
            "asia",
            "cinema"
        ]
    },


    /*==================================
      HERITAGE SQUARE
    ==================================*/

    square: {
        id: "square",
        name: "Heritage Square",
        x: 1500,
        y: 900,

        links: [
            "hall"
        ]
    }

};


console.log(
    "✓ Road Graph v3 Loaded:",
    Object.keys(RoadGraph).length,
    "locations"
);