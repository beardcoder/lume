import { describe, expect, test } from "bun:test";
import { findLumeRoots, queryPart, queryParts } from "../src/dom";

function makeEl(html: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
}

describe("queryPart", () => {
  test("finds element by data-lume-part", () => {
    const root = makeEl(`<button data-lume-part="btn">Click</button>`);
    const el = queryPart(root, "btn");
    expect(el.tagName).toBe("BUTTON");
  });

  test("throws if not found", () => {
    const root = makeEl("<div></div>");
    expect(() => queryPart(root, "missing")).toThrow(
      'part "missing" not found'
    );
  });

  test("error message includes component name and id when present", () => {
    const root = document.createElement("div");
    root.setAttribute("data-lume", "menu");
    root.setAttribute("data-lume-id", "main");
    expect(() => queryPart(root, "missing")).toThrow("menu#main");
  });
});

describe("queryParts", () => {
  test("finds multiple elements", () => {
    const root = makeEl(`
      <li data-lume-part="item">A</li>
      <li data-lume-part="item">B</li>
    `);
    const items = queryParts(root, "item");
    expect(items.length).toBe(2);
  });

  test("returns empty array if none found", () => {
    const root = makeEl("<div></div>");
    expect(queryParts(root, "x")).toEqual([]);
  });
});

describe("findLumeRoots", () => {
  test("finds all data-lume elements", () => {
    const root = makeEl(`
      <div data-lume="menu"></div>
      <div data-lume="toast"></div>
    `);
    const roots = findLumeRoots(root);
    expect(roots.length).toBe(2);
  });
});
