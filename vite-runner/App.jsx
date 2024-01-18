import React from "./core/React.js";

// function CounterContainer() {
//   return <Counter></Counter>;
// }
// let count = 10;
// let prop = { id: "12313" };
let showBar = false;
function Counter() {
  const bar = <div>bar</div>;
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  );
  // function Foo() {
  //   return (
  //     <div>
  //       foo
  //       <div>child1</div>
  //       <div>child2</div>
  //     </div>
  //   );
  // }

  function handleClick() {
    showBar = !showBar;
    // count++;
    // prop = {};
    React.update();
  }
  return (
    <div>
      Counter
      {/* <div id="123">{showBar ? foo : bar}</div> */}
      {/* count: {count} */}
      {showBar && bar}
      <button onClick={handleClick}>showBar</button>
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
