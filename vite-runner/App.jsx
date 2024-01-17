import React from "./core/React.js";

function CounterContainer() {
  return <Counter></Counter>;
}
let count = 10;
let prop = { id: "12313" };
function Counter({ num }) {
  function handleClick() {
    count++;
    prop = {};
    React.update();
  }
  return (
    <div {...prop}>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      hi-mini-react
      {/* <CounterContainer></CounterContainer> */}
      {/* <Counter num={10}></Counter> */}
      <Counter num={30}></Counter>
    </div>
  );
}

export default App;
