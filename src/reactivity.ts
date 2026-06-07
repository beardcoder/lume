import type { Dispose, EffectFn, SignalGetter } from "./types";

type Effect = {
  fn: EffectFn;
  deps: Set<Set<Effect>>;
  cleanup: (() => void) | null;
};

let activeEffect: Effect | null = null;
let batchDepth = 0;
const pending = new Set<Effect>();

function teardown(e: Effect): void {
  for (const dep of e.deps) dep.delete(e);
  e.deps.clear();
  e.cleanup?.();
  e.cleanup = null;
}

function runEffect(e: Effect): void {
  teardown(e);

  const prev = activeEffect;
  activeEffect = e;
  try {
    const result = e.fn();
    if (typeof result === "function") e.cleanup = result;
  } finally {
    activeEffect = prev;
  }
}

function schedule(e: Effect): void {
  if (batchDepth > 0) pending.add(e);
  else runEffect(e);
}

/** Tag a plain cleanup function as a `Dispose` (callable + `Symbol.dispose`). */
export function asDispose(fn: () => void): Dispose {
  const d = fn as Dispose;
  d[Symbol.dispose] = fn;
  return d;
}

export function signal<T>(initial: T): SignalGetter<T> {
  let value = initial;
  const subscribers = new Set<Effect>();

  const getter = (() => {
    if (activeEffect) {
      subscribers.add(activeEffect);
      activeEffect.deps.add(subscribers);
    }
    return value;
  }) as SignalGetter<T>;

  getter.set = (next: T): void => {
    if (Object.is(value, next)) return;
    value = next;
    for (const sub of [...subscribers]) schedule(sub);
  };

  getter.update = (fn: (current: T) => T): void => {
    getter.set(fn(value));
  };

  getter.peek = (): T => value;

  return getter;
}

export function effect(fn: EffectFn): Dispose {
  const e: Effect = { fn, deps: new Set(), cleanup: null };
  runEffect(e);

  return asDispose(() => {
    teardown(e);
    pending.delete(e);
  });
}

export function computed<T>(fn: () => T): SignalGetter<T> {
  const s = signal<T>(undefined as T);
  effect(() => {
    s.set(fn());
  });
  return s;
}

export function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      const effects = [...pending];
      pending.clear();
      for (const e of effects) runEffect(e);
    }
  }
}

/** Run `fn` without subscribing the surrounding effect to any signal it reads. */
export function untrack<T>(fn: () => T): T {
  const prev = activeEffect;
  activeEffect = null;
  try {
    return fn();
  } finally {
    activeEffect = prev;
  }
}
