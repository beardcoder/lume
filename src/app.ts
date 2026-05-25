import { createContext } from "./context";
import { findLumeRoots } from "./dom";
import { createEventBus, globalBus } from "./events";
import type { ComponentDefinition, LumeApp, Plugin } from "./types";

export function createLume(): LumeApp {
  const components = new Map<string, ComponentDefinition>();
  const instances = new Map<string, Record<string, unknown>>();
  const disposeMap = new Map<HTMLElement, () => void>();
  const appBus = createEventBus();

  const app: LumeApp = {
    component(name, def) {
      components.set(name, def);
      return app;
    },

    mount(root = document) {
      const roots = findLumeRoots(root);

      for (const el of roots) {
        const name = el.getAttribute("data-lume");
        if (!name) continue;

        const def = components.get(name);
        if (!def) continue;

        const id = el.getAttribute("data-lume-id");

        const { ctx, dispose } = createContext(el, appBus);
        disposeMap.set(el, dispose);

        const api = def.factory(ctx);

        if (id) {
          instances.set(id, api);
        }
      }

      return app;
    },

    unmount() {
      for (const dispose of disposeMap.values()) {
        dispose();
      }
      disposeMap.clear();
      instances.clear();
    },

    get<T extends Record<string, unknown>>(id: string): T | undefined {
      return instances.get(id) as T | undefined;
    },

    require<T extends Record<string, unknown>>(id: string): T {
      const instance = instances.get(id) as T | undefined;
      if (!instance) {
        throw new Error(`[lume] Component "${id}" not found`);
      }
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
  };

  return app;
}
