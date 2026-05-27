import { queryPart, queryParts, queryTemplate } from "./dom";
import { type createEventBus, globalBus } from "./events";
import { computed, effect, signal, untrack } from "./reactivity";
import type { ComponentContext } from "./types";

export function createContext(
  root: HTMLElement,
  appBus: ReturnType<typeof createEventBus>
): { ctx: ComponentContext; dispose: () => void } {
  const cleanups: (() => void)[] = [];

  const ctx: ComponentContext = {
    root,
    part: <T extends HTMLElement = HTMLElement>(name: string): T =>
      queryPart<T>(root, name),
    parts: <T extends HTMLElement = HTMLElement>(name: string): T[] =>
      queryParts<T>(root, name),
    template: (name) => queryTemplate(root, name),
    signal,
    computed,
    untrack,

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
