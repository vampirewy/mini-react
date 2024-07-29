import React from "./core/React.js";

let isShow = false;
function Count({ num }) {
  const update = React.update();
  // const foo = (
  //   <div>
  //     foo
  //     <div>child1</div>
  //     <div>child2</div>
  //   </div>
  // );

  const bar = <div>bar</div>;

  function handleClick() {
    isShow = !isShow;
    update();
  }

  return (
    <div>
      hello, {num}
      {isShow && bar}
      <button onClick={handleClick}>click</button>
      {/* <div>{isShowFoo ? foo : bar}</div> */}
    </div>
  );
}

function Foo() {
  console.log("Foo return");
  const update = React.update();
  function handleClick() {
    update();
  }
  return (
    <div>
      Foo,
      <button onClick={handleClick}>click</button>
    </div>
  );
}
function Bar() {
  console.log("Bar return");
  const update = React.update();
  function handleClick() {
    update();
  }
  return (
    <div>
      Bar,
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function App() {
  console.log("App return");
  const update = React.update();
  function handleClick() {
    update();
  }
  return (
    <div id="app">
      <div onClick={handleClick}>mini</div>
      <Foo></Foo>
      <Bar></Bar>
      <Count num={10}></Count>
    </div>
  );
}

export default App;
