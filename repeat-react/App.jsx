import React from "./src/React";

// const App = React.createElement("div", { id: "app" }, "hi", "mini", "react");

// const App = (
//   <div id="app">
//     hi-mini-react
//     {/* <text>hi</text>
//     <text>mini</text> */}
//     {/* <Counter></Counter> */}
//     <CounterContainer></CounterContainer>
//   </div>
// );
// console.log("App--->", App);
// function AppOne() {
//   return <div id="app">hi-mini-react</div>;
// }

// console.log(AppOne);
// AppOne() {
// 这边实际调用的是自己写的 React.createElement 方法
// return /* @__PURE__ */ React.createElement("div", { id: "app" }, "hi-mini-react");
// }
function CounterContainer() {
  return <Counter></Counter>;
}
function Counter({ num }) {
  return <div>counter: {num}</div>;
}
function App() {
  return (
    <div id="app">
      hi-mini-react
      <Counter num={19}></Counter>
      <Counter num={29}></Counter>
    </div>
  );
}
export default App;
