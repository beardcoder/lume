import { describe, expect, mock, test } from "bun:test";
import { createLume } from "../src/app";
import { defineComponent } from "../src/component";

function setupDOM(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body;
}

describe("createLume", () => {
  test("mounts a component and exposes API via id", () => {
    setupDOM(`
      <div data-lume="counter" data-lume-id="main-counter">
        <span data-lume-part="count">0</span>
      </div>
    `);

    const counter = defineComponent(({ part, signal, effect }) => {
      const count = signal(0);
      const display = part("count");
      effect(() => {
        display.textContent = String(count());
      });
      return {
        increment() {
          count.update((v) => v + 1);
        },
        value() {
          return count();
        },
      };
    });

    const app = createLume();
    app.component("counter", counter).mount();

    const api = app.require<{ increment(): void; value(): number }>(
      "main-counter"
    );
    expect(api.value()).toBe(0);
    api.increment();
    expect(api.value()).toBe(1);
  });

  test("get returns undefined for unknown id", () => {
    const app = createLume();
    app.mount(document.createElement("div"));
    expect(app.get("nope")).toBeUndefined();
  });

  test("require throws for unknown id", () => {
    const app = createLume();
    app.mount(document.createElement("div"));
    expect(() => app.require("nope")).toThrow("nope");
  });

  test("unmount cleans up", () => {
    setupDOM(`<div data-lume="widget" data-lume-id="w1"></div>`);
    const widget = defineComponent(() => ({ name: "widget" }));
    const app = createLume();
    app.component("widget", widget).mount();
    expect(app.get("w1")).toBeDefined();
    app.unmount();
    expect(app.get("w1")).toBeUndefined();
  });

  test("use calls plugin with app", () => {
    const app = createLume();
    const plugin = mock((a: unknown) => {
      expect(a).toBe(app);
    });
    app.use(plugin);
    expect(plugin).toHaveBeenCalled();
  });

  test("local emit and listen", () => {
    const app = createLume();
    const handler = mock();
    app.listen("test-event", handler);
    app.emit("test-event", { foo: "bar" });
    expect(handler).toHaveBeenCalledWith({ foo: "bar" });
  });

  test("component chaining returns app", () => {
    const app = createLume();
    const comp = defineComponent(() => ({}));
    const result = app.component("a", comp).component("b", comp);
    expect(result).toBe(app);
  });
});
