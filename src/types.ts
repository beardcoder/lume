export type SignalGetter<T> = {
  (): T;
  /** Update the value and notify subscribers. No-op if value is `Object.is`-equal. */
  set(value: T): void;
  /** Transform the current value via a function. */
  update(fn: (current: T) => T): void;
  /** Read the value without subscribing the surrounding effect. */
  peek(): T;
};

// biome-ignore lint/suspicious/noConfusingVoidType: effects may return cleanup or nothing.
export type EffectFn = () => void | (() => void);

export type Dispose = (() => void) & Disposable;

export type ComponentContext = {
  root: HTMLElement;
  part<T extends HTMLElement = HTMLElement>(name: string): T;
  parts<T extends HTMLElement = HTMLElement>(name: string): T[];
  template(name: string): () => DocumentFragment;
  signal<T>(initial: T): SignalGetter<T>;
  computed<T>(fn: () => T): SignalGetter<T>;
  effect(fn: EffectFn): void;
  untrack<T>(fn: () => T): T;
  on(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void;
  cleanup(fn: () => void): void;
  emit(name: string, detail?: unknown): void;
  listen(name: string, handler: (detail: unknown) => void): void;
  global: {
    emit(name: string, detail?: unknown): void;
    listen(name: string, handler: (detail: unknown) => void): void;
  };
};

export type ComponentFactory<
  T extends Record<string, unknown> = Record<string, unknown>,
> = (ctx: ComponentContext) => T;

export type Plugin = (app: LumeApp) => void;

export type LumeApp = {
  component<T extends Record<string, unknown>>(
    name: string,
    factory: ComponentFactory<T>
  ): LumeApp;
  mount(root?: HTMLElement | Document): LumeApp;
  unmount(): void;
  get<T extends Record<string, unknown>>(id: string): T | undefined;
  require<T extends Record<string, unknown>>(id: string): T;
  emit(name: string, detail?: unknown): void;
  listen(name: string, handler: (detail: unknown) => void): void;
  global: {
    emit(name: string, detail?: unknown): void;
    listen(name: string, handler: (detail: unknown) => void): void;
  };
  use(plugin: Plugin): LumeApp;
  [Symbol.dispose](): void;
};
