function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield) {
    // timeRemaining 表示浏览器还剩余闲置多少时间
    shouldYield = deadline.timeRemaining() < 1;
  }
  // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
