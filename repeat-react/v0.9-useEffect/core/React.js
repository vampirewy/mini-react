const TEXT_ELEMENT = "TEXT_ELEMENT";
// work in progress
let wipRoot = null;
let nextUnitOfWork = null;
let currentRoot = null;
// 需要删除的老节点列表
let deletions = [];
// Save current function component information
let wipFiber = null;
// Collect all of effect hooks
let effectHooks;

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
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;

    // 因为 Function Component 是没有 DOM, 所以需要一直找到它的上一级
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }

    fiberParent.dom.removeChild(fiber.dom);
  } else {
    // Function Component 不存在 dom 属性，而实际要删除的是它的 child 节点
    commitDeletion(fiber.child);
  }
}

function commitRoot() {
  // 在渲染之前，先遍历删除收集起来的节点列表
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  commitEffectHooks();
  // 在渲染完成之后，将整棵 DOM 树存储在 currentRoot 中
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitEffectHooks() {
  function run(fiber) {
    if (!fiber) return;
    if (!fiber.alternate) {
      // init effect
      fiber?.effectHooks?.forEach((hook) => {
        hook.callback();
      });
    } else {
      // update effect
      fiber?.effectHooks?.forEach((newHook, index) => {
        let oldEffectHook = fiber.alternate.effectHooks[index];

        const needUpdate = newHook.deps.some((newDep, i) => {
          return newDep !== oldEffectHook.deps[i];
        });

        needUpdate && newHook.callback();
      });
    }

    run(fiber.child);
    run(fiber.sibling);
  }

  run(wipRoot);
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
  children.forEach((child, index) => {
    let newFiber;
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
      // 有可能它的初始值为isShow = false,不能渲染, {isShow && bar}
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

      // 当两个节点 type 不一致时，先收集需要删除的旧节点信息
      if (oldFiber) {
        deletions.push(oldFiber);
        // Collect all of effect hooks
      }
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
    // 当 newFiber 有值的时候，才去存储当前对象
    // 有可能它为 undefined, {isShow && bar}
    if (newFiber) {
      prevChild = newFiber;
    }
  });

  // the new vdom is less than the old, so we need to collect the olds that need to be deleted
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  // save the function component information
  wipFiber = fiber;
  stateHookIndex = 0;
  stateHooks = [];
  effectHooks = [];
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
    // 如果 nextUnitOfWork 返回的对象和 wipRoot.sibling.type 一样，说明下一个组件不需要更新
    // 1.初始化 update 方法时已保存了每个组件的信息,同时返回一个闭包，等待调用
    // 2.当触发 Foo 组件的点击事件(即 update 方法返回的函数)时, 在 update 方法中，wipRoot 和 nextUnitOfWork 的指针都是指向同一个对象
    // 3.当开始执行 performUnitOfWork 方法时，当 Foo 组件执行完成时，它会判断它的兄弟是不是与即将执行的组件类型一致，如果一致说明不用更新这个组件
    if (nextUnitOfWork?.type === wipRoot?.sibling?.type) {
      nextUnitOfWork = undefined;
    }
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

// 已废弃
function update() {
  let currentFiber = wipFiber;

  return () => {
    wipRoot = {
      ...currentFiber,
      // 关联当前 Function Component 信息
      alternate: currentFiber,
    };

    nextUnitOfWork = wipRoot;
  };
}

// Save all state information
let stateHooks;
// Save the current state index
let stateHookIndex;
// state 发生变化后，整个组件会更新，又会调用 useState 方法
function useState(initial) {
  let currentFiber = wipFiber;
  let oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  stateHook.queue.forEach((action) => {
    stateHook.state = typeof action === "function" ? action(stateHook.state) : action;
  });

  stateHook.queue = [];
  stateHooks.push(stateHook);
  currentFiber.stateHooks = stateHooks;
  stateHookIndex++;

  function setState(action) {
    // compare the old state and the new state
    const eagerState = typeof action === "function" ? action(stateHook.state) : action;
    if (eagerState === stateHook.state) return;
    // Collect all of callbacks
    stateHook.queue.push(action);

    // 这里就是原来的 update 方法
    wipRoot = {
      ...currentFiber,
      // 关联当前需要更新的 Function Component 信息
      alternate: currentFiber,
    };

    nextUnitOfWork = wipRoot;
  }

  return [stateHook.state, setState];
}

function useEffect(callback, deps) {
  const effectHook = {
    callback,
    deps,
  };

  effectHooks.push(effectHook);
  wipFiber.effectHooks = effectHooks;
}

start();

const React = {
  createElement,
  render,
  useState,
  useEffect,
};

export default React;
