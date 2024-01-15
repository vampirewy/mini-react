import React from "./src/React";

// const App = React.createElement("div", { id: "app" }, "hi", "mini", "react");

const App = <div id="app">hi-mini-react</div>;

// function AppOne() {
//   return <div id="app">hi-mini-react</div>;
// }

// console.log(AppOne);
// AppOne() {
// 这边实际调用的是自己写的 React.createElement 方法
// return /* @__PURE__ */ React.createElement("div", { id: "app" }, "hi-mini-react");
// }
export default App;
