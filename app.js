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

let currentNode = tree;
let historyStack = [];

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

function renderNode(node) {
  app.innerHTML = "";

  const container = document.createElement("div");
  container.className = "button-container";

  let buttonsToShow;

  if (node === tree) {
    buttonsToShow = [tree];
  } else if (node.children && node.children.length > 0) {
    buttonsToShow = node.children;
  } else {
    const leaf = document.createElement("div");
    leaf.style.textAlign = "center";
    leaf.style.fontSize = "28px";
    leaf.style.maxWidth = "800px";
    leaf.textContent = node.hover || node.label;
    app.appendChild(leaf);

    backButton.hidden = historyStack.length === 0;
    return;
  }

  buttonsToShow.forEach((child) => {
    const button = makeButton(child, () => {
      historyStack.push(currentNode);
      currentNode = child;
      renderNode(currentNode);
    });

    if (buttonsToShow.length === 1) {
      button.classList.add("single-button");
    }

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