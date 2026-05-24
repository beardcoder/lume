import { describe, expect, test } from "bun:test";
import { queryTemplate } from "../src/dom";

function makeEl(html: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div;
}

describe("queryTemplate", () => {
  test("returns a factory that clones template content", () => {
    const root = makeEl(`
      <template data-lume-part="item">
        <div class="item">Hello</div>
      </template>
    `);
    const createItem = queryTemplate(root, "item");
    const frag1 = createItem();
    const frag2 = createItem();
    expect(frag1).not.toBe(frag2);
    expect(frag1.querySelector(".item")).not.toBeNull();
  });

  test("throws if template not found", () => {
    const root = makeEl("<div></div>");
    expect(() => queryTemplate(root, "missing")).toThrow(
      'template "missing" not found'
    );
  });
});
