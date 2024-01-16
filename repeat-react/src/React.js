const TEXT_ELEMENT = "TEXT_ELEMENT";
let nextOfUnitWork = null;
let shouldYield = false;

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
      children: children.map((c) => {
        return typeof c === "string" ? createChild(c) : c;
      }),
    },
  };
}

function render(element, container) {
  nextOfUnitWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom =
      fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type));

    fiber.parent.dom.appendChild(dom);

    Object.keys(fiber.props).forEach((prop) => {
      if (prop !== "children") {
        dom[prop] = fiber.props[prop];
      }
    });
  }

  const children = fiber.props.children;
  let prevChild = null;

  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: nextOfUnitWork,
      dom: null,
      sibling: null,
    };

    if (index === 0) {
      nextOfUnitWork.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
  if (nextOfUnitWork.child) return nextOfUnitWork.child;
  if (nextOfUnitWork.sibling) return nextOfUnitWork.sibling;
  return nextOfUnitWork.parent?.sibling;
}

function workLoop(deadline) {
  while (!shouldYield && nextOfUnitWork) {
    nextOfUnitWork = performUnitOfWork(nextOfUnitWork);
    shouldYield = deadline.timeRemaining() < 10;
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
