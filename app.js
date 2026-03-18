const app = document.getElementById("app");
const backButton = document.getElementById("back-button");

const tree = {
  label: "GCLA",
  hover: "Grand Chronicle of Late Antiquity",
  children: [
    { label: "H2R", hover: "Hero to Rebel" },
    { label: "O2P", hover: "Orphan to Princess" },
    { label: "ELB", hover: "Ex Libris Boranis" }
  ]
};

let showingRoot = true;

function makeButton(text, hoverText, onClick) {
  const button = document.createElement("div");
  button.className = "big-button";
  button.textContent = text;

  button.addEventListener("mouseover", () => {
    button.textContent = hoverText;
  });

  button.addEventListener("mouseout", () => {
    button.textContent = text;
  });

  button.addEventListener("click", onClick);

  return button;
}

function renderRoot() {
  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "button-container";

  const button = makeButton(tree.label, tree.hover, renderChildren);
  button.classList.add("single-button");

  container.appendChild(button);
  app.appendChild(container);

  backButton.hidden = true;
  showingRoot = true;
}

function renderChildren() {
  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "button-container";

  tree.children.forEach((child) => {
    const button = makeButton(child.label, child.hover, () => {
      alert(child.hover);
    });
    container.appendChild(button);
  });

  app.appendChild(container);

  backButton.hidden = false;
  showingRoot = false;
}

backButton.addEventListener("click", () => {
  renderRoot();
});

renderRoot();