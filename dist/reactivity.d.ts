import type { EffectFn, SignalGetter } from "./types";
export declare function signal<T>(initial: T): SignalGetter<T>;
export declare function effect(fn: EffectFn): () => void;
