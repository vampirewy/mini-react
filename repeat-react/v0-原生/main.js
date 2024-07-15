// 原生实现将 dom 元素添加至页面

const div = document.createElement("div");
div.id = "app";

const el = document.createTextNode("");
el.nodeValue = "hello world";

div.appendChild(el);

document.querySelector("#root").appendChild(div);
