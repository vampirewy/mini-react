import React from "./core/React.js";

// let count = 10;
// function Counter() {
//   console.log("return Counter");
//   // const bar = <div>bar</div>;
//   // const foo = (
//   //   <div>
//   //     foo
//   //     <div>child1</div>
//   //     <div>child2</div>
//   //   </div>
//   // );
//   // function Foo() {
//   //   return (
//   //     <div>
//   //       foo
//   //       <div>child1</div>
//   //       <div>child2</div>
//   //     </div>
//   //   );
//   // }

//   const update = React.update();
//   function handleClick() {
//     // showBar = !showBar;
//     count++;
//     // prop = {};
//     update();
//   }
//   return (
//     <div>
//       Counter: {count}
//       {/* <div id="123">{showBar ? foo : bar}</div> */}
//       {/* count: {count} */}
//       {/* {showBar && bar} */}
//       <button onClick={handleClick}>click</button>
//     </div>
//   );
// }
// let counter1 = 10;
function Bar() {
  console.log("return Bar");
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState("bar");
  // const update = React.update();
  function handleClick() {
    setCount((c) => c + 1);
    setBar((bar) => bar + "bar");
    // counter1++;
    // update();
  }

  // 调用时机在 dom 渲染完成，浏览器完成绘制之前
  // useEffect 的 cleanup 是在 useEffect 之前里进行调用，当 deps 为空的时候不会调用 cleanup
  React.useEffect(() => {
    console.log("effect-->init");
    return () => {
      console.log("不应该被 cleanup");
    };
  }, []);

  React.useEffect(() => {
    console.log("update", count);
    return () => {
      console.log("应该被 cleanup");
    };
  }, [count]);

  React.useEffect(() => {
    console.log("update", bar);
    return () => {
      console.log("应该被 cleanup");
    };
  }, [bar]);
  return (
    <div>
      <div title="count">{count}</div>
      <div title="bar">{bar}</div>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countApp = 10;
function App() {
  console.log("App return");
  return (
    <div id="app">
      hi-mini-react
      {/* <button onClick={handleClick}>click</button> */}
      {/* <CounterContainer></CounterContainer> */}
      {/* <Counter></Counter> */}
      <Bar></Bar>
      {/* <Counter num={30}></Counter> */}
    </div>
  );
}

export default App;
