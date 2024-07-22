import React from "./core/React.js";

function Count({ num }) {
  function handleClick() {
    console.log(111);
  }
  return (
    <div>
      hello, {num}
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
