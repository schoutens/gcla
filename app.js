const app = document.getElementById("app");
const backButton = document.getElementById("back-button");

const tree = {
  label: "GCLA",
  hover: "Grand Chronicle of Late Antiquity",
  children: [
    {
      label: "H2R",
      hover: "Hero to Rebel"
    },
    {
      label: "O2P",
      hover: "Orphan to Princess"
    },
    {
      label: "ELB",
      hover: "Ex Libris Boranis",
      children: [
        {
          label: "VT",
          hover: "The Storybook of Varaztirots the Armenian"
        }
      ]
    }
  ]
};

let historyStack = [];
let currentView = "home";
let currentNode = null;

function makeButton(node, onClick) {
  const button = document.createElement("div");
  button.className = "big-button";
  button.textContent = node.label;

  button.addEventListener("mouseover", () => {
    button.textContent = node.hover || node.label;
  });

  button.addEventListener("mouseout", () => {
    button.textContent = node.label;
  });

  button.addEventListener("click", onClick);

  return button;
}

function renderHome() {
  currentView = "home";
  currentNode = null;
  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "button-container";

  const rootButton = makeButton(tree, () => {
    historyStack.push({ view: "home", node: null });
    renderChildren(tree);
  });

  rootButton.classList.add("single-button");
  container.appendChild(rootButton);
  app.appendChild(container);

  backButton.hidden = true;
}

function renderLeaf(node) {
  currentView = "leaf";
  currentNode = node;
  app.innerHTML = "";

  const leaf = document.createElement("div");
  leaf.className = "leaf-content";
  leaf.textContent = node.hover || node.label;

  app.appendChild(leaf);
  backButton.hidden = false;
}

  const container = document.createElement("div");
  container.className = "button-container";

  children.forEach((child) => {
    const button = makeButton(child, () => {
      historyStack.push({ view: "children", node: node });

      if (child.children && child.children.length > 0) {
        renderChildren(child);
      } else {
        renderLeaf(child);
      }
    });

    if (children.length === 1) {
      button.classList.add("single-button");
    }

    container.appendChild(button);
  });

  app.appendChild(container);
  backButton.hidden = false;
}

function renderLeaf(node) {
  currentView = "leaf";
  currentNode = node;
  app.innerHTML = "";

  const leaf = document.createElement("div");
  leaf.style.textAlign = "center";
  leaf.style.fontSize = "28px";
  leaf.style.maxWidth = "800px";
  leaf.style.padding = "20px";
  leaf.textContent = node.hover || node.label;

  app.appendChild(leaf);
  backButton.hidden = false;
}

backButton.addEventListener("click", () => {
  if (historyStack.length === 0) {
    renderHome();
    return;
  }

  const previous = historyStack.pop();

  if (previous.view === "home") {
    renderHome();
  } else if (previous.view === "children") {
    renderChildren(previous.node);
  }
});

renderHome();