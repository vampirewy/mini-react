import React from "./core/React.js";

function CounterContainer() {
  return <Counter></Counter>;
}
function Counter({ num }) {
  return <div>count: {num}</div>;
}

function App() {
  return (
    <div id="app">
      hi-mini-react
      {/* <CounterContainer></CounterContainer> */}
      <Counter num={10}></Counter>
      <Counter num={30}></Counter>
    </div>
  );
}

export default App;
