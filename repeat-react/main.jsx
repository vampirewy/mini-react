import React from "./src/React.js";
import ReactDOM from "./src/ReactDom.js";
import App from "./App.jsx";

// 目前还不支持 function component
ReactDOM.createRoot(document.querySelector("#root")).render(<App></App>);
