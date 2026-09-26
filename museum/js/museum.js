const campus = document.getElementById("campus");

/*======================================
        LOAD ENVIRONMENT
======================================*/

loadTrees();
loadGardens();
loadTrees();
loadGardens();

/*======================================
        MUSEUM LIGHT ENGINE
======================================*/

const museum = document.getElementById("campus");

let museumTime = "day";

function setMuseumTime(time){

    museum.classList.remove(
        "morning",
        "day",
        "afternoon",
        "evening",
        "night"
    );

    museum.classList.add(time);
    museumTime = time;

    const root = document.documentElement;
    const sky = document.getElementById("skyOverlay");

    /*
       The museum now has a real visual day/night language.
       The centre stays readable while the surrounding campus
       becomes noticeably brighter in the day and deeper at night.
    */
    if(time === "morning"){
        root.style.setProperty("--sky-darkness",
            "linear-gradient(to bottom, rgba(255,244,214,.08), rgba(255,225,175,.03))");
        root.style.setProperty("--campus-tone", "brightness(1.03) saturate(1.04)");
    }
    else if(time === "day"){
        root.style.setProperty("--sky-darkness",
            "linear-gradient(to bottom, rgba(255,255,255,.025), rgba(255,255,255,0))");
        root.style.setProperty("--campus-tone", "brightness(1.06) saturate(1.08)");
    }
    else if(time === "afternoon"){
        root.style.setProperty("--sky-darkness",
            "linear-gradient(to bottom, rgba(255,230,170,.06), rgba(255,190,120,.035))");
        root.style.setProperty("--campus-tone", "brightness(1.03) saturate(1.05)");
    }
    else if(time === "evening"){
        root.style.setProperty("--sky-darkness",
            "radial-gradient(ellipse 58% 48% at 50% 52%, rgba(255,188,105,.08) 0%, rgba(95,55,45,.16) 58%, rgba(12,20,36,.42) 100%)");
        root.style.setProperty("--campus-tone", "brightness(.86) saturate(.94)");
    }
    else {
        root.style.setProperty("--sky-darkness",
            "radial-gradient(ellipse 46% 38% at 50% 55%, rgba(0,0,35,.05) 0%, rgba(0,0,35,.15) 44%, rgba(0,0,35,.38) 70%, rgba(0,0,35,.64) 100%)");
        root.style.setProperty("--campus-tone", "brightness(.72) saturate(.82)");
    }

    if(sky){
        sky.style.background = "var(--sky-darkness)";
    }

    updateDayNightControl();
}

function updateDayNightControl(){
    const button = document.getElementById("dayNightToggle");
    if(!button) return;

    const isNight = museumTime === "night";
    button.setAttribute("aria-pressed", String(isNight));
    button.classList.toggle("is-night", isNight);

    const labels = button.querySelectorAll(".timeLabel");
    if(labels.length >= 2){
        labels[0].classList.toggle("active", !isNight);
        labels[1].classList.toggle("active", isNight);
    }

    const hint = document.getElementById("timeHint");
    if(hint){
        hint.textContent = isNight
            ? "Night mode · click for daylight"
            : "Day mode · click for night";
    }
}

function toggleDayNight(){
    setMuseumTime(museumTime === "night" ? "day" : "night");
}

function flyTo(newX,newY,newScale=1){

    targetX = newX;

    targetY = newY;

    targetScale = newScale;

    flying = true;

}

setMuseumTime("day");

const dayNightToggle = document.getElementById("dayNightToggle");
if(dayNightToggle){
    dayNightToggle.addEventListener("click", toggleDayNight);
}

Life.start();

if (window.VoicesVisitorEngine && typeof window.VoicesVisitorEngine.startVisitors === "function") {
    window.VoicesVisitorEngine.startVisitors();
} else {
    console.warn("Visitor Engine: start function not available.");
}

/*======================================
   HALL OF HUMANITY — VISITOR EXPERIENCE
   Ensures the Hall click opens its exhibition
   after the camera focuses on the entrance.
======================================*/

(function setupHallExperience(){

    const hall = document.getElementById("hall-humanity");
    if(!hall) return;

    hall.addEventListener("click", function(){

        /* The full Hall Exhibition Engine creates the
           detailed overlay. Open it when available. */
        const exhibition = document.querySelector(".hall-exhibition-overlay");

        if(exhibition){
            exhibition.classList.add("open");
            exhibition.style.display = "block";
            document.body.classList.add("hall-overlay-open");

            const closeButton =
                exhibition.querySelector(".hall-exhibition-close");

            if(closeButton){
                setTimeout(() => closeButton.focus(), 120);
            }

            return;
        }

        /* Safe fallback: use the existing museum information panel
           if the full exhibition engine has not initialized. */
        const panel = document.getElementById("museumPanel");
        const header = document.getElementById("museumPanelHeader");
        const body = document.getElementById("museumPanelBody");
        const button = document.getElementById("enterMuseum");

        if(!panel || !header || !body) return;

        header.textContent = "🏛 Hall of Humanity";

        body.innerHTML =
            "<strong>The World of Voices</strong><br><br>" +
            "The Hall of Humanity is the global orientation centre of " +
            "Voices of Humanity — a place to encounter language as memory, " +
            "identity, knowledge and living heritage.<br><br>" +
            "Explore curated exhibits on the world's linguistic diversity, " +
            "oral traditions, language documentation, writing systems, " +
            "language transmission and the museum's growing documentary archive.";

        if(button){
            button.textContent = "EXPLORE THE HALL";
            button.onclick = function(event){
                event.preventDefault();

                const fullExhibition =
                    document.querySelector(".hall-exhibition-overlay");

                if(fullExhibition){
                    fullExhibition.classList.add("open");
                    fullExhibition.style.display = "block";
                    document.body.classList.add("hall-overlay-open");
                    panel.style.display = "none";
                }
            };
        }

        panel.style.display = "block";

    });

})();
