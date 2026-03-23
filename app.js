const app = document.getElementById("app");
const backButton = document.getElementById("back-button");

const tree = {
  id: "gcla",
  label: "GCLA",
  hover: "Grand Chronicle of Late Antiquity",
  children: [
    {
      id: "h2r",
      label: "H2R",
      hover: "Hero to Rebel"
    },
    {
      id: "o2p",
      label: "O2P",
      hover: "Orphan to Princess"
    },
    {
      id: "elb",
      label: "ELB",
      hover: "Ex Libris Boranis",
      children: [
        {
          id: "vt",
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

function getPath(node, targetId, path = []) {
  const newPath = [...path, node];

  if (node.id === targetId) {
    return newPath;
  }

  if (!node.children) {
    return null;
  }

  for (const child of node.children) {
    const result = getPath(child, targetId, newPath);
    if (result) {
      return result;
    }
  }

  return null;
}

function getNodeByPath(pathIds) {
  let node = tree;

  if (pathIds.length === 0) {
    return tree;
  }

  let startIndex = 0;
  if (pathIds[0] === tree.id) {
    startIndex = 1;
  }

  for (let i = startIndex; i < pathIds.length; i++) {
    if (!node.children) {
      return null;
    }

    const next = node.children.find(child => child.id === pathIds[i]);
    if (!next) {
      return null;
    }
    node = next;
  }

  return node;
}

function setHashForNode(node) {
  const path = getPath(tree, node.id);
  if (!path) return;

  const hash = path
    .map(n => n.id)
    .slice(1)
    .join("/");

  window.location.hash = hash;
}

function renderHome(updateHash = true) {
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

  if (updateHash) {
    window.location.hash = "";
  }
}

function renderChildren(node, updateHash = true) {
  currentView = "children";
  currentNode = node;
  app.innerHTML = "";

  const children = node.children || [];

  if (children.length === 0) {
    renderLeaf(node, updateHash);
    return;
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

  if (updateHash) {
    setHashForNode(node);
  }
}

function renderLeaf(node, updateHash = true) {
  currentView = "leaf";
  currentNode = node;
  app.innerHTML = "";

  const leaf = document.createElement("div");
  leaf.className = "leaf-content";
  leaf.textContent = node.hover || node.label;

  app.appendChild(leaf);
  backButton.hidden = false;

  if (updateHash) {
    setHashForNode(node);
  }
}

function loadFromHash() {
  const hash = window.location.hash.replace(/^#/, "").trim();

  if (!hash) {
    renderHome(false);
    return;
  }

  const pathIds = hash.split("/").filter(Boolean);
  const node = getNodeByPath(pathIds);

  if (!node) {
    renderHome(false);
    return;
  }

  if (node.children && node.children.length > 0) {
    renderChildren(node, false);
  } else {
    renderLeaf(node, false);
  }
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

window.addEventListener("hashchange", loadFromHash);

loadFromHash();