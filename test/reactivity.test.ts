import { describe, expect, test } from "bun:test";
import { batch, computed, effect, signal } from "../src/reactivity";

describe("signal", () => {
  test("returns initial value", () => {
    const s = signal(42);
    expect(s()).toBe(42);
  });

  test("set updates the value", () => {
    const s = signal(0);
    s.set(10);
    expect(s()).toBe(10);
  });

  test("update transforms value", () => {
    const s = signal(5);
    s.update((v) => v * 2);
    expect(s()).toBe(10);
  });

  test("set with same value does not trigger effect", () => {
    const s = signal(1);
    let count = 0;
    effect(() => {
      s();
      count++;
    });
    expect(count).toBe(1);
    s.set(1);
    expect(count).toBe(1);
  });
});

describe("effect", () => {
  test("runs immediately", () => {
    let ran = false;
    effect(() => {
      ran = true;
    });
    expect(ran).toBe(true);
  });

  test("reruns when signal changes", () => {
    const s = signal(0);
    const values: number[] = [];
    effect(() => {
      values.push(s());
    });
    s.set(1);
    s.set(2);
    expect(values).toEqual([0, 1, 2]);
  });

  test("dispose stops reruns", () => {
    const s = signal(0);
    let count = 0;
    const dispose = effect(() => {
      s();
      count++;
    });
    expect(count).toBe(1);
    dispose();
    s.set(1);
    expect(count).toBe(1);
  });

  test("cleanup callback runs on re-execute and dispose", () => {
    const s = signal(0);
    const cleanups: number[] = [];
    effect(() => {
      const v = s();
      return () => {
        cleanups.push(v);
      };
    });
    s.set(1);
    s.set(2);
    expect(cleanups).toEqual([0, 1]);
  });
});

describe("computed", () => {
  test("derives from a signal", () => {
    const a = signal(2);
    const doubled = computed(() => a() * 2);
    expect(doubled()).toBe(4);
    a.set(5);
    expect(doubled()).toBe(10);
  });

  test("chains computed values", () => {
    const a = signal(1);
    const b = computed(() => a() + 1);
    const c = computed(() => b() * 10);
    expect(c()).toBe(20);
    a.set(3);
    expect(c()).toBe(40);
  });
});

describe("Symbol.dispose", () => {
  test("effect can be disposed with `using`", () => {
    const s = signal(0);
    let runs = 0;
    {
      using _e = effect(() => {
        s();
        runs++;
      });
      s.set(1);
      expect(runs).toBe(2);
    }
    s.set(2);
    expect(runs).toBe(2);
  });
});

describe("batch", () => {
  test("groups multiple sets into one effect run", () => {
    const a = signal(0);
    const b = signal(0);
    let runs = 0;
    effect(() => {
      a();
      b();
      runs++;
    });
    expect(runs).toBe(1);
    batch(() => {
      a.set(1);
      b.set(2);
      a.set(3);
    });
    expect(runs).toBe(2);
    expect(a()).toBe(3);
    expect(b()).toBe(2);
  });
});
