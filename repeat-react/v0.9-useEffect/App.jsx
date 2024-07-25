import React from "./core/React.js";

// useEffect 调用时机
// When your component is added to the DOM, React will run your setup function.
// Two situations:
// 1. the dependencies changed, first run the cleanup function. 当依赖变化时，先运行 cleanup 函数
// 2. then run setup function. 然后更新视图

// 1. After your component is removed from the DOM, React will run your cleanup function.

function Foo() {
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
