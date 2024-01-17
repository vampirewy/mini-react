const TEXT_ELEMENT = "TEXT_ELEMENT";
let nextOfUnitWork = null;
// 保存 div#root 节点信息
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
      children: children.map((c) => {
        const type = typeof c === "string" || typeof c === "number";
        return type ? createChild(c) : c;
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
  root = nextOfUnitWork;
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
      child: null,
      parent: fiber,
      dom: null,
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

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  let isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;

  let newFiber = fiber;
  while (newFiber) {
    if (newFiber.sibling) return newFiber.sibling;

    newFiber = newFiber.parent;
  }
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}
function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.dom) {
    fiberParent.dom.appendChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextOfUnitWork) {
    nextOfUnitWork = performUnitOfWork(nextOfUnitWork);
    shouldYield = deadline.timeRemaining() < 10;
  }
  // 统一提交渲染至页面
  if (!nextOfUnitWork && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
