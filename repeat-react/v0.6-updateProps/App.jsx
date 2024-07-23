import React from "./core/React.js";

// 这两个变量在外面是因为当触发 React.update 的时候，vdom 得重新走一遍
let count = 10;
let props = { id: "id" };
function Count({ num }) {
  function handleClick() {
    count++;
    props = {};
    React.update();
  }

  return (
    <div {...props}>
      hello, {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <div>mini</div>
      <Count num={10}></Count>
    </div>
  );
}

export default App;
