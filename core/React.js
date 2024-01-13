function createChildEle(text) {
  return {
    type: "TEXT_ELEMENT",
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
      children: children.map((child) => (typeof child === "string" ? createChildEle(child) : child)),
    },
  };
}

// const App = createElement("div", { id: "app" }, createChildEle("hello"));
// const App = createElement("div", { id: "app" }, "hello", "-", "react");

function render(element, container) {
  const dom = element.type !== "TEXT_ELEMENT" ? document.createElement(element.type) : document.createTextNode("");

  Object.keys(element.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = element.props[prop];
    }
  });

  element.props.children.forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
}

const React = {
  createElement,
  render,
};

export default React;
