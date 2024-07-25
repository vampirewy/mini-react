import React from "./core/React.js";

// useEffect 调用时机
// 在 DOM 渲染之后， 浏览器绘制之前
function Foo() {
  const [count, setCount] = React.useState(10);
  const [str, setStr] = React.useState("bar");

  function handleClick() {
    setCount((c) => c + 1);
    setStr("bar");
  }

  React.useEffect(() => {
    console.log("init");
  }, []);

  React.useEffect(() => {
    console.log("update");
  }, [count]);

  return (
    <div>
      Foo,
      {count}
      <br></br>
      {str}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <div>mini</div>
      <Foo></Foo>
    </div>
  );
}

export default App;
