const TEXT_ELEMENT = "TEXT_ELEMENT";
let nextUnitOfWork = null;
let root = null;

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
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [vdom],
    },
  };
  root = nextUnitOfWork;
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  fiber.parent.dom.appendChild(fiber.dom);

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom =
      fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type));

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
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });

  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;
  return fiber.parent?.sibling;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 50;
  }

  if (!nextUnitOfWork && root) {
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}

function start() {
  window.requestIdleCallback(workLoop);
}

start();

const React = {
  createElement,
  render,
};

export default React;
