/*
===========================================
Voices of Humanity
MASTER ENGINE
Version 1.0
===========================================
*/

class MasterEngine{

    constructor(){

        this.systems = [];

        console.log("================================");
        console.log(" Voices of Humanity Museum");
        console.log(" Master Engine Version 1.0");
        console.log("================================");

    }

    register(name){

        this.systems.push(name);

        console.log("✓", name, "registered");

    }

    start(){

        console.log("");

        console.log("Starting Museum...");

        console.log("");

        this.systems.forEach(system=>{

            console.log("Running:",system);

        });

        console.log("");

        console.log("Museum Ready.");

    }

}

const Master = new MasterEngine();