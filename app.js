const app = document.getElementById("app");
const backButton = document.getElementById("back-button");

let tree = null;

let historyStack = [];
let currentView = "home";
let currentNode = null;

function makeButton(node, onClick) {
  const button = document.createElement("div");
  button.className = "big-button";

  const label = document.createElement("span");
  label.className = "button-label";
  label.textContent = node.label;
  button.appendChild(label);

  button.addEventListener("mouseover", () => {
    label.textContent = node.hover || node.label;
  });

  button.addEventListener("mouseout", () => {
    label.textContent = node.label;
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

  let hash;

  if (node.id === tree.id) {
    hash = tree.id; // "gcla"
  } else {
    hash = path
      .map(n => n.id)
      .slice(1)
      .join("/");
  }

  window.location.hash = hash;
}
function updateHeaderForNode(node) {
  const header = document.getElementById("site-header");
  if (!header || !tree) return;

  header.classList.remove("branch-gcla", "branch-h2r", "branch-o2p", "branch-elb");

  let branchClass = "branch-gcla";

  const path = getPath(tree, node ? node.id : tree.id) || [tree];
  const firstChild = path[1] ? path[1].id : tree.id;

  if (firstChild === "h2r") {
    branchClass = "branch-h2r";
  } else if (firstChild === "o2p") {
    branchClass = "branch-o2p";
  } else if (firstChild === "elb") {
    branchClass = "branch-elb";
  }

  header.classList.add(branchClass);
}

function renderHome(updateHash = true) {
  currentView = "home";
  currentNode = null;
  app.innerHTML = "";
  updateHeaderForNode(tree);

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
  updateHeaderForNode(node);

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

function makeShareButtons(node) {
  if (!node.share) return null;

  const shareBox = document.createElement("div");
  shareBox.className = "share-box";

  const pageUrl = window.location.href;
  const pageTitle = node.hover || node.label || "GCLA";

  const links = [
    {
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
    },
    {
      label: "X",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`
    },
    {
      label: "Email",
      url: `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(pageUrl)}`
    }
  ];

  links.forEach(item => {
    const link = document.createElement("a");
    link.className = "share-button";
    link.textContent = item.label;
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    shareBox.appendChild(link);
  });

  const copyButton = document.createElement("button");
  copyButton.className = "share-button";
  copyButton.textContent = "Copy link";

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(pageUrl);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = "Copy link";
    }, 1500);
  });

  shareBox.appendChild(copyButton);

  return shareBox;
}

function renderLeaf(node, updateHash = true) {
  currentView = "leaf";
  currentNode = node;
  app.innerHTML = "";
  updateHeaderForNode(node);

  if (node.pdf) {
    const container = document.createElement("div");
    container.className = "pdf-container";

    const iframe = document.createElement("iframe");
    iframe.src = node.pdf;
    iframe.className = "pdf-frame";

    container.appendChild(iframe);
    app.appendChild(container);
  } else {
    const leaf = document.createElement("div");
    leaf.className = "leaf-content";
    leaf.textContent = node.text || node.hover || node.label;

    app.appendChild(leaf);
  }

  
  if (node.patreon) {
    const box = document.createElement("div");
    box.className = "patreon-box";

    const text = document.createElement("div");
    text.className = "patreon-text";
    text.textContent = node.patreonText || "Continue into the commentary layer";

    const link = document.createElement("a");
    link.href = node.patreon;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "patreon-button";
    link.textContent = "Enter";

    box.appendChild(text);
    box.appendChild(link);
    app.appendChild(box);
  }

  const shareButtons = makeShareButtons(node);
  if (shareButtons) {
    app.appendChild(shareButtons);
  }

  backButton.hidden = false;

  if (updateHash) {
    setHashForNode(node);
  }
  
}

function loadFromHash() {
  const hash = window.location.hash.replace(/^#/, "").trim();

  historyStack = [];

  if (!hash) {
    renderHome(false);
    return;
  }

  if (hash === tree.id) {
    historyStack.push({ view: "home", node: null });
    renderChildren(tree, false);
    return;
  }

  const pathIds = hash.split("/").filter(Boolean);
  const node = getNodeByPath(pathIds);

  if (!node) {
    renderHome(false);
    return;
  }

  historyStack.push({ view: "home", node: null });

  let current = tree;

  for (const id of pathIds) {
    historyStack.push({ view: "children", node: current });

    if (!current.children) {
      renderHome(false);
      return;
    }

    const next = current.children.find(c => c.id === id);
    if (!next) {
      renderHome(false);
      return;
    }

    current = next;
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

fetch("tree.json")
  .then(res => res.json())
  .then(data => {
    tree = data;
    loadFromHash();
  })
  .catch(err => {
    console.error("Tree failed to load", err);
    app.textContent = "Site structure failed to load.";
  });

  