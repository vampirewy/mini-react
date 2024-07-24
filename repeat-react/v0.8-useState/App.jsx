import React from "./core/React.js";

function Foo() {
  const [count, setCount] = React.useState(10);
  const [str, setStr] = React.useState("bar");

  function handleClick() {
    setCount((c) => c + 1);
    setStr("bar");
  }

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
