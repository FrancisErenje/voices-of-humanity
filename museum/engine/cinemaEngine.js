/*==================================================
    VOICES OF HUMANITY
    DOCUMENTARY CINEMA ENGINE v1.2
==================================================

    Controls the Documentary Cinema.

    Data source:
    window.DocumentaryCollection

==================================================*/

window.CinemaEngine = {

    cinema: null,

    collection: [],

    currentDocumentary: null,


    /*==================================================
        INITIALISE CINEMA
    ==================================================*/

    init() {

        this.cinema =
            document.getElementById("cinema");

        if (!this.cinema) {

            console.warn(
                "Cinema Engine: #cinema not found."
            );

            return;

        }


        this.collection =
            window.DocumentaryCollection || [];

        /* First in the cinema: The Hidden Empress, followed by
           the complete Voices of Humanity language documentary archive.
           Other cinema items come after the language collection. */
        this.collection = this.collection.slice().sort((a, b) => {
            const hiddenA = a && a.id === "special-hidden-empress";
            const hiddenB = b && b.id === "special-hidden-empress";
            if (hiddenA && !hiddenB) return -1;
            if (!hiddenA && hiddenB) return 1;

            const languageA = a && a.episode !== null && a.episode !== undefined;
            const languageB = b && b.episode !== null && b.episode !== undefined;
            if (languageA && !languageB) return -1;
            if (!languageA && languageB) return 1;

            return 0;
        });

        this.render();


        console.log(
            "✓ Cinema Engine v1.2 Initialised"
        );


        console.log(
            "Cinema documentaries:",
            this.collection.length
        );

        this.bindBuildingExperience();

    },

    /*==================================================
        CINEMA BUILDING EXPERIENCE
        The cinema remains clean on the campus.
        Its documentary collection opens in the
        building experience, like the African
        Languages Museum experience.
    ==================================================*/

    bindBuildingExperience() {

        if (!this.cinema) return;
        if (this.cinema.dataset.cinemaExperienceBound === "true") return;

        this.cinema.dataset.cinemaExperienceBound = "true";

        const interior = this.cinema.querySelector(".cinema-interior");
        if (!interior) return;

        /* Keep the architectural building visible while
           moving the full cinema interior into the visitor
           experience only when the building is opened. */
        interior.dataset.originalParent = "cinema";

        const overlay = document.createElement("div");
        overlay.className = "cinema-experience-overlay";
        overlay.innerHTML = `
            <div class="cinema-experience-card" role="dialog" aria-modal="true" aria-labelledby="cinemaExperienceTitle">
                <button class="cinema-experience-close" type="button" aria-label="Close Documentary Cinema">×</button>
                <div class="cinema-experience-eyebrow">VOICES OF HUMANITY · DOCUMENTARY CINEMA</div>
                <h2 id="cinemaExperienceTitle">Documentary Cinema</h2>
                <p class="cinema-experience-intro">
                    Enter the cinema to explore the Voices of Humanity documentary collection.
                    Our language documentaries are the first exhibition, before the cinema's other experiences.
                </p>
                <div class="cinema-experience-content"></div>
            </div>
        `;

        document.body.appendChild(overlay);

        const content = overlay.querySelector(".cinema-experience-content");
        const close = overlay.querySelector(".cinema-experience-close");

        const openExperience = (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            content.appendChild(interior);
            overlay.classList.add("open");
            document.body.classList.add("cinema-overlay-open");

            setTimeout(() => close.focus(), 100);
        };

        const closeExperience = () => {
            this.cinema.appendChild(interior);
            overlay.classList.remove("open");
            document.body.classList.remove("cinema-overlay-open");
            if (typeof returnToMuseumHomepage === "function") returnToMuseumHomepage();
        };

        close.addEventListener("click", closeExperience);

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) closeExperience();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && overlay.classList.contains("open")) {
                closeExperience();
            }
        });

        this.cinema.addEventListener("click", (event) => {
            if (event.target.closest(".cinema-experience-overlay")) return;
            openExperience(event);
        }, true);

    },


    /*==================================================
        RENDER CINEMA
    ==================================================*/

    render() {

        if (!this.cinema) return;


        this.cinema.innerHTML = `

            <!-- ======================================
                 EXTERIOR CINEMA TITLE
                 Kept outside the visitor interior so the
                 building is clearly identifiable on campus.
            ======================================= -->

            <div class="cinema-exterior-title" aria-label="Documentary Cinema">
                <span>VOICES OF HUMANITY</span>
                <strong>DOCUMENTARY CINEMA</strong>
                <small>FILM · LANGUAGE · MEMORY</small>
            </div>

            <!-- ======================================
                 CINEMA ENTRANCE
            ======================================= -->

            <div class="cinema-entrance">


                <div class="cinema-entrance-canopy">

                    <div class="cinema-entrance-light"></div>
                    <div class="cinema-entrance-light"></div>
                    <div class="cinema-entrance-light"></div>
                    <div class="cinema-entrance-light"></div>
                    <div class="cinema-entrance-light"></div>

                </div>


                <div class="cinema-entrance-sign">

                    <span>
                        VOICES OF HUMANITY
                    </span>

                    <strong>
                        DOCUMENTARY CINEMA
                    </strong>

                </div>


                <div class="cinema-doors">

                    <div class="cinema-door left-door"></div>

                    <div class="cinema-door right-door"></div>

                </div>


            </div>


            <!-- ======================================
                 CINEMA INTERIOR
            ======================================= -->

            <div class="cinema-interior">

                <!-- ==================================
                     LANGUAGE DOCUMENTARIES — FIRST VIEW
                     Visitors encounter the Voices of Humanity
                     language archive before secondary cinema
                     experiences.
                ================================== -->

                <div class="cinema-library cinema-language-library">

                    <div class="library-heading">

                        <div>
                            <h3>Our Language Documentaries</h3>
                            <p class="cinema-library-intro">
                                The Voices of Humanity documentary archive —
                                language by language, community by community.
                            </p>
                        </div>

                        <span>
                            ${this.collection.filter(item => item.episode !== null && item.status === "published").length}
                            language documentaries
                        </span>

                    </div>

                    <div class="documentary-grid" id="documentary-grid"></div>

                </div>


                <!-- ==================================
                     CINEMA SCREEN — SECONDARY EXPERIENCE
                ================================== -->

                <div class="cinema-screen-area">

                    <div class="cinema-screen">
                        <div class="screen-glow"></div>
                        <span>DOCUMENTARY CINEMA</span>
                    </div>

                </div>


                <div class="cinema-header">
                    <p>
                        After exploring our language documentaries,
                        continue through the cinema for special
                        screenings and other documentary experiences.
                    </p>
                </div>

            </div>

        `;


        this.renderDocumentaries();

    },


    /*==================================================
        RENDER DOCUMENTARIES
    ==================================================*/

    renderDocumentaries() {

        const grid =
            document.getElementById(
                "documentary-grid"
            );


        if (!grid) {

            console.warn(
                "Cinema Engine: documentary grid not found."
            );

            return;

        }


        /*==============================================
            EMPTY COLLECTION
        ==============================================*/

        if (this.collection.length === 0) {

            grid.innerHTML = `

                <div class="cinema-empty">

                    No documentaries are
                    currently available.

                </div>

            `;

            return;

        }


        /*==============================================
            CREATE DOCUMENTARY CARDS
        ==============================================*/

        grid.innerHTML =
            this.collection
                .map(
                    documentary =>
                        this.createCard(
                            documentary
                        )
                )
                .join("");


        this.attachCardEvents();

    },


    /*==================================================
        CREATE DOCUMENTARY CARD
    ==================================================*/

    createCard(documentary) {

        return `

            <article
                class="documentary-card"
                data-documentary-id="${documentary.id}"
            >


                <!-- ==================================
                     CARD TOP
                ================================== -->

                <div class="documentary-card-top">

                    <span class="episode-number">

                        EPISODE
                        ${String(
                            documentary.episode
                        ).padStart(2, "0")}

                    </span>


                    <span class="documentary-status">

                        ${documentary.status}

                    </span>

                </div>


                <!-- ==================================
                     CARD BODY
                ================================== -->

                <div class="documentary-card-body">


                    <h4>

                        ${documentary.title}

                    </h4>


                    <p class="documentary-language">

                        ${documentary.language}

                    </p>


                    <p class="documentary-description">

                        ${documentary.description}

                    </p>


                    <div class="documentary-meta">

                        <span>

                            ${documentary.country}

                        </span>


                        <span>

                            ${documentary.category}

                        </span>

                    </div>


                </div>


                <!-- ==================================
                     CARD FOOTER
                ================================== -->

                <div class="documentary-card-footer">

                    <button
                        class="watch-documentary"
                        data-id="${documentary.id}"
                        type="button"
                    >

                        Watch Documentary

                    </button>

                </div>


            </article>

        `;

    },


    /*==================================================
        ATTACH CARD EVENTS
    ==================================================*/

    attachCardEvents() {

        if (!this.cinema) return;


        const buttons =
            this.cinema.querySelectorAll(
                ".watch-documentary"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;


                    this.openDocumentary(id);

                }
            );

        });

    },


    /*==================================================
        OPEN DOCUMENTARY
    ==================================================*/

    openDocumentary(id) {

        const documentary =
            this.collection.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!documentary) {

            console.warn(
                "Documentary not found:",
                id
            );

            return;

        }


        this.currentDocumentary =
            documentary;


        console.log(
            "Opening documentary:",
            documentary.title
        );


        this.showViewer(
            documentary
        );

    },


    /*==================================================
        DOCUMENTARY VIEWER
    ==================================================*/

    showViewer(documentary) {


        /*==============================================
            REMOVE EXISTING VIEWER
        ==============================================*/

        const existingViewer =
            document.getElementById(
                "documentary-viewer"
            );


        if (existingViewer) {

            existingViewer.remove();

        }


        /*==============================================
            CREATE VIEWER
        ==============================================*/

        const viewer =
            document.createElement("div");


        viewer.id =
            "documentary-viewer";


        viewer.innerHTML = `

            <div class="viewer-backdrop">


                <div class="viewer-panel">


                    <!-- ==============================
                         CLOSE BUTTON
                    =============================== -->

                    <button
                        class="viewer-close"
                        id="close-documentary"
                        type="button"
                        aria-label="Close documentary"
                    >

                        ×

                    </button>


                    <!-- ==============================
                         VIDEO
                    =============================== -->

                    <div class="viewer-video">

                        <iframe

                            src="${this.youtubeEmbed(
                                documentary.videoUrl
                            )}"

                            title="${documentary.title}"

                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share
                            "

                            allowfullscreen>

                        </iframe>

                    </div>


                    <!-- ==============================
                         DOCUMENTARY INFORMATION
                    =============================== -->

                    <div class="viewer-information">


                        <span class="viewer-episode">

                            Episode
                            ${documentary.episode}

                        </span>


                        <h2>

                            ${documentary.title}

                        </h2>


                        <p class="viewer-language">

                            ${documentary.language}

                        </p>


                        <p>

                            ${documentary.description}

                        </p>


                        <div class="viewer-meta">

                            <span>

                                ${documentary.country}

                            </span>


                            <span>

                                ${documentary.category}

                            </span>

                        </div>


                    </div>


                </div>


            </div>

        `;


        document.body.appendChild(
            viewer
        );


        /*==============================================
            CLOSE BUTTON
        ==============================================*/

        const closeButton =
            document.getElementById(
                "close-documentary"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => {

                    this.closeViewer(
                        viewer
                    );

                }
            );

        }


        /*==============================================
            BACKDROP CLICK
        ==============================================*/

        const backdrop =
            viewer.querySelector(
                ".viewer-backdrop"
            );


        if (backdrop) {

            backdrop.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        backdrop
                    ) {

                        this.closeViewer(
                            viewer
                        );

                    }

                }
            );

        }


        /*==============================================
            ESCAPE KEY
        ==============================================*/

        const escapeHandler =
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    this.closeViewer(
                        viewer
                    );


                    document.removeEventListener(
                        "keydown",
                        escapeHandler
                    );

                }

            };


        document.addEventListener(
            "keydown",
            escapeHandler
        );

    },


    /*==================================================
        CLOSE VIEWER
    ==================================================*/

    closeViewer(viewer) {

        if (viewer) {

            viewer.remove();

        }


        this.currentDocumentary =
            null;

    },


    /*==================================================
        YOUTUBE URL → EMBED URL
    ==================================================*/

    youtubeEmbed(url) {

        if (!url) {

            return "";

        }


        try {

            const parsed =
                new URL(url);


            let videoId =
                parsed.searchParams.get(
                    "v"
                );


            /*==========================================
                HANDLE YOUTUBE PATHS
            ==========================================*/

            if (!videoId) {

                const parts =
                    parsed.pathname
                        .split("/")
                        .filter(Boolean);


                /*
                    Handles:

                    /embed/VIDEO_ID
                    /shorts/VIDEO_ID
                    /VIDEO_ID
                */

                if (
                    parts.length >= 2 &&
                    (
                        parts[0] === "embed" ||
                        parts[0] === "shorts"
                    )
                ) {

                    videoId =
                        parts[1];

                }

                else {

                    videoId =
                        parts[
                            parts.length - 1
                        ];

                }

            }


            if (!videoId) {

                return url;

            }


            return (
                "https://www.youtube.com/embed/" +
                videoId
            );


        }

        catch (error) {

            console.warn(
                "Invalid YouTube URL:",
                url
            );


            return url;

        }

    },


    /*==================================================
        STATUS
    ==================================================*/

    status() {

        console.log(
            "================================"
        );


        console.log(
            "VOICES OF HUMANITY"
        );


        console.log(
            "DOCUMENTARY CINEMA ENGINE v1.2"
        );


        console.log(
            "================================"
        );


        console.log(
            "Cinema:",
            this.cinema
                ? "Ready"
                : "Not Found"
        );


        console.log(
            "Documentaries:",
            this.collection.length
        );


        console.log(
            "================================"
        );

    }

};


/*======================================================
    START ENGINE
======================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        CinemaEngine.init();

        CinemaEngine.status();

    }
);


console.log(
    "✓ Cinema Engine v1.2 Loaded"
);