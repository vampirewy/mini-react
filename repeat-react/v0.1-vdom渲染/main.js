const TEXT_ELEMENT = "TEXT_ELEMENT";
function createChild(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createChild(child) : child;
      }),
    },
  };
}
function render(vdom, container) {
  const dom = vdom.type !== TEXT_ELEMENT ? document.createElement(vdom.type) : document.createTextNode("");

  Object.keys(vdom.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = vdom.props[prop];
    }
  });

  vdom.props.children.forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
}

const App = createElement("div", { id: "app" }, "hi-", "mini-", "react");
// const App = createElement("div", { id: "app" }, createChild("hi"), createChild("mini"));
render(App, document.querySelector("#root"));
