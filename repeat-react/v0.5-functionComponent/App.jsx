import React from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "hi", "mini", "react");
// function App() {
//   return (
//     <div id="app">
//       <div id="123">hello</div>
//     </div>
//   );

//   // App() {
//   //   return /* @__PURE__ */ React.createElement("div", { id: "app" }, /* @__PURE__ */ React.createElement("div", { id: "123" }, "hello"));
//   // }
// }
function Count({ num }) {
  return <div>hello, {num}</div>;
}

function CountContainer() {
  return (
    <div>
      <Count num={10}></Count>
      <Count num={20}></Count>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <div>mini</div>
      <CountContainer></CountContainer>
      {/* <Count num={10}></Count>
      <Count num={20}></Count> */}
    </div>
  );
}

export default App;
