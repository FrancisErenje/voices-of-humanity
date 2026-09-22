/*
==========================================
Voices of Humanity Interactive Museum
Life Engine
Version 1.0
==========================================
*/

class LifeEngine {

    constructor(){

        this.running = false;

        this.wind = 1;

        this.time = 0;

    }

    start(){

        if(this.running) return;

        this.running = true;

        console.log("Life Engine Started");

        this.animate();

    }

    animate(){

        this.time += 0.01;

        document.documentElement.style.setProperty(

            "--wind",

            Math.sin(this.time) * this.wind

        );

        requestAnimationFrame(()=>this.animate());

    }

}

const Life = new LifeEngine();

Master.register("Life Engine");