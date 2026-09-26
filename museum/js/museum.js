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
   Click the Hall to focus it and show the
   visitor information panel. The full
   exhibition opens from EXPLORE THE HALL.
======================================*/

(function setupHallExperience(){

    const hall = document.getElementById("hall-humanity");
    if(!hall) return;

    hall.addEventListener("click", function(){

        const panel = document.getElementById("museumPanel");
        const header = document.getElementById("museumPanelHeader");
        const body = document.getElementById("museumPanelBody");
        const button = document.getElementById("enterMuseum");

        if(!panel || !header || !body || !button) return;

        header.textContent = "🏛 Hall of Humanity";

        body.innerHTML =
            "<strong>The World of Voices</strong><br><br>" +
            "The Hall of Humanity is the global orientation centre of " +
            "Voices of Humanity — a place to encounter language as memory, " +
            "identity, knowledge and living heritage.<br><br>" +
            "Explore curated exhibits on the world's linguistic diversity, " +
            "oral traditions, language documentation, writing systems, " +
            "language transmission and the museum's growing documentary archive.";

        button.textContent = "EXPLORE THE HALL";
        panel.style.display = "block";
        button.focus();

    });

})();


/* Ensure the Hall information panel's Explore button opens the
   already-built Hall exhibition, regardless of initialization order. */
(function(){
    function bindHallExplore(){
        const button = document.getElementById("enterMuseum");
        if(!button || button.dataset.hallExploreBound === "true") return;

        button.dataset.hallExploreBound = "true";

        button.addEventListener("click", function(event){
            if(this.textContent.trim() !== "EXPLORE THE HALL") return;

            event.preventDefault();
            event.stopImmediatePropagation();

            if(typeof window.openHallHumanityExperience === "function"){
                window.openHallHumanityExperience(event);
            }else{
                const exhibition = document.querySelector(".hall-exhibition-overlay");
                if(exhibition){
                    exhibition.classList.add("open");
                    exhibition.style.display = "block";
                    document.body.classList.add("hall-overlay-open");

                    const panel = document.getElementById("museumPanel");
                    if(panel) panel.style.display = "none";

                    const closeButton = exhibition.querySelector(".hall-exhibition-close");
                    if(closeButton) setTimeout(() => closeButton.focus(), 120);
                }
            }
        }, true);
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bindHallExplore);
    }else{
        bindHallExplore();
    }

    setTimeout(bindHallExplore, 300);
    setTimeout(bindHallExplore, 1000);

    const hallPanelObserver = new MutationObserver(bindHallExplore);
    hallPanelObserver.observe(document.body, {childList:true, subtree:true});
})();


/*======================================
   BUILDING NAME VISIBILITY
   Building names are kept to their original
   architectural title elements to avoid
   duplicate labels across the campus.
======================================*/


/*======================================
   LOCALMEDIA247 — VISITOR EXPERIENCE
   Keep the service information inside the
   building experience rather than displaying
   the full information on the campus.
======================================*/

(function setupLocalMedia247Experience(){

    function createExperience(){

        if(document.querySelector(".lm247-experience-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "lm247-experience-overlay";
        overlay.innerHTML = `
            <div class="lm247-experience-card" role="dialog" aria-modal="true" aria-labelledby="lm247ExperienceTitle">
                <button class="lm247-experience-close" type="button" aria-label="Close LocalMedia247 information">×</button>

                <div class="lm247-experience-eyebrow">LOCALMEDIA247 MEDIA CENTER</div>
                <h2 id="lm247ExperienceTitle">Documenting Today. Preserving Tomorrow.</h2>

                <p class="lm247-experience-intro">
                    A media and digital storytelling centre built around verified information,
                    research, content production and digital communication.
                </p>

                <div class="lm247-experience-grid">
                    <div>
                        <span>MEDIA</span>
                        <strong>News &amp; Media</strong>
                        <p>Verified news publishing and media communication.</p>
                    </div>
                    <div>
                        <span>RESEARCH</span>
                        <strong>Research &amp; Fact-Checking</strong>
                        <p>Careful research, verification and information development.</p>
                    </div>
                    <div>
                        <span>CONTENT</span>
                        <strong>Content Creation</strong>
                        <p>Documentary, video, social media and editorial content.</p>
                    </div>
                    <div>
                        <span>WEB</span>
                        <strong>Digital &amp; Web Services</strong>
                        <p>Websites, portfolios and digital presentation for people and organisations.</p>
                    </div>
                </div>

                <div class="lm247-contact-box">
                    <div>
                        <small>CLIENT CONNECTION DESK</small>
                        <h3>Have a story, project or business need?</h3>
                        <p>Talk directly with LocalMedia247 on WhatsApp.</p>
                        <strong>+234 806 413 7756</strong>
                    </div>
                    <a class="lm247-whatsapp" href="https://wa.me/2348064137756?text=Hello%20LocalMedia247%2C%20I%20would%20like%20to%20make%20an%20enquiry%20about%20your%20media%20and%20digital%20services." target="_blank" rel="noopener noreferrer">
                        ☏&nbsp; CHAT ON WHATSAPP
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = overlay.querySelector(".lm247-experience-close");
        close.addEventListener("click", closeExperience);

        overlay.addEventListener("click", function(event){
            if(event.target === overlay) closeExperience();
        });

        document.addEventListener("keydown", function(event){
            if(event.key === "Escape" && overlay.classList.contains("open")){
                closeExperience();
            }
        });

        function closeExperience(){
            overlay.classList.remove("open");
            document.body.classList.remove("lm247-overlay-open");
        }

        overlay._open = function(){
            overlay.classList.add("open");
            document.body.classList.add("lm247-overlay-open");
            setTimeout(() => close.focus(), 100);
        };
    }

    function bind(){

        const building = document.getElementById("lm247Building");
        if(!building) return;

        createExperience();

        if(building.dataset.lm247ExperienceBound === "true") return;
        building.dataset.lm247ExperienceBound = "true";

        building.addEventListener("click", function(event){
            event.preventDefault();
            event.stopPropagation();

            const overlay = document.querySelector(".lm247-experience-overlay");
            if(overlay && typeof overlay._open === "function"){
                overlay._open();
            }
        }, true);
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bind);
    }else{
        bind();
    }

    setTimeout(bind, 500);
    setTimeout(bind, 1500);

})();
