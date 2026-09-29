/*======================================*
* VOICES OF HUMANITY
* TREE ENGINE
*======================================*/

function createTree(x, y) {

    const tree = document.createElement("div");

    tree.className = "tree";

    tree.style.left = x + "px";
    tree.style.top = y + "px";

    campus.appendChild(tree);

}


/*======================================*
* LOAD ENVIRONMENT TREES
*======================================*/

function loadTrees() {

    if (
        typeof Environment === "undefined" ||
        !Array.isArray(Environment.trees)
    ) {

        console.error(
            "✗ Tree Engine: Environment tree data not found"
        );

        return;

    }

    Environment.trees.forEach(tree => {

        createTree(tree.x, tree.y);

    });

    /* Keep the Asian Languages Museum title unobstructed.
       Hide only trees whose rendered area actually overlaps the title.
       This is deliberately geometry-based so we do not remove unrelated
       landscaping elsewhere on the campus. */
    requestAnimationFrame(() => {
        const title = document.querySelector("#asiaMuseum .asia-name");
        if (!title) return;

        const titleRect = title.getBoundingClientRect();

        document.querySelectorAll("#campus > .tree").forEach(tree => {
            const treeRect = tree.getBoundingClientRect();

            const overlaps =
                treeRect.right > titleRect.left &&
                treeRect.left < titleRect.right &&
                treeRect.bottom > titleRect.top &&
                treeRect.top < titleRect.bottom;

            if (overlaps) {
                tree.style.display = "none";
                tree.dataset.hiddenForAsiaTitle = "true";
            }
        });
    });

    console.log(
        "✓ Tree Engine: Loaded",
        Environment.trees.length,
        "trees"
    );

}


console.log("✓ Tree Engine Loaded");