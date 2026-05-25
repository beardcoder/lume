import { queryPart, queryParts, queryTemplate } from "./dom";
import { type createEventBus, globalBus } from "./events";
import { effect, signal } from "./reactivity";
import type { ComponentContext } from "./types";

export function createContext(
  root: HTMLElement,
  appBus: ReturnType<typeof createEventBus>
): { ctx: ComponentContext; dispose: () => void } {
  const cleanups: (() => void)[] = [];

  const ctx: ComponentContext = {
    root,
    part: (name) => queryPart(root, name),
    parts: (name) => queryParts(root, name),
    template: (name) => queryTemplate(root, name),
    signal,

    effect(fn) {
      cleanups.push(effect(fn));
    },

    on(target, event, handler, options) {
      target.addEventListener(event, handler, options);
      cleanups.push(() => target.removeEventListener(event, handler, options));
    },

    cleanup(fn) {
      cleanups.push(fn);
    },

    emit(name, detail) {
      appBus.emit(name, detail);
    },

    listen(name, handler) {
      cleanups.push(appBus.listen(name, handler));
    },

    global: {
      emit(name, detail) {
        globalBus.emit(name, detail);
      },
      listen(name, handler) {
        cleanups.push(globalBus.listen(name, handler));
      },
    },
  };

  return {
    ctx,
    dispose() {
      for (const fn of cleanups) fn();
      cleanups.length = 0;
    },
  };
}
