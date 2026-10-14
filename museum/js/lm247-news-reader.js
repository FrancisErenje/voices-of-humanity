/* =========================================================
   LOCALMEDIA247 NEWS WALL — FOCUS & STORY READER
   Tap/click the architectural news screen to read the
   currently displayed story without zooming the museum.
========================================================= */

(function setupLM247NewsReader(){
    function init(){
        const wall = document.getElementById("lm247NewsWall");
        const data = window.LocalMedia247News;

        if(!wall || !data || !Array.isArray(data.stories) || !data.stories.length) return;
        if(wall.dataset.newsReaderBound === "true") return;
        wall.dataset.newsReaderBound = "true";

        wall.setAttribute("role","button");
        wall.setAttribute("tabindex","0");
        wall.setAttribute("aria-label","Open LocalMedia247 news story");
        wall.title = "Tap to read this news story";

        const reader = document.createElement("div");
        reader.className = "lm247-news-reader";
        reader.setAttribute("aria-hidden","true");
        reader.innerHTML = `
            <div class="lm247-news-reader-backdrop" data-news-reader-close></div>
            <section class="lm247-news-reader-card" role="dialog" aria-modal="true"
                     aria-labelledby="lm247ReaderTitle" aria-describedby="lm247ReaderSummary">
                <button class="lm247-news-reader-close" type="button"
                        aria-label="Close news story" data-news-reader-close>×</button>

                <div class="lm247-news-reader-brand">
                    <span><i></i> LOCALMEDIA247</span>
                    <small>LIVE NEWS WALL</small>
                </div>

                <div class="lm247-news-reader-visual" aria-hidden="true">
                    <img id="lm247ReaderImage" alt="" hidden>
                    <span id="lm247ReaderVisual">📰</span>
                </div>
                <small id="lm247ReaderImageCredit" class="lm247-news-reader-image-credit"></small>

                <div class="lm247-news-reader-meta">
                    <span id="lm247ReaderCategory">NEWS</span>
                    <span id="lm247ReaderLocation">WORLD</span>
                </div>

                <h2 id="lm247ReaderTitle">News story</h2>
                <p id="lm247ReaderSummary"></p>

                <div class="lm247-news-reader-footer">
                    <span id="lm247ReaderSource">SOURCE</span>
                    <span id="lm247ReaderDate"></span>
                </div>

                <div class="lm247-news-reader-actions">
                    <button type="button" id="lm247ReaderPrev" aria-label="Previous news story">← Previous</button>
                    <button type="button" id="lm247ReaderNext" aria-label="Next news story">Next →</button>
                </div>

                <a id="lm247ReaderSourceLink" class="lm247-news-reader-source-link"
                   href="#" target="_blank" rel="noopener noreferrer">Read source report ↗</a>
            </section>
        `;

        document.body.appendChild(reader);

        const card = reader.querySelector(".lm247-news-reader-card");
        const closeButton = reader.querySelector(".lm247-news-reader-close");
        const visual = reader.querySelector("#lm247ReaderVisual");
        const visualImage = reader.querySelector("#lm247ReaderImage");
        const imageCredit = reader.querySelector("#lm247ReaderImageCredit");
        const category = reader.querySelector("#lm247ReaderCategory");
        const location = reader.querySelector("#lm247ReaderLocation");
        const title = reader.querySelector("#lm247ReaderTitle");
        const summary = reader.querySelector("#lm247ReaderSummary");
        const source = reader.querySelector("#lm247ReaderSource");
        const date = reader.querySelector("#lm247ReaderDate");
        const sourceLink = reader.querySelector("#lm247ReaderSourceLink");
        const prev = reader.querySelector("#lm247ReaderPrev");
        const next = reader.querySelector("#lm247ReaderNext");

        let currentIndex = 0;
        let lastFocused = null;
        let wallIndex = 0;

        const wallDate = wall.querySelector(".lm247-news-date");
        const wallVisual = wall.querySelector(".lm247-news-visual");
        const wallFallback = wallVisual ? wallVisual.querySelector("span") : null;
        const wallCategory = wall.querySelector(".lm247-news-category");
        const wallHeadline = wall.querySelector(".lm247-news-headline");
        const wallSource = wall.querySelector(".lm247-news-source");
        let wallImage = wallVisual ? wallVisual.querySelector("img") : null;
        if(wallVisual && !wallImage){
            wallImage = document.createElement("img");
            wallImage.alt = "";
            wallImage.hidden = true;
            wallImage.setAttribute("aria-hidden","true");
            wallVisual.insertBefore(wallImage, wallFallback || null);
        }

        function renderWall(index){
            wallIndex = (index + data.stories.length) % data.stories.length;
            const story = data.stories[wallIndex];
            if(wallDate){
                const dateMatch = (data.date || "").match(/^([A-Z]+), ([A-Z]+) (\\d{1,2}), (\\d{4})$/);
                const days = {MONDAY:"MON", TUESDAY:"TUE", WEDNESDAY:"WED", THURSDAY:"THU", FRIDAY:"FRI", SATURDAY:"SAT", SUNDAY:"SUN"};
                const months = {JANUARY:"JAN", FEBRUARY:"FEB", MARCH:"MAR", APRIL:"APR", MAY:"MAY", JUNE:"JUN", JULY:"JUL", AUGUST:"AUG", SEPTEMBER:"SEP", OCTOBER:"OCT", NOVEMBER:"NOV", DECEMBER:"DEC"};
                wallDate.textContent = dateMatch
                    ? (days[dateMatch[1]] || dateMatch[1]) + " " + dateMatch[3] + " " + (months[dateMatch[2]] || dateMatch[2]) + " " + dateMatch[4]
                    : (data.date || "TODAY");
            }
            if(wallCategory) wallCategory.textContent = story.category || "NEWS";
            if(wallHeadline) wallHeadline.textContent = story.headline || "LocalMedia247 News";
            if(wallSource) wallSource.textContent = story.source ? "SOURCE · " + story.source.toUpperCase() : "LOCALMEDIA247";
            if(wallImage && story.imageUrl){
                wallImage.src = story.imageUrl;
                wallImage.alt = story.imageAlt || "";
                wallImage.hidden = false;
                wallImage.style.display = "block";
                if(wallFallback) wallFallback.style.display = "none";
            }else{
                if(wallImage){ wallImage.removeAttribute("src"); wallImage.hidden = true; wallImage.style.display = "none"; }
                if(wallFallback){ wallFallback.style.display = ""; wallFallback.textContent = story.visual || "📰"; }
            }
        }

        function render(index){
            currentIndex = (index + data.stories.length) % data.stories.length;
            const story = data.stories[currentIndex];

            visual.textContent = story.visual || "📰";
            if(story.imageUrl){
                visualImage.src = story.imageUrl;
                visualImage.alt = story.imageAlt || "";
                visualImage.hidden = false;
                visualImage.style.display = "block";
                visual.style.display = "none";
                imageCredit.textContent = story.imageCredit ? "IMAGE · " + story.imageCredit : "";
                imageCredit.style.display = story.imageCredit ? "block" : "none";
            }else{
                visualImage.removeAttribute("src");
                visualImage.hidden = true;
                visualImage.style.display = "none";
                visual.style.display = "";
                imageCredit.textContent = "";
                imageCredit.style.display = "none";
            }
            category.textContent = story.category || "NEWS";
            location.textContent = story.location || "";
            title.textContent = story.headline || "";
            summary.textContent = story.summary || "";
            source.textContent = story.source ? "SOURCE · " + story.source.toUpperCase() : "LOCALMEDIA247";
            date.textContent = data.date || "TODAY";

            if(story.url){
                sourceLink.href = story.url;
                sourceLink.style.display = "inline-flex";
            }else{
                sourceLink.removeAttribute("href");
                sourceLink.style.display = "none";
            }

            card.classList.remove("is-changing");
            void card.offsetWidth;
            card.classList.add("is-changing");
        }

        function open(index){
            lastFocused = document.activeElement;
            render(index);
            reader.hidden = false;
            reader.style.display = "grid";
            reader.style.visibility = "visible";
            reader.style.opacity = "1";
            reader.style.pointerEvents = "auto";
            reader.style.zIndex = "2147483647";
            reader.classList.add("open");
            reader.setAttribute("aria-hidden","false");
            document.body.classList.add("lm247-news-reader-open");
            setTimeout(() => closeButton.focus(), 80);
        }

        function close(){
            /* Use both the class state and explicit inline state. This
               guarantees the reader disappears even if another museum
               stylesheet/overlay has altered the modal's computed state. */
            reader.classList.remove("open");
            reader.setAttribute("aria-hidden","true");
            reader.hidden = true;
            reader.style.display = "none";
            reader.style.visibility = "hidden";
            reader.style.opacity = "0";
            reader.style.pointerEvents = "none";
            reader.style.zIndex = "-1";
            document.body.classList.remove("lm247-news-reader-open");
            if(typeof window.returnToMuseumHomepage === "function"){
                window.returnToMuseumHomepage();
            }
            if(lastFocused && typeof lastFocused.focus === "function"){
                setTimeout(() => lastFocused.focus(), 50);
            }
        }

        function activate(){
            const visibleHeadline = (wall.querySelector(".lm247-news-headline")?.textContent || "").trim();
            const match = data.stories.findIndex(story => story.headline === visibleHeadline);
            open(match >= 0 ? match : wallIndex);
        }

        renderWall(0);
        window.setInterval(function(){
            if(!document.hidden && !reader.classList.contains("open")){
                renderWall(wallIndex + 1);
            }
        }, 9000);

        wall.addEventListener("click", function(event){
            if(event.target.closest("a,button")) return;
            activate();
        });

        wall.addEventListener("keydown", function(event){
            if(event.key === "Enter" || event.key === " "){
                event.preventDefault();
                activate();
            }
        });

        reader.addEventListener("click", function(event){
            const closeTarget = event.target.closest("[data-news-reader-close]");
            if(closeTarget){
                event.preventDefault();
                event.stopPropagation();
                close();
            }
        });

        /* Capture close interaction before any museum/world click handler can consume it. */
        function handleReaderCloseInteraction(event){
            const target = event.target && event.target.closest
                ? event.target.closest("[data-news-reader-close], .lm247-news-reader-close")
                : null;
            if(!target) return;
            event.preventDefault();
            event.stopPropagation();
            if(typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
            close();
        }

        window.addEventListener("pointerdown", handleReaderCloseInteraction, true);
        window.addEventListener("click", handleReaderCloseInteraction, true);
        /* Give the close control its own interaction path. The museum canvas
           has many delegated/global handlers, so we consume pointer and click
           events directly on the button before they can reach the museum. */
        function closeFromButton(event){
            if(event){
                event.preventDefault();
                event.stopPropagation();
                if(typeof event.stopImmediatePropagation === "function"){
                    event.stopImmediatePropagation();
                }
            }
            close();
        }

        closeButton.addEventListener("pointerdown", closeFromButton, true);
        closeButton.addEventListener("pointerup", closeFromButton, true);
        closeButton.addEventListener("mousedown", closeFromButton, true);
        closeButton.addEventListener("mouseup", closeFromButton, true);
        closeButton.addEventListener("touchend", closeFromButton, true);
        closeButton.addEventListener("click", closeFromButton, true);
        closeButton.onclick = closeFromButton;

        prev.addEventListener("click", function(){
            render(currentIndex - 1);
        });

        next.addEventListener("click", function(){
            render(currentIndex + 1);
        });

        document.addEventListener("keydown", function(event){
            if(!reader.classList.contains("open")) return;

            if(event.key === "Escape"){
                event.preventDefault();
                close();
            }else if(event.key === "ArrowLeft"){
                event.preventDefault();
                render(currentIndex - 1);
            }else if(event.key === "ArrowRight"){
                event.preventDefault();
                render(currentIndex + 1);
            }
        });
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", init);
    }else{
        init();
    }

    setTimeout(init, 500);
    setTimeout(init, 1500);
})();
