import { createContext } from "./context";
import { findLumeRoots } from "./dom";
import { createEventBus, globalBus } from "./events";
import type { ComponentFactory, LumeApp, Plugin } from "./types";

type MountedEntry = { id: string | null; dispose: () => void };

export function createLume(): LumeApp {
  const components = new Map<string, ComponentFactory>();
  const instances = new Map<string, Record<string, unknown>>();
  const mounted = new Map<HTMLElement, MountedEntry>();
  const appBus = createEventBus();

  const app: LumeApp = {
    component(name, factory) {
      components.set(name, factory as ComponentFactory);
      return app;
    },

    mount(root = document) {
      for (const el of findLumeRoots(root)) {
        if (mounted.has(el)) continue;

        const name = el.getAttribute("data-lume");
        const factory = name ? components.get(name) : undefined;
        if (!factory) continue;

        const id = el.getAttribute("data-lume-id");
        if (id && instances.has(id)) {
          throw new Error(
            `[lume] Duplicate component id "${id}" — ids must be unique per app`
          );
        }

        const { ctx, dispose } = createContext(el, appBus);
        const api = factory(ctx);

        mounted.set(el, { id, dispose });
        if (id) instances.set(id, api);
      }
      return app;
    },

    unmount() {
      for (const { id, dispose } of mounted.values()) {
        dispose();
        if (id) instances.delete(id);
      }
      mounted.clear();
    },

    get<T extends Record<string, unknown>>(id: string): T | undefined {
      return instances.get(id) as T | undefined;
    },

    require<T extends Record<string, unknown>>(id: string): T {
      const instance = instances.get(id) as T | undefined;
      if (!instance) throw new Error(`[lume] Component "${id}" not found`);
      return instance;
    },

    emit(name, detail) {
      appBus.emit(name, detail);
    },

    listen(name, handler) {
      appBus.listen(name, handler);
    },

    global: {
      emit(name, detail) {
        globalBus.emit(name, detail);
      },
      listen(name, handler) {
        globalBus.listen(name, handler);
      },
    },

    use(plugin: Plugin) {
      plugin(app);
      return app;
    },

    [Symbol.dispose]() {
      app.unmount();
    },
  };

  return app;
}
