import { asDispose } from "./reactivity";
import type { Dispose } from "./types";

export type EventBus = {
  emit(name: string, detail?: unknown): void;
  listen(name: string, handler: (detail: unknown) => void): Dispose;
};

export function createEventBus(
  target: EventTarget = new EventTarget()
): EventBus {
  return {
    emit(name, detail) {
      target.dispatchEvent(new CustomEvent(name, { detail }));
    },
    listen(name, handler) {
      const listener = (e: Event) => {
        handler((e as CustomEvent).detail);
      };
      target.addEventListener(name, listener);
      return asDispose(() => target.removeEventListener(name, listener));
    },
  };
}

export const globalBus: EventBus = createEventBus();
