import { describe, expect, mock, test } from "bun:test";
import { createEventBus } from "../src/events";

describe("createEventBus", () => {
  test("emit triggers listener", () => {
    const bus = createEventBus();
    const handler = mock();
    bus.listen("test", handler);
    bus.emit("test", { value: 1 });
    expect(handler).toHaveBeenCalledWith({ value: 1 });
  });

  test("listener can be removed", () => {
    const bus = createEventBus();
    const handler = mock();
    const off = bus.listen("test", handler);
    off();
    bus.emit("test", {});
    expect(handler).not.toHaveBeenCalled();
  });

  test("multiple listeners for same event", () => {
    const bus = createEventBus();
    const h1 = mock();
    const h2 = mock();
    bus.listen("test", h1);
    bus.listen("test", h2);
    bus.emit("test", null);
    expect(h1).toHaveBeenCalled();
    expect(h2).toHaveBeenCalled();
  });
});
