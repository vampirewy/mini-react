# mini-react

1. 先用原生实现如何将一个 dom 元素渲染至页面

```javascript
const divElement = document.createElement("div");
divElement.id = "app";

document.querySelector("#root").appendChild(divElement);

const textNodeEL = document.createTextNode("");
textNodeEL.nodeValue = "mini-react";

divElement.appendChild(textNodeEL);
```

2. 寻找原生创建法的共性

```javascript
/** react 将 virtual-dom 处理后渲染至页面
 * 1. 生成节点，节点的类型是动态的
 * 2. 都有一个属性: div 是 id = app , textNode 是 nodeValue = 'mini-react'
 * 3. 最后让自己的父元素把自己添加进去，最终渲染到页面上
 */
const childElement = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "mini-react",
    children: [],
  },
};

const element = {
  type: "div",
  props: {
    id: "app",
    children: [childElement],
  },
};

const divEl = document.createElement(element.type);
divEl.id = element.props.id;

document.querySelector("#root").appendChild(divEl);

const textNodeEl = document.createTextNode("");
textNodeEl.nodeValue = childElement.props.nodeValue;

divEl.appendChild(textNodeEl);
```

3. 再次优化 2 的内容

```javascript
/** 是不是可以转换成
 * createElement('div',{ id: 'app' }, 'hi','mini','react')
 * createElement('div',{ id: 'app' }, {type:'TEXT_ELEMENT',props:{ nodeValue:'mini-react', children:[] }})
 */
function createChild(text) {
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
      children: children.map((c) => {
        return typeof c === "string" ? createChild(c) : c;
      }),
    },
  };
}
// React 创建的本质就是这个
const App = createElement("div", { id: "app" }, "hi", "mini", "react");
// 使用递归去创建 vdom
function render(element, container) {
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);

  Object.keys(element.props).forEach((prop) => {
    if (prop !== "children") {
      dom[prop] = element.props[prop];
    }
  });

  const children = element.props.children;
  children.forEach((c) => {
    render(c, dom);
  });
  container.appendChild(dom);
}

render(App, document.querySelector("#root"));
```

4. 变更形状，与 React 保持一致(详见 repeat-react)
