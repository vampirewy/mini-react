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
// 保存根节点信息 work in process
let wipRoot = null;
// 创建一份新的 vdom
let currentRoot = null;
// 收集删除的
let deletions = [];
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  // 记录 #root 元素
  nextUnitOfWork = wipRoot;
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;

    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  // 第一次进入是 div 元素对应的数据
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}
function commitWork(fiber) {
  if (!fiber) return;
  // 递归添加子元素 及 兄弟元素
  // 第一次将 div 添加至他的父级元素
  let fiberParent = fiber.parent;
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
  return type !== "TEXT_ELEMENT" ? document.createElement(type) : document.createTextNode("");
}

function updateProps(dom, nextProps, prevProps) {
  // 1. old 有 new 没有，删除
  Object.keys(prevProps).forEach((prop) => {
    if (prop !== "children") {
      if (!(prop in nextProps)) {
        dom.removeAttribute(prop);
      }
    }
  });
  // 2. new 有 old 没有
  // 3. new 有 old 有
  Object.keys(nextProps).forEach((prop) => {
    if (prop !== "children") {
      if (nextProps[prop] !== prevProps[prop]) {
        if (prop.startsWith("on")) {
          const eventType = prop.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[prop]);
          dom.addEventListener(eventType, nextProps[prop]);
        } else {
          dom[prop] = nextProps[prop];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  // console.log("fiber---->", fiber);
  // 第一次进来的时候，#root的子元素是 div
  // 第二次进来的时候，是 div下面的 children,即两个 span
  // const children = fiber.props.children;
  let prevChild = null;
  // 第一次进来的时候是 div#app
  let oldFiber = fiber.alternate?.child;

  // 遍历 #root 的 props.children 数组
  // 遍历 div 的 props.children 数组
  children.forEach((child, index) => {
    let newFiber;
    const isSameType = oldFiber && oldFiber.type === child.type;
    if (isSameType) {
      // 目前只考虑更新 props
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: "update",
      };
    } else {
      // 这里新建一个对象是为了获取每一个元素的父级元素，同时不破坏原先设置的 vdom 的数据结构
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }
      oldFiber && deletions.push(oldFiber);
    }

    if (oldFiber) {
      // 第一次的时候，这个 sibling 是 null
      oldFiber = oldFiber.sibling;
    }
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
    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
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
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    // performUnitOfWork 会返回下一个任务的 obj
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 剩余时间小于 5ms 的话就退出
    shouldYield = deadline.timeRemaining() < 5;
  }
  // 当 nextUnitOfWork 没有值的时候，说明所有的任务都已经结束了
  if (!nextUnitOfWork && wipRoot) {
    // 这边执行，一次性将 dom 渲染至页面
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

// 等待浏览器空闲时，将需要执行的任务渲染至页面
// workLoop 是它的回调函数
requestIdleCallback(workLoop);

function update() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    // 备份一份旧的 vdom
    alternate: currentRoot,
  };
  // 记录 #wipRoot 元素
  nextUnitOfWork = wipRoot;
}
const React = {
  createElement,
  render,
  update,
};

export default React;
