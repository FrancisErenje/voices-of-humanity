const campus = document.getElementById("campus");

/*======================================
        LOAD ENVIRONMENT
======================================*/

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
   HALL OF HUMANITY — DIRECT EXHIBITION
   The Hall engine owns the opening action.
   No camera zoom and no intermediate panel.
======================================*/

/* Kept intentionally minimal here. The dedicated
   Hall Humanity Engine binds directly to the building
   after its exhibition has been rendered. */

/*======================================
   BUILDING NAME VISIBILITY
   Building names are kept to their original
   architectural title elements to avoid
   duplicate labels across the campus.
======================================*/



/*======================================
   AFRICAN LANGUAGES MUSEUM — VISITOR EXPERIENCE
   The museum stays clean from a distance.
   Its curated content appears when the
   building is opened, with the Igede Language
   Learning Centre as the first featured item.
======================================*/

(function setupAfricanLanguagesExperience(){

    function createExperience(){

        if(document.querySelector(".african-languages-experience-overlay")) return;

        const overlay = document.createElement("div");
        overlay.className = "african-languages-experience-overlay";

        overlay.innerHTML = `
            <div class="african-languages-experience-card" role="dialog" aria-modal="true" aria-labelledby="africanLanguagesExperienceTitle">
                <button class="african-languages-close-hit-zone" type="button" aria-label="Close African Languages Museum">×</button>

                <div class="african-languages-experience-eyebrow">AFRICAN LANGUAGES MUSEUM</div>
                <h2 id="africanLanguagesExperienceTitle">African Languages Museum</h2>

                <p class="african-languages-experience-intro">
                    Explore Africa's extraordinary linguistic diversity through language learning,
                    documentary records, cultural knowledge and living community voices.
                </p>

                <div class="african-languages-experience-list">

                    <a class="african-language-feature featured" href="/museum/academy/igede.html" aria-label="Open Igede Language Series" data-igede-centre-link="true">
                        <span class="feature-number">01</span>
                        <span class="feature-content">
                                                        <strong>Igede Language Series</strong>
                            <span>The first language series of Voices of Humanity — a living record of Igede language, pronunciation, everyday expressions and learning.</span>
                            <small>Igede Language Learning Centre · 22 lessons · Launched 26 May 2026</small>
                        </span>
                        <span class="feature-action">ENTER CENTRE →</span>
                    </a>

                    <div class="african-language-feature">
                        <span class="feature-number">02</span>
                        <span class="feature-content">
                            <span class="feature-kicker">LANGUAGES OF AFRICA</span>
                            <strong>Explore African Language Voices</strong>
                            <span>Discover the museum's growing collection of African languages, documentaries and cultural records.</span>
                        </span>
                    </div>

                    <div class="african-language-feature">
                        <span class="feature-number">03</span>
                        <span class="feature-content">
                            <span class="feature-kicker">DOCUMENTARY ARCHIVE</span>
                            <strong>Language, Culture &amp; Memory</strong>
                            <span>Encounter stories that connect language with identity, history, community and living heritage.</span>
                        </span>
                    </div>

                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = overlay.querySelector(".african-languages-close-hit-zone");
        function closeExperience(event){
            if(event){
                event.preventDefault();
                event.stopImmediatePropagation();
            }
            overlay.classList.remove("open");
            overlay.hidden = true;
            overlay.setAttribute("aria-hidden","true");
            overlay.style.display = "none";
            overlay.style.visibility = "hidden";
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "-1";
            document.body.classList.remove("african-languages-overlay-open");
        }

        close.addEventListener("click", closeExperience, true);
        close.addEventListener("pointerup", closeExperience, true);
        close.addEventListener("touchend", closeExperience, true);

        overlay.addEventListener("click", function(event){
            if(event.target === overlay) closeExperience(event);
        }, true);

        document.addEventListener("keydown", function(event){
            if(event.key === "Escape" && overlay.classList.contains("open")){
                closeExperience();
            }
        });

        overlay._open = function(){
            overlay.hidden = false;
            overlay.removeAttribute("aria-hidden");
            overlay.style.display = "";
            overlay.style.visibility = "";
            overlay.style.opacity = "";
            overlay.style.pointerEvents = "";
            overlay.style.zIndex = "";
            overlay.classList.add("open");
            document.body.classList.add("african-languages-overlay-open");
            setTimeout(() => close.focus(), 100);
        };
    }

    function bind(){
        /*
           The African Languages Museum has one authoritative click owner:
           the full-building hit surface created by the continental building
           interaction engine below. Keeping a second building-level capture
           handler here caused competing click interception.
        */
        createExperience();
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bind);
    }else{
        bind();
    }

    setTimeout(bind, 500);
    setTimeout(bind, 1500);

})();


/*======================================
   CONTINENTAL BUILDING HIT SURFACES
   Africa + Americas — one authoritative
   full-building interaction surface.
======================================*/
(function setupContinentalBuildingHitSurfaces(){

    function bindWholeBuilding(id, openFunction){
        const building = document.getElementById(id);
        if(!building) return;

        building.style.pointerEvents = "auto";
        building.style.cursor = "pointer";
        building.setAttribute("tabindex","0");
        building.setAttribute("role","button");

        /* Disable pointer events on decorative children so the
           single surface below receives clicks anywhere on the
           visible building. */
        Array.from(building.children).forEach(function(child){
            if(!child.classList.contains("full-building-hit-surface")){
                child.style.pointerEvents = "none";
            }
        });

        let hit = building.querySelector(":scope > .full-building-hit-surface");
        if(!hit){
            hit = document.createElement("button");
            hit.type = "button";
            hit.className = "full-building-hit-surface";
            hit.setAttribute("aria-label",
                building.getAttribute("aria-label") || "Open museum");
            building.appendChild(hit);
        }

        hit.style.pointerEvents = "auto";
        hit.style.cursor = "pointer";
        hit.style.touchAction = "manipulation";
        hit.style.zIndex = "2147483647";

        if(hit.dataset.continentalBound !== "true"){
            hit.dataset.continentalBound = "true";

            function activate(event){
                if(event){
                    event.preventDefault();
                    event.stopPropagation();
                    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
                }
                openFunction();
            }

            hit.addEventListener("click", activate, true);
            hit.addEventListener("pointerup", function(event){
                if(event.pointerType !== "mouse") activate(event);
            }, true);
            hit.addEventListener("touchend", activate, true);
            hit.addEventListener("keydown", function(event){
                if(event.key === "Enter" || event.key === " "){
                    activate(event);
                }
            }, true);
        }
    }

    function setupAmericas(){
        const building = document.getElementById("americasMuseum");
        if(!building) return;

        let overlay = document.querySelector(
            '.voh-continental-direct[data-building="americasMuseum"]'
        );

        if(!overlay){
            overlay = document.createElement("div");
            overlay.className = "voh-continental-direct";
            overlay.dataset.building = "americasMuseum";
            overlay.hidden = true;
            overlay.setAttribute("aria-hidden","true");

            overlay.innerHTML =
                '<div class="voh-continental-direct-card" role="dialog" aria-modal="true" aria-labelledby="americasMuseumTitle">' +
                    '<button type="button" class="voh-continental-direct-close" aria-label="Close Americas Languages Museum">×</button>' +
                    '<div class="voh-continental-direct-kicker">VOICES OF HUMANITY · LIVING LANGUAGE ARCHIVE</div>' +
                    '<h2 id="americasMuseumTitle">Americas Languages Museum</h2>' +
                    '<p>Explore the extraordinary linguistic diversity of North, Central and South America and the Indigenous communities whose languages carry living histories, knowledge and identity.</p>' +
                    '<div class="voh-continental-direct-grid">' +
                        '<article><span>LANGUAGES</span><strong>Living Voices</strong><p>Discover languages and the communities that keep them alive.</p></article>' +
                        '<article><span>CULTURE</span><strong>Language &amp; Identity</strong><p>Explore language as a carrier of memory, identity and knowledge.</p></article>' +
                        '<article><span>HERITAGE</span><strong>Stories That Endure</strong><p>Encounter linguistic histories preserved through living voices.</p></article>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(overlay);

            const close = overlay.querySelector(".voh-continental-direct-close");

            function closeOverlay(event){
                if(event){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                overlay.classList.remove("open");
                overlay.hidden = true;
                overlay.setAttribute("aria-hidden","true");
                overlay.style.display = "none";
                overlay.style.visibility = "hidden";
                overlay.style.opacity = "0";
                overlay.style.pointerEvents = "none";
                overlay.style.zIndex = "-1";
                if(typeof window.returnToMuseumHomepage === "function"){
                    window.returnToMuseumHomepage();
                }
            }

            close.addEventListener("click", closeOverlay, true);
            close.addEventListener("pointerup", closeOverlay, true);
            close.addEventListener("touchend", closeOverlay, true);

            overlay.addEventListener("click", function(event){
                if(event.target === overlay) closeOverlay(event);
            }, true);

            document.addEventListener("keydown", function(event){
                if(event.key === "Escape" && overlay.classList.contains("open")){
                    closeOverlay(event);
                }
            }, true);

            overlay._open = function(){
                overlay.hidden = false;
                overlay.setAttribute("aria-hidden","false");
                overlay.style.display = "flex";
                overlay.style.visibility = "visible";
                overlay.style.opacity = "1";
                overlay.style.pointerEvents = "auto";
                overlay.style.zIndex = "2147483647";
                overlay.classList.add("open");
                setTimeout(function(){
                    if(close) close.focus();
                },80);
            };
        }

        bindWholeBuilding("americasMuseum", function(){
            if(typeof overlay._open === "function") overlay._open();
        });

        /* Final direct owner for the Americas Museum itself.
           This deliberately avoids relying on the transparent child hit
           surface, which can be covered by other campus layers. */
        if(building.dataset.americasDirectBound !== "true"){
            building.dataset.americasDirectBound = "true";
            const openAmericas = function(event){
                if(event){
                    event.preventDefault();
                    event.stopPropagation();
                    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
                }
                if(typeof overlay._open === "function") overlay._open();
            };
            building.addEventListener("click", openAmericas, true);
            building.addEventListener("pointerup", function(event){
                if(event.pointerType !== "mouse") openAmericas(event);
            }, true);
            building.addEventListener("touchend", openAmericas, true);
        }
    }

    function setupAfrica(){
        const building = document.getElementById("africaMuseum");
        if(!building) return;

        const overlay = document.querySelector(
            ".african-languages-experience-overlay"
        );

        bindWholeBuilding("africaMuseum", function(){
            if(overlay && typeof overlay._open === "function"){
                overlay._open();
            }
        });
    }

    function init(){
        setupAfrica();
        setupAmericas();
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", init, {once:true});
    }else{
        init();
    }

    setTimeout(init,500);
    setTimeout(init,1500);

})();



/*======================================
   LOCALMEDIA247 — VISITOR EXPERIENCE
   One clean visitor page: today first,
   yesterday next, dated archive links,
   then the service/contact desk.
======================================*/

(function setupLocalMedia247Experience(){

    function createExperience(){

        /* Hard singleton: the LocalMedia247 studio must have exactly one
           visitor overlay, even if this script is initialised more than once
           or an older page state has left a duplicate in the DOM. */
        const existingOverlays = document.querySelectorAll(".lm247-experience-overlay");
        if(existingOverlays.length){
            existingOverlays.forEach((node, index) => {
                if(index > 0) node.remove();
            });
            return document.querySelector(".lm247-experience-overlay");
        }

        const overlay = document.createElement("div");
        overlay.className = "lm247-experience-overlay";
        overlay.innerHTML = `
            <div class="lm247-experience-card" role="dialog" aria-modal="true" aria-labelledby="lm247ExperienceTitle">
                <button class="lm247-close-hit-zone" type="button" aria-label="Close LocalMedia247 information">×</button>

                <div class="lm247-experience-eyebrow">LOCALMEDIA247 MEDIA CENTER</div>
                <h2 id="lm247ExperienceTitle">Documenting Today. Preserving Tomorrow.</h2>

                <p class="lm247-experience-intro">
                    A living newsroom and digital storytelling centre for verified information,
                    research, content creation and digital communication.
                </p>

                <section class="lm247-daily-desk" aria-labelledby="lm247TodayTitle">
                    <div class="lm247-daily-desk-heading">
                        <div>
                            <span class="lm247-daily-desk-eyebrow" id="lm247TodayEyebrow">LIVE NEWS · 6 OCTOBER 2026</span>
                            <h3 id="lm247TodayTitle">Live LocalMedia247 News Desk</h3>
                        </div>
                        <span class="lm247-daily-desk-status">LIVE · ANYTIME</span>
                    </div>
                    <div id="lm247LivingNewsFeed" class="lm247-living-news-feed" aria-live="polite"></div>
                </section>

                <section class="lm247-yesterday" aria-labelledby="lm247YesterdayTitle">
                    <div class="lm247-daily-desk-heading">
                        <div>
                            <span class="lm247-daily-desk-eyebrow">YESTERDAY · 30 SEPTEMBER 2026</span>
                            <h3 id="lm247YesterdayTitle">Yesterday's Desk</h3>
                        </div>
                    </div>

                    <article class="lm247-desk-story lm247-desk-reflection">
                        <span class="lm247-desk-kicker">DAILY REFLECTION 062</span>
                        <h4>EVERY LANGUAGE CARRIES A WORLD WITHIN IT</h4>
                        <p>When we make room for another language, we make room for another way of seeing the world.</p>
                        <a href="https://www.un.org/en/observances/international-translation-day" target="_blank" rel="noopener noreferrer">SOURCE · UNITED NATIONS</a>
                    </article>

                    <article class="lm247-desk-story">
                        <span class="lm247-desk-kicker">DAILY BRIEF · 30 SEPTEMBER 2026</span>
                        <div class="lm247-desk-headlines">
                            <div>
                                <strong>🇳🇬 Nigeria</strong>
                                <p>Public health advocates called for an evidence-based tobacco harm-reduction policy alongside existing tobacco-control measures.</p>
                                <a href="https://punchng.com/nigeria-urged-to-develop-evidence-based-tobacco-harm-reduction-policy/" target="_blank" rel="noopener noreferrer">SOURCE · PUNCH</a>
                            </div>
                            <div>
                                <strong>🌍 Africa</strong>
                                <p>Aliko Dangote and Kenyan President William Ruto launched construction of a proposed $16 billion refinery project in Kenya.</p>
                                <a href="https://www.reuters.com/world/africa/dangote-launches-16-bln-east-africa-refinery-project-kenya-2026-09-30/" target="_blank" rel="noopener noreferrer">SOURCE · REUTERS</a>
                            </div>
                            <div>
                                <strong>🌎 World</strong>
                                <p>Inflation concerns, borrowing costs and geopolitical tensions kept major government bond markets under pressure.</p>
                                <a href="https://www.reuters.com/markets/global-markets-bond-markets-face-difficult-september-2026-09-30/" target="_blank" rel="noopener noreferrer">SOURCE · REUTERS</a>
                            </div>
                        </div>
                    </article>
                </section>

                <section class="lm247-archive" aria-labelledby="lm247ArchiveTitle">
                    <div class="lm247-archive-heading">
                        <span class="lm247-daily-desk-eyebrow">ARCHIVE</span>
                        <h3 id="lm247ArchiveTitle">Previous Desk Records</h3>
                        <p>Older daily reflections, briefs and newsroom records are kept by date so the current desk remains clean.</p>
                    </div>
                    <div class="lm247-archive-links">
                        <a href="https://www.facebook.com/_voicesofhumanity" target="_blank" rel="noopener noreferrer">30 SEP 2026 · Reflection 062 &amp; Daily Brief →</a>
                        <a href="https://www.facebook.com/_voicesofhumanity" target="_blank" rel="noopener noreferrer">29 SEP 2026 · Previous Daily Records →</a>
                        <a href="https://www.facebook.com/_voicesofhumanity" target="_blank" rel="noopener noreferrer">EARLIER DATES · Explore the archive →</a>
                    </div>
                </section>

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

        /* The physical LocalMedia247 building panel is driven by the same
           live newsroom record used by the News Wall. Keep one source of
           truth so the building cannot fall behind the screen. */
        renderLivingNews(overlay);

        const close = overlay.querySelector(".lm247-close-hit-zone");

        /* Capture the close action at the overlay itself so camera/world
           handlers cannot swallow it. */
        if(close){
            /*
             * LOCALMEDIA247 CLOSE SHIELD
             * The museum has several window-level pointer handlers. A
             * pointerdown on the close button must therefore be consumed
             * without closing yet; otherwise the building underneath can
             * receive the same gesture and immediately reopen the studio.
             * The completed click then performs the actual close.
             */
            function shieldClosePointer(event){
                event.preventDefault();
                event.stopPropagation();
                if(typeof event.stopImmediatePropagation === "function"){
                    event.stopImmediatePropagation();
                }
            }

            close.addEventListener("pointerdown", shieldClosePointer, true);
            close.addEventListener("mousedown", shieldClosePointer, true);
            close.addEventListener("touchstart", shieldClosePointer, true);
            close.addEventListener("click", closeExperience, true);
            close.addEventListener("touchend", function(event){
                /* Touch devices do not always synthesize a reliable click
                   after several delegated museum handlers have consumed the
                   gesture, so close explicitly on touchend. */
                event.preventDefault();
                event.stopPropagation();
                if(typeof event.stopImmediatePropagation === "function"){
                    event.stopImmediatePropagation();
                }
                closeExperience(event);
            }, true);
        }

        overlay.addEventListener("click", function(event){
            if(event.target === overlay) closeExperience(event);
        }, true);

        document.addEventListener("keydown", function(event){
            if(event.key === "Escape" && overlay.classList.contains("open")){
                closeExperience();
            }
        });

        function closeExperience(event){
            if(event){
                event.preventDefault();
                event.stopImmediatePropagation();
            }

            /* Hard-close the LocalMedia247 visitor panel before handing
               control back to the museum homepage. This deliberately does
               not depend on the global museum close layer. */
            overlay.classList.remove("open");
            overlay.hidden = true;
            overlay.setAttribute("aria-hidden","true");
            overlay.style.display = "none";
            overlay.style.visibility = "hidden";
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "-1";
            document.body.classList.remove("lm247-overlay-open");

            /* Do not return through the global museum navigation here.
   The LocalMedia247 studio is a modal layer; closing it must simply
   return the visitor to the already-visible museum canvas. */
        }

        overlay._open = function(){
            overlay.hidden = false;
            overlay.setAttribute("aria-hidden","false");
            overlay.style.display = "flex";
            overlay.style.visibility = "visible";
            overlay.style.opacity = "1";
            overlay.style.pointerEvents = "auto";
            overlay.style.zIndex = "2147483646";
            overlay.classList.add("open");
            document.body.classList.add("lm247-overlay-open");
            setTimeout(() => close.focus(), 100);
        };

        /* FINAL CLOSE GUARD
           Window capture runs before the museum's document-level handlers.
           This makes the close control authoritative even when another
           museum interaction layer tries to consume the same click/tap. */
        function hardCloseFromUserGesture(event){
            if(!overlay.classList.contains("open")) return;

            const path = typeof event.composedPath === "function" ? event.composedPath() : [];
            const button = path.find(node =>
                node && node.classList && (
                    node.classList.contains("lm247-experience-close") ||
                    node.classList.contains("lm247-close-hit-zone")
                )
            ) || (event.target && event.target.closest
                ? event.target.closest(".lm247-experience-close, .lm247-close-hit-zone")
                : null);

            /* Coordinate fallback: close anywhere in the intended top-right
               hit area even if another museum layer becomes the event target.
               This fixes the case where the cursor only becomes a hand near
               the upper edge of the visible close control. */
            if(!button){
                const card = overlay.querySelector(".lm247-experience-card");
                if(!card) return;
                const rect = card.getBoundingClientRect();
                const x = event.clientX;
                const y = event.clientY;
                const inCloseArea =
                    x >= rect.right - 92 &&
                    x <= rect.right - 4 &&
                    y >= rect.top + 4 &&
                    y <= rect.top + 92;
                if(!inCloseArea) return;
            }

            event.preventDefault();
            event.stopPropagation();
            if(typeof event.stopImmediatePropagation === "function"){
                event.stopImmediatePropagation();
            }

            /* Close synchronously and leave the camera/world untouched. */
            overlay.classList.remove("open");
            overlay.hidden = true;
            overlay.setAttribute("aria-hidden","true");
            overlay.style.display = "none";
            overlay.style.visibility = "hidden";
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "-1";
            document.body.classList.remove("lm247-overlay-open");
        }

        /* Capture the gesture before any museum/world interaction layer.
           All three paths are covered for mouse, pointer and touch input. */
        window.addEventListener("pointerdown", hardCloseFromUserGesture, true);
        window.addEventListener("mousedown", hardCloseFromUserGesture, true);
        window.addEventListener("touchstart", hardCloseFromUserGesture, true);
        window.addEventListener("click", hardCloseFromUserGesture, true);
        window.addEventListener("pointerup", hardCloseFromUserGesture, true);
        window.addEventListener("touchend", hardCloseFromUserGesture, true);
    }

    function enforceLocalMedia247Singleton(building){
        /* The studio has one architectural title and one visitor panel only. */
        const titles = building.querySelectorAll(".lm247Title");
        titles.forEach((node, index) => { if(index > 0) node.remove(); });

        const panels = document.querySelectorAll(".lm247-experience-overlay");
        panels.forEach((node, index) => { if(index > 0) node.remove(); });
    }

    function bind(){
        const building = document.getElementById("lm247Building");
        if(!building) return;

        enforceLocalMedia247Singleton(building);

        const overlay = createExperience();

        if(building.dataset.lm247ExperienceBound === "true") return;
        building.dataset.lm247ExperienceBound = "true";

        building.addEventListener("click", function(event){
            event.preventDefault();
            event.stopImmediatePropagation();

            /* LocalMedia247 owns this building. Close any generic museum
               collection panel before opening the dedicated studio. */
            const genericPanel = document.getElementById("museum-video-panel");
            if(genericPanel) genericPanel.remove();

            enforceLocalMedia247Singleton(building);

            /* Remove any duplicate studio panels before opening. */
            const overlays = document.querySelectorAll(".lm247-experience-overlay");
            overlays.forEach((node, index) => {
                if(index > 0) node.remove();
            });
            const overlay = document.querySelector(".lm247-experience-overlay");
            if(overlay && typeof overlay._open === "function"){
                overlay._open();
            }
        }, true);
    }

    /* The LocalMedia247 building uses its native DOM action plus a
       screen-space fallback so decorative/camera layers cannot swallow it. */
    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bind);
    }else{
        bind();
    }
    setTimeout(bind, 500);
    setTimeout(bind, 1500);

/* FINAL LM247 HIT TEST */
(function(){
    window.addEventListener("pointerdown", function(event){
        const building = document.getElementById("lm247Building");
        const overlay = document.querySelector(".lm247-experience-overlay");
        if(!building || !overlay || typeof overlay._open !== "function") return;
        if(overlay.classList.contains("open")) return;
        if(event.button !== undefined && event.button !== 0) return;

        const newsWall = document.getElementById("lm247NewsWall");
        if(newsWall && newsWall.contains(event.target)) return;

        const rect = building.getBoundingClientRect();
        if(event.clientX < rect.left || event.clientX > rect.right ||
           event.clientY < rect.top || event.clientY > rect.bottom) return;

        event.preventDefault();
        if(typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
        else event.stopPropagation();

        const generic = document.getElementById("museum-video-panel");
        if(generic) generic.remove();
        overlay._open();
    }, true);
})();
