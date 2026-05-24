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

    part(name) {
      return queryPart(root, name);
    },

    parts(name) {
      return queryParts(root, name);
    },

    template(name) {
      return queryTemplate(root, name);
    },

    signal(initial) {
      return signal(initial);
    },

    effect(fn) {
      const dispose = effect(fn);
      cleanups.push(dispose);
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
      const off = appBus.listen(name, handler);
      cleanups.push(off);
    },

    global: {
      emit(name, detail) {
        globalBus.emit(name, detail);
      },
      listen(name, handler) {
        const off = globalBus.listen(name, handler);
        cleanups.push(off);
      },
    },
  };

  return {
    ctx,
    dispose() {
      for (const fn of cleanups) {
        fn();
      }
      cleanups.length = 0;
    },
  };
}
