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

// 设置当前任务
let fiber = null;
function render(element, container) {
  // 第一次 fiber值:
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
  fiber = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

let shouldYield = false;
function createDom(type) {
  return type !== "TEXT_ELEMENT" ? document.createElement(type) : document.createTextNode("");
}

function updateProps(dom, props) {
  Object.keys(props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = props[prop];
    }
  });
}

function initChildren() {
  // 第一次进来的时候，#root的子元素是 div
  // 第二次进来的时候，是 div下面的 children,即两个 span
  const children = fiber.props.children;
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

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    fiber.parent.dom.appendChild(dom);

    updateProps(dom, fiber.props);
  }

  initChildren();

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}
function workLoop(deadline) {
  while (!shouldYield && fiber) {
    // performUnitOfWork 会返回下一个任务的 obj
    fiber = performUnitOfWork(fiber);
    // 剩余时间小于 5ms 的话就退出
    shouldYield = deadline.timeRemaining() < 5;
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
