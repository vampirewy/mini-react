import React from "./core/React.js";

// function CounterContainer() {
//   return <Counter></Counter>;
// }
let count = 10;
// let prop = { id: "12313" };
// let showBar = false;
function Counter() {
  console.log("return Counter");
  // const bar = <div>bar</div>;
  // const foo = (
  //   <div>
  //     foo
  //     <div>child1</div>
  //     <div>child2</div>
  //   </div>
  // );
  // function Foo() {
  //   return (
  //     <div>
  //       foo
  //       <div>child1</div>
  //       <div>child2</div>
  //     </div>
  //   );
  // }

  const update = React.update();
  function handleClick() {
    // showBar = !showBar;
    count++;
    // prop = {};
    update();
  }
  return (
    <div>
      Counter: {count}
      {/* <div id="123">{showBar ? foo : bar}</div> */}
      {/* count: {count} */}
      {/* {showBar && bar} */}
      <button onClick={handleClick}>click</button>
    </div>
  );
}
let counter1 = 10;
function Bar() {
  console.log("return Bar");

  const update = React.update();
  function handleClick() {
    counter1++;
    update();
  }
  return (
    <div>
      Bar: {counter1}
      {/* <div id="123">{showBar ? foo : bar}</div> */}
      {/* count: {count} */}
      {/* {showBar && bar} */}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countApp = 10;
function App() {
  console.log("App return");
  const update = React.update();
  function handleClick() {
    countApp++;
    update();
  }
  return (
    <div id="app">
      hi-mini-react
      <button onClick={handleClick}>click</button>
      {/* <CounterContainer></CounterContainer> */}
      <Counter></Counter>
      <Bar></Bar>
      {/* <Counter num={30}></Counter> */}
    </div>
  );
}

export default App;
