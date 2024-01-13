function createElement(el, props, ...children) {
  const dom = document.createElement(el);

  Object.keys(props).forEach((key) => {
    dom[key] = props[key];
  });

  children.forEach((child) => {
    if (typeof child === "string") {
      return dom.appendChild(document.createTextNode(child));
    }
    const elChild = document.createTextNode("");
    Object.keys(child.props).forEach((son) => {
      elChild[son] = child.props[son];
    });
    dom.appendChild(elChild);
  });
  return dom;
}

const App = createElement("div", { id: "app" }, "hello", "-", "mini-react");

function render(App, container) {
  return container.appendChild(App);
}

const ReactDOM = {
  createRoot(container) {
    return {
      render(App) {
        render(App, container);
      },
    };
  },
};

ReactDOM.createRoot(document.querySelector("#root")).render(App);

// document.querySelector("#root").appendChild(createElement("div", { id: "app" }, "string", "hello"));
// document
//   .querySelector("#root")
//   .appendChild(
//     createElement(
//       "div",
//       { id: "app" },
//       { type: "TEXT_ELEMENT", props: { nodeValue: "mini", children: [] } },
//       { type: "TEXT_ELEMENT", props: { nodeValue: "hello", children: [] } }
//     )
//   );
