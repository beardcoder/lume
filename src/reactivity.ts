import type { EffectFn, SignalGetter } from "./types";

let activeEffect: EffectCleanup | null = null;

type EffectCleanup = {
  fn: EffectFn;
  deps: Set<Set<EffectCleanup>>;
  cleanup: (() => void) | null;
};

function createEffect(fn: EffectFn): EffectCleanup {
  const effect: EffectCleanup = {
    fn,
    deps: new Set(),
    cleanup: null,
  };
  return effect;
}

function runEffect(effect: EffectCleanup): void {
  for (const dep of effect.deps) {
    dep.delete(effect);
  }
  effect.deps.clear();

  if (effect.cleanup) {
    effect.cleanup();
    effect.cleanup = null;
  }

  const prev = activeEffect;
  activeEffect = effect;
  try {
    const result = effect.fn();
    if (typeof result === "function") {
      effect.cleanup = result;
    }
  } finally {
    activeEffect = prev;
  }
}

export function signal<T>(initial: T): SignalGetter<T> {
  let value = initial;
  const subscribers = new Set<EffectCleanup>();

  const getter = (() => {
    if (activeEffect) {
      subscribers.add(activeEffect);
      activeEffect.deps.add(subscribers);
    }
    return value;
  }) as SignalGetter<T>;

  getter.set = (newValue: T): void => {
    if (Object.is(value, newValue)) return;
    value = newValue;
    for (const effect of [...subscribers]) {
      runEffect(effect);
    }
  };

  getter.update = (fn: (current: T) => T): void => {
    getter.set(fn(value));
  };

  return getter;
}

export function effect(fn: EffectFn): () => void {
  const e = createEffect(fn);
  runEffect(e);

  return () => {
    for (const dep of e.deps) {
      dep.delete(e);
    }
    e.deps.clear();
    if (e.cleanup) {
      e.cleanup();
      e.cleanup = null;
    }
  };
}
