/*======================================*
 * VOICES OF HUMANITY
 * MUSEUM GARDENS DATA
 *======================================*/


const Gardens = [

    /*==================================*
     * REFLECTION GARDEN
     *
     * Located directly below
     * Oceania Languages Museum
     *==================================*/

    {
        id: "reflection-garden",

        name: "Reflection Garden",

        /*
         * Oceania Complex
         *
         * left:   2150px
         * top:    1450px
         * width:  520px
         * height: 520px
         *
         * Garden
         *
         * width:  360px
         * height: 240px
         *
         * Horizontal centering:
         *
         * 2150 + (520 - 360) / 2
         * = 2230
         *
         * Vertical placement:
         *
         * 1450 + 520 + 40
         * = 2010
         */

        x: 1930,

        y: 1910
    }

];


console.log(
    "✓ Gardens Data Loaded:",
    Gardens.length,
    "gardens"
);