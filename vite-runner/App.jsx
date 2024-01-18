import React from "./core/React.js";

// function CounterContainer() {
//   return <Counter></Counter>;
// }
// let count = 10;
// let prop = { id: "12313" };
let showBar = false;
function Counter() {
  const bar = <div>bar</div>;
  function Foo() {
    return <p>foo</p>;
  }

  function handleClick() {
    showBar = !showBar;
    // count++;
    // prop = {};
    React.update();
  }
  return (
    <div>
      Counter
      <div id="123">{showBar ? <Foo></Foo> : bar}</div>
      {/* count: {count} */}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      {/* hi-mini-react */}
      {/* <CounterContainer></CounterContainer> */}
      <Counter></Counter>
      {/* <Counter num={30}></Counter> */}
    </div>
  );
}

export default App;
