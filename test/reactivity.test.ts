import { describe, expect, test } from "bun:test";
import { effect, signal } from "../src/reactivity";

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

  test("cleanup callback runs on re-execute", () => {
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
