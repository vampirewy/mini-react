import ReactDOM from "./core/ReactDom.js";
import React from "./core/React.js";

const App = React.createElement("div", { id: "app" }, "hello", "-mini-", "react");

ReactDOM.createRoot(document.querySelector("#root")).render(App);
