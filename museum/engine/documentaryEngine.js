/*======================================*
 * DOCUMENTARY ENGINE v1.0
 *======================================*
 *
 * Controls and queries the
 * Voices of Humanity documentary
 * collection.
 *
 * Depends on:
 * data/documentaries.js
 *
 *======================================*/


/*======================================*
 * ENGINE OBJECT
 *======================================*/

window.DocumentaryEngine = {


    /*==================================*
     * GET ALL DOCUMENTARIES
     *==================================*/

    getAll() {

        return window.DocumentaryCollection || [];

    },


    /*==================================*
     * GET DOCUMENTARY BY ID
     *==================================*/

    getById(id) {

        return this.getAll().find(
            documentary =>
                documentary.id === id
        );

    },


    /*==================================*
     * GET DOCUMENTARY BY EPISODE
     *==================================*/

    getByEpisode(episode) {

        return this.getAll().find(
            documentary =>
                documentary.episode === episode
        );

    },


    /*==================================*
     * GET DOCUMENTARY BY LANGUAGE
     *==================================*/

    getByLanguage(language) {

        return this.getAll().filter(
            documentary =>
                documentary.language
                    .toLowerCase() ===
                language.toLowerCase()
        );

    },


    /*==================================*
     * GET DOCUMENTARIES BY REGION
     *==================================*/

    getByRegion(region) {

        return this.getAll().filter(
            documentary =>
                documentary.region
                    .toLowerCase() ===
                region.toLowerCase()
        );

    },


    /*==================================*
     * GET PUBLISHED DOCUMENTARIES
     *==================================*/

    getPublished() {

        return this.getAll().filter(
            documentary =>
                documentary.status ===
                "published"
        );

    },


    /*==================================*
     * SEARCH COLLECTION
     *==================================*/

    search(query) {

        const text =
            query.toLowerCase().trim();

        if (!text) {

            return this.getAll();

        }

        return this.getAll().filter(
            documentary => {

                return (

                    documentary.title
                        .toLowerCase()
                        .includes(text)

                    ||

                    documentary.language
                        .toLowerCase()
                        .includes(text)

                    ||

                    documentary.region
                        .toLowerCase()
                        .includes(text)

                    ||

                    documentary.description
                        .toLowerCase()
                        .includes(text)

                );

            }
        );

    },


    /*==================================*
     * COLLECTION COUNT
     *==================================*/

    count() {

        return this.getAll().length;

    },


    /*==================================*
     * COLLECTION STATUS
     *==================================*/

    status() {

        console.log(
            "================================"
        );

        console.log(
            "VOICES OF HUMANITY"
        );

        console.log(
            "DOCUMENTARY ENGINE v1.0"
        );

        console.log(
            "================================"
        );

        console.log(
            "Documentaries:",
            this.count()
        );

        console.log(
            "Published:",
            this.getPublished().length
        );

        console.log(
            "================================"
        );

    }

};


/*======================================*
 * ENGINE READY
 *======================================*/

console.log(
    "✓ Documentary Engine v1.0 Loaded"
);

DocumentaryEngine.status();