import { describe, expect, it } from "vitest";
import React from "../React.js";

describe("react", () => {
  it("create element when children node is string", () => {
    const { createElement } = React;

    const el = createElement("div", { id: "app" }, "hello", "react");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello",
              },
              "type": "TEXT_ELEMENT",
            },
            {
              "props": {
                "children": [],
                "nodeValue": "react",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `);
  });

  it("create element when children node is object", () => {
    const { createElement } = React;

    const el = createElement(
      "div",
      { id: "app" },
      {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: "hi",
          children: [
            {
              type: "TEXT_ELEMENT",
              props: {
                nodeValue: "hello",
                children: [],
              },
            },
          ],
        },
      }
    );

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [
                  {
                    "props": {
                      "children": [],
                      "nodeValue": "hello",
                    },
                    "type": "TEXT_ELEMENT",
                  },
                ],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `);
  });

  it("render element to the screen", () => {
    const rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);

    const { createElement, render } = React;

    // const el = createElement("div", { id: "app" }, "hello", "-mini", "-react");

    const el = createElement(
      "div",
      { id: "app" },
      createElement("div", { className: "child1" }, "hello", "-mini", "-react"),
      createElement("div", { className: "child2" }, "hello", "-mini", "-react"),
      createElement("div", { className: "child3" }, "hello", "-mini", "-react")
    );

    render(el, document.getElementById("root"));

    expect(document.body.innerHTML).toMatchInlineSnapshot(
      `"<div id="root"><div id="app"><div class="child1">hello-mini-react</div><div class="child2">hello-mini-react</div><div class="child3">hello-mini-react</div></div></div>"`
    );
  });
});
