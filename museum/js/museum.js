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
                <button class="african-languages-experience-close" type="button" aria-label="Close African Languages Museum">×</button>

                <div class="african-languages-experience-eyebrow">AFRICAN LANGUAGES MUSEUM</div>
                <h2 id="africanLanguagesExperienceTitle">African Languages Museum</h2>

                <p class="african-languages-experience-intro">
                    Explore Africa's extraordinary linguistic diversity through language learning,
                    documentary records, cultural knowledge and living community voices.
                </p>

                <div class="african-languages-experience-list">

                    <a class="african-language-feature featured" href="academy/igede.html" aria-label="Open Igede Language Series">
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

        const close = overlay.querySelector(".african-languages-experience-close");

        function renderLivingNews(overlay){
        const feed = overlay.querySelector("#lm247LivingNewsFeed");
        const eyebrow = overlay.querySelector("#lm247TodayEyebrow");
        const data = window.LocalMedia247News;
        if(!feed || !data || !Array.isArray(data.stories)) return;

        if(eyebrow) eyebrow.textContent = data.updatedLabel || data.date || "TODAY";

        feed.innerHTML = data.stories.map((story, index) => `
            <article class="lm247-live-story ${story.featured ? "is-featured" : ""}" data-news-index="${index}">
                <div class="lm247-live-story-visual" aria-hidden="true"><span>${story.visual || "📰"}</span></div>
                <div class="lm247-live-story-body">
                    <span class="lm247-desk-kicker">${story.category} · ${story.location}</span>
                    <h4>${story.headline}</h4>
                    <p>${story.summary}</p>
                    <a href="${story.url}" target="_blank" rel="noopener noreferrer">SOURCE · ${story.source}</a>
                </div>
            </article>
        `).join("");
    }

    function setupNewsWall(){
        const wall = document.getElementById("lm247NewsWall");
        const data = window.LocalMedia247News;
        if(!wall || !data || !Array.isArray(data.stories) || !data.stories.length) return;
        if(wall.dataset.newsWallBound === "true") return;
        wall.dataset.newsWallBound = "true";

        const visual = wall.querySelector(".lm247-news-visual span");
        const category = wall.querySelector(".lm247-news-category");
        const headline = wall.querySelector(".lm247-news-headline");
        const source = wall.querySelector(".lm247-news-source");
        const date = wall.querySelector(".lm247-news-date");
        let index = 0;

        function showStory(story){
            wall.classList.remove("is-switching");
            void wall.offsetWidth;
            wall.classList.add("is-switching");
            if(visual) visual.textContent = story.visual || "📰";
            if(category) category.textContent = story.category || "NEWS";
            if(headline) headline.textContent = story.headline || "";
            if(source) source.textContent = story.source ? "SOURCE · " + story.source.toUpperCase() : "LOCALMEDIA247";
            if(date) date.textContent = "TODAY";
        }

        showStory(data.stories[index]);

        window.setInterval(function(){
            index = (index + 1) % data.stories.length;
            showStory(data.stories[index]);
        }, 5800);
    }

    function closeExperience(){
            overlay.classList.remove("open");
            document.body.classList.remove("african-languages-overlay-open");
            if(typeof returnToMuseumHomepage === "function") returnToMuseumHomepage();
        }

        close.addEventListener("click", closeExperience);

        overlay.addEventListener("click", function(event){
            if(event.target === overlay) closeExperience();
        });

        document.addEventListener("keydown", function(event){
            if(event.key === "Escape" && overlay.classList.contains("open")){
                closeExperience();
            }
        });

        overlay._open = function(){
            overlay.classList.add("open");
            document.body.classList.add("african-languages-overlay-open");
            setTimeout(() => close.focus(), 100);
        };
    }

    function bind(){

        const building = document.getElementById("africaMuseum");
        if(!building) return;

        createExperience();

        if(building.dataset.africanLanguagesExperienceBound === "true") return;
        building.dataset.africanLanguagesExperienceBound = "true";

        building.addEventListener("click", function(event){
            event.preventDefault();
            event.stopImmediatePropagation();

            const overlay = document.querySelector(".african-languages-experience-overlay");
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

    /* Defend against late DOM injections by other museum subsystems. */
    const singletonObserver = new MutationObserver(() => {
        const building = document.getElementById("lm247Building");
        if(building) enforceLocalMedia247Singleton(building);
    });
    singletonObserver.observe(document.body, {childList:true, subtree:true});

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
                <button class="lm247-experience-close" type="button" aria-label="Close LocalMedia247 information">×</button>

                <div class="lm247-experience-eyebrow">LOCALMEDIA247 MEDIA CENTER</div>
                <h2 id="lm247ExperienceTitle">Documenting Today. Preserving Tomorrow.</h2>

                <p class="lm247-experience-intro">
                    A living newsroom and digital storytelling centre for verified information,
                    research, content creation and digital communication.
                </p>

                <section class="lm247-daily-desk" aria-labelledby="lm247TodayTitle">
                    <div class="lm247-daily-desk-heading">
                        <div>
                            <span class="lm247-daily-desk-eyebrow" id="lm247TodayEyebrow">TODAY</span>
                            <h3 id="lm247TodayTitle">Today's LocalMedia247 Desk</h3>
                        </div>
                        <span class="lm247-daily-desk-status">LIVE TODAY</span>
                    </div>
                    <div id="lm247LivingNewsFeed" class="lm247-living-news-feed" aria-live="polite"></div>
                </section>

                <section class="lm247-afternoon" aria-labelledby="lm247AfternoonTitle">
                    <div class="lm247-daily-desk-heading">
                        <div>
                            <span class="lm247-daily-desk-eyebrow">AFTERNOON UPDATE · 2 OCTOBER 2026</span>
                            <h3 id="lm247AfternoonTitle">This Afternoon</h3>
                        </div>
                        <span class="lm247-daily-desk-status">AFTERNOON UPDATE</span>
                    </div>

                    <article class="lm247-desk-story">
                        <span class="lm247-desk-kicker">AFTERNOON UPDATE</span>
                        <div class="lm247-desk-headlines">
                            <div>
                                <strong>🇳🇬 Nigeria</strong>
                                <p>A public-service warning strike is scheduled for October 2–4, with developments being closely watched.</p>
                            </div>
                            <div>
                                <strong>🕋 Nigeria — Hajj</strong>
                                <p>Nigeria's allocation for the 2027 Hajj pilgrimage has risen to 60,000 places.</p>
                            </div>
                            <div>
                                <strong>🌍 Africa</strong>
                                <p>Fighting and tensions continue to draw attention in Ethiopia's Tigray region.</p>
                            </div>
                            <div>
                                <strong>🌾 World — Food</strong>
                                <p>The FAO Food Price Index stood at 136.0 in September, up 1.5% from the previous month and 5.8% from a year earlier.</p>
                            </div>
                        </div>
                    </article>
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
            if(typeof returnToMuseumHomepage === "function") returnToMuseumHomepage();
        }

        overlay._open = function(){
            overlay.classList.add("open");
            document.body.classList.add("lm247-overlay-open");
            setTimeout(() => close.focus(), 100);
        };
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

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", bind);
    }else{
        bind();
    }

    setTimeout(bind, 500);
    setTimeout(bind, 1500);

    /* Keep the LocalMedia247 architectural brand lockup strictly singular.
       Some late museum initialization can rebuild building children after
       the first bind, so enforce the final DOM shape here as well. */
    const brandObserver = new MutationObserver(() => {
        const building = document.getElementById("lm247Building");
        if(!building) return;

        const titles = building.querySelectorAll(".lm247Title");
        titles.forEach((node, index) => {
            if(index > 0) node.remove();
        });

        const title = building.querySelector(".lm247Title");
        if(!title) return;

        title.style.textTransform = "none";

        const textNodes = Array.from(title.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
        if(textNodes.length > 0 && textNodes[0].textContent !== "LocalMedia247"){
            textNodes[0].textContent = "LocalMedia247";
        }
        textNodes.slice(1).forEach(node => node.remove());

        let subtitle = title.querySelector("span");
        if(!subtitle){
            subtitle = document.createElement("span");
            subtitle = document.createElement("span");
            subtitle.textContent = "Documenting Today. Preserving Tomorrow.";
            title.appendChild(subtitle);
        }else if(subtitle.textContent !== "Documenting Today. Preserving Tomorrow."){
            subtitle.textContent = "Documenting Today. Preserving Tomorrow.";
        }
    });
    brandObserver.observe(document.body, {childList:true, subtree:true});

})();