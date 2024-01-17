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
      children: children.map((child) => {
        const isTextNode = typeof child === "string" || typeof child === "number";
        return isTextNode ? createChildEle(child) : child;
      }),
    },
  };
}

// const App = createElement("div", { id: "app" }, createChildEle("hello"));
// const App = createElement("div", { id: "app" }, "hello", "-", "react");

// 设置当前任务
let nextUnitOfWork = null;
// 保存根节点信息
let root = null;
function render(element, container) {
  // 第一次 nextUnitOfWork值:
  // { dom: div#root,
  //   props: {
  //   children: [
  //     {
  //       props: {
  //         children: [
  //           {
  //             props: {
  //               children: [],
  //               nodeValue: "hello",
  //             },
  //             type: "TEXT_ELEMENT",
  //           },
  //           {
  //             props: {
  //               children: [],
  //               nodeValue: "react",
  //             },
  //             type: "TEXT_ELEMENT",
  //           },
  //           {
  //             props: {
  //               children: [],
  //               nodeValue: "mini",
  //             },
  //             type: "TEXT_ELEMENT",
  //           },
  //         ],
  //         id: "app",
  //       },
  //       type: "div",
  //     },
  //   ],
  // }}
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
  // 记录 #root 元素
  root = nextUnitOfWork;
}

function commitRoot() {
  // 第一次进入是 div 元素对应的数据
  commitWork(root.child);
  root = null;
}
function commitWork(fiber) {
  if (!fiber) return;
  // 递归添加子元素 及 兄弟元素
  // 第一次将 div 添加至他的父级元素
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

let shouldYield = false;
function createDom(type) {
  return type !== "TEXT_ELEMENT" ? document.createElement(type) : document.createTextNode("");
}

function updateProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== "children") {
      if (prop.startsWith("on")) {
        const eventType = prop.slice(2).toLowerCase();
        dom.addEventListener(eventType, props[prop]);
      }
      dom[prop] = props[prop];
    }
  });
}

function initChildren(fiber, children) {
  // console.log("fiber---->", fiber);
  // 第一次进来的时候，#root的子元素是 div
  // 第二次进来的时候，是 div下面的 children,即两个 span
  // const children = fiber.props.children;
  let prevChild = null;
  // 遍历 #root 的 props.children 数组
  // 遍历 div 的 props.children 数组
  children.forEach((child, index) => {
    // 这里新建一个对象是为了获取每一个元素的父级元素，同时不破坏原先设置的 vdom 的数据结构
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      // 当第一个数据进来的时候, 这个赋值给 fiber.child
      // 当第一个 span 进来的时候，将这个数据赋值给 prevChild
      fiber.child = newFiber;
    } else {
      // 当第二个 span 进来的时候，因为 javascript 对象引用的是地址，而非真实对象，所以当把 preChild[sibling]赋值的时候，同样也是给 fiber.child[sibling]赋值，所以 fiber 的 child 里会有 sibling 属性
      prevChild.sibling = newFiber;
    }
    // 然后再将这个数据保持下来
    // 第二次将下标为 0 的 span 里的数据赋值给 prevChild
    // 第三次将下标为 1 的 span 里的数据赋值给 prevChild
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
  const isFunctionComponent = typeof fiber.type === "function";

  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let newFiber = fiber;
  while (newFiber) {
    if (newFiber.sibling) return newFiber.sibling;
    newFiber = newFiber.parent;
  }
}
function workLoop(deadline) {
  while (!shouldYield && nextUnitOfWork) {
    // performUnitOfWork 会返回下一个任务的 obj
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 剩余时间小于 5ms 的话就退出
    shouldYield = deadline.timeRemaining() < 5;
  }
  // 当 nextUnitOfWork 没有值的时候，说明所有的任务都已经结束了
  if (!nextUnitOfWork && root) {
    // 这边执行，一次性将 dom 渲染至页面
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

// 等待浏览器空闲时，将需要执行的任务渲染至页面
// workLoop 是它的回调函数
requestIdleCallback(workLoop);

const React = {
  createElement,
  render,
};

export default React;
