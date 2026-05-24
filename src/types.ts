export type SignalGetter<T> = {
  (): T;
  set(value: T): void;
  update(fn: (current: T) => T): void;
};

// biome-ignore lint/suspicious/noConfusingVoidType: effects may return cleanup or nothing.
export type EffectFn = () => void | (() => void);

export type ComponentContext = {
  root: HTMLElement;
  part(name: string): HTMLElement;
  parts(name: string): HTMLElement[];
  template(name: string): () => DocumentFragment;
  signal<T>(initial: T): SignalGetter<T>;
  effect(fn: EffectFn): void;
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

export type ComponentDefinition<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  __lume_component: true;
  factory: ComponentFactory<T>;
};

export type Plugin = (app: LumeApp) => void;

export type LumeApp = {
  component(name: string, def: ComponentDefinition): LumeApp;
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
};
