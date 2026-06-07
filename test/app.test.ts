import { describe, expect, mock, test } from "bun:test";
import { createLume } from "../src/app";
import { defineComponent } from "../src/component";
import { signal } from "../src/reactivity";

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

  test("unmount disposes effects and event listeners", () => {
    setupDOM(`
      <div data-lume="probe" data-lume-id="p1">
        <button data-lume-part="btn">x</button>
      </div>
    `);

    const effectRuns: number[] = [];
    const clickHandler = mock();

    const probe = defineComponent(({ part, signal, effect, on, cleanup }) => {
      const count = signal(0);
      effect(() => {
        effectRuns.push(count());
      });
      on(part("btn"), "click", clickHandler);
      cleanup(() => effectRuns.push(-1));
      return {
        bump: () => count.update((v) => v + 1),
      };
    });

    const app = createLume();
    app.component("probe", probe).mount();

    const api = app.require<{ bump(): void }>("p1");
    api.bump();
    expect(effectRuns).toEqual([0, 1]);

    const btn = document.querySelector<HTMLButtonElement>(
      "[data-lume-part=btn]"
    );
    btn?.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);

    app.unmount();

    api.bump();
    expect(effectRuns).toEqual([0, 1, -1]);
    btn?.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  test("unmount disposes computed derived from an external signal", () => {
    setupDOM(`<div data-lume="derived" data-lume-id="d1"></div>`);

    // A signal that outlives the component (e.g. app-level state).
    const source = signal(0);
    let derivations = 0;

    const derived = defineComponent(({ computed }) => {
      const doubled = computed(() => {
        derivations++;
        return source() * 2;
      });
      return { read: () => doubled() };
    });

    const app = createLume();
    app.component("derived", derived).mount();

    const api = app.require<{ read(): number }>("d1");
    expect(api.read()).toBe(0);
    source.set(1);
    expect(derivations).toBe(2);

    app.unmount();
    source.set(2);
    // The computed's internal effect must not re-run after unmount.
    expect(derivations).toBe(2);
  });

  test("duplicate id throws on mount", () => {
    setupDOM(`
      <div data-lume="w" data-lume-id="dup"></div>
      <div data-lume="w" data-lume-id="dup"></div>
    `);
    const w = defineComponent(() => ({}));
    const app = createLume();
    app.component("w", w);
    expect(() => app.mount()).toThrow('Duplicate component id "dup"');
  });

  test("global bus is shared across apps", () => {
    const a = createLume();
    const b = createLume();
    const handler = mock();
    b.global.listen("ping", handler);
    a.global.emit("ping", { from: "a" });
    expect(handler).toHaveBeenCalledWith({ from: "a" });
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
