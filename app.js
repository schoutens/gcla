const tree = {
    label: "GCLA",
    hover: "Grand Chronicle of Late Antiquity",
    children: [
        {
            label: "H2R",
            hover: "Hero to Rebel",
            children: []
        },
        {
            label: "O2P",
            hover: "Orphan to Princess",
            children: []
        },
        {
            label: "ELB",
            hover: "Ex Libris Boranis",
            children: []
        }
    ]
};

const app = document.getElementById("app");
const backButton = document.getElementById("back-button");

let currentNode = tree;
let historyStack = [];

function renderNode(node) {
    app.innerHTML = "";

    const container = document.createElement("div");
    container.className = "button-container";

    let buttonsToShow = [];

    if (node === tree) {
        buttonsToShow = [node];
    } else if (node.children && node.children.length > 0) {
        buttonsToShow = node.children;
    } else {
        const leaf = document.createElement("div");
        leaf.textContent = "This leaf has no content yet.";
        leaf.style.fontSize = "28px";
        leaf.style.textAlign = "center";
        app.appendChild(leaf);
        backButton.hidden = historyStack.length === 0;
        return;
    }

    buttonsToShow.forEach((child) => {
        const button = document.createElement("div");
        button.className = "big-button";

        if (buttonsToShow.length === 1) {
            button.classList.add("single-button");
        }

        button.textContent = child.label;

        button.addEventListener("mouseover", () => {
            button.textContent = child.hover || child.label;
        });

        button.addEventListener("mouseout", () => {
            button.textContent = child.label;
        });

        button.addEventListener("click", () => {
            if (child.children && child.children.length > 0) {
                historyStack.push(currentNode);
                currentNode = child;
                renderNode(currentNode);
            } else if (child !== tree) {
                historyStack.push(currentNode);
                currentNode = child;
                renderNode(currentNode);
            } else if (child === tree) {
                historyStack.push(currentNode);
                currentNode = child;
                renderNode(currentNode);
            }
        });

        container.appendChild(button);
    });

    app.appendChild(container);
    backButton.hidden = historyStack.length === 0;
}

backButton.addEventListener("click", () => {
    if (historyStack.length > 0) {
        currentNode = historyStack.pop();
        renderNode(currentNode);
    }
});

renderNode(currentNode);