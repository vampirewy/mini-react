function createChild(text) {
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
      children: children.map((c) => {
        return typeof c === "string" ? createChild(c) : c;
      }),
    },
  };
}

function render(element, container) {
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);

  Object.keys(element.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = element.props[prop];
    }
  });

  const children = element.props.children;
  children.forEach((c) => {
    render(c, dom);
  });
  container.appendChild(dom);
}

const React = {
  createElement,
  render,
};

export default React;
