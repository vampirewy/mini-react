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
        const isTextNode = typeof child === "string" || typeof child === "number";
        return isTextNode ? createChild(child) : child;
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
  let fiberParent = fiber.parent;

  // 因为 Function Component 是没有 DOM, 所以需要一直找到它的上一级
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.appendChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = props[prop];
    }
  });
}

function initChildren(fiber, children) {
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
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type));
      updateProps(dom, fiber.props);
    }
  }

  const children = isFunctionComponent ? [fiber.type(fiber.props)] : fiber.props.children;

  initChildren(fiber, children);

  if (fiber.child) return fiber.child;

  // 如果父级的sibling不存在，则再往上找它的parent的sibling, 其实循环主要是为了Function Component
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
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
