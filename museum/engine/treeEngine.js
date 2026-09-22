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

    console.log(
        "✓ Tree Engine: Loaded",
        Environment.trees.length,
        "trees"
    );

}


console.log("✓ Tree Engine Loaded");