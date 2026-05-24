export type EventBus = {
  emit(name: string, detail?: unknown): void;
  listen(name: string, handler: (detail: unknown) => void): () => void;
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
      return () => target.removeEventListener(name, listener);
    },
  };
}

const globalTarget = new EventTarget();
export const globalBus = createEventBus(globalTarget);
