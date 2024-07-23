import React from "./core/React.js";

let isShowFoo = true;
function Count({ num }) {
  function Foo() {
    return <div>foo</div>;
  }

  function Bar() {
    return <p>bar</p>;
  }

  function handleClick() {
    isShowFoo = !isShowFoo;
    React.update();
  }

  return (
    <div>
      hello, {num}
      <div>{isShowFoo ? <Foo></Foo> : <Bar></Bar>}</div>
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
