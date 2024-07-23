import React from "./core/React.js";

let isShow = false;
function Count({ num }) {
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
    React.update();
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

function App() {
  return (
    <div id="app">
      <div>mini</div>
      <Count num={10}></Count>
    </div>
  );
}

export default App;
