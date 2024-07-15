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
});
