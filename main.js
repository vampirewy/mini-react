import React from "./core/React.js";
import ReactDOM from "./core/ReactDom.js";

const App = React.createElement(
  "div",
  { id: "app" },
  React.createElement("div", { className: "child1" }, "hello"),
  React.createElement("div", { className: "child2" }, "mini"),
  React.createElement("div", { className: "child3" }, "react")
);

ReactDOM.createRoot(document.querySelector("#root")).render(App);
