import React from "./core/React.js";

// useEffect 调用时机
// When your component is added to the DOM, React will run your setup function.
// 添加至 DOM 之后，浏览器渲染之前，执行 useEffect 函数

// Two situations, cleanup function will be called:
// 1. the dependencies changed, first run the cleanup function. 当依赖变化时，先运行 cleanup 函数
// 2. then run setup function. 然后更新视图

// 1. After your component is removed from the DOM, React will run your cleanup function.

function Foo({ num }) {
  const [count, setCount] = React.useState(10);
  const [str, setStr] = React.useState("bar");

  function handleClick() {
    setCount((c) => c + 1);
    setStr("bar");
  }

  React.useEffect(() => {
    console.log("init");
    return () => {
      console.log("cleanup1");
    };
  }, []);

  React.useEffect(() => {
    console.log("update");

    return () => {
      console.log("cleanup2");
    };
  }, [count]);

  return (
    <div>
      Foo,
      {num}
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
      <Foo num={10}></Foo>
    </div>
  );
}

export default App;
