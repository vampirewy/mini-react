const TEXT_ELEMENT = "TEXT_ELEMENT";
let nextUnitOfWork = null;

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
}

function performUnitOfWork(fiber) {
  // 第一次进来的时候不需要创建 dom， 因为是 div#root
  if (!fiber.dom) {
    const dom = (fiber.dom =
      fiber.type === TEXT_ELEMENT ? document.createTextNode("") : document.createElement(fiber.type));
    // 第二次进来的时候，将 div#root 第一个子元素 div#app 添加到 div#root 中
    fiber.parent.dom.appendChild(dom);

    Object.keys(fiber.props).forEach((prop) => {
      if (prop !== "children") {
        dom[prop] = fiber.props[prop];
      }
    });
  }

  const children = fiber.props.children;
  let prevChild = null;
  // 以下是将树结构处理成链表的结构
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
      // 绑定当前元素的第一个孩子节点
      // fiber.child, prevChild 都是指向一个对象
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    // 保存当前子结点
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
