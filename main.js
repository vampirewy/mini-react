// 1. 先按原生的写法生成 app 文本
// ReactDOM.createRoot(document.getElementById('root')).render(<App />)

const dom = document.createElement("div");
dom.id = "app";
document.body.appendChild(dom);

const textElement = document.createTextNode("app");
dom.appendChild(textElement);
