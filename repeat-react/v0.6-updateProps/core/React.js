const TEXT_ELEMENT = "TEXT_ELEMENT";
// work in progress
let wipRoot = null;
let nextUnitOfWork = null;
let currentRoot = null;

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
  wipRoot = {
    dom: container,
    props: {
      children: [vdom],
    },
  };
  nextUnitOfWork = wipRoot;
  console.log("placement", wipRoot);
}

function commitRoot() {
  commitWork(wipRoot.child);
  // 在渲染完成之后，将整棵 DOM 树存储在 currentRoot 中
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;

  // 因为 Function Component 是没有 DOM, 所以需要一直找到它的上一级
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) {
      fiberParent.dom.appendChild(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // 1. old 有 new 没有，删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  /*   2. old 有 new 有，更新
  3. old 没有 new 有，新增 */
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);

          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  // 当调用 update 方法时，绑定新旧 vdom 树的关系
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  let newFiber;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: oldFiber.dom,
        child: null,
        sibling: null,
        alternate: oldFiber,
        effectTag: "update",
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: null,
        child: null,
        sibling: null,
        effectTag: "placement",
      };
    }

    // 新旧节点建立关系树
    // 这是一个 child 对象，如果它还有兄弟的话，应该是 child.sibling 了，即 oldFiber.sibling
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

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

  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;

  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }

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

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  window.requestIdleCallback(workLoop);
}

function start() {
  window.requestIdleCallback(workLoop);
}

// feat: update props
function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    // 关联老节点, 初始化时是 #root 节点对应的
    alternate: currentRoot,
  };
  console.log("update", wipRoot);
  // 最终渲染
  nextUnitOfWork = wipRoot;
}

start();

const React = {
  createElement,
  render,
  update,
};

export default React;
