var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// src/index.ts
var exports_src = {};
__export(exports_src, {
  defineComponent: () => defineComponent,
  createLume: () => createLume
});
module.exports = __toCommonJS(exports_src);

// src/dom.ts
function queryPart(root, name) {
  const el = root.querySelector(`[data-lume-part="${name}"]`);
  if (!el) {
    throw new Error(`[lume] part "${name}" not found in component`);
  }
  return el;
}
function queryParts(root, name) {
  return Array.from(root.querySelectorAll(`[data-lume-part="${name}"]`));
}
function queryTemplate(root, name) {
  const tpl = root.querySelector(`template[data-lume-part="${name}"]`);
  if (!tpl) {
    throw new Error(`[lume] template "${name}" not found in component`);
  }
  return () => {
    const fragment = tpl.content.cloneNode(true);
    return fragment;
  };
}
function findLumeRoots(root) {
  return Array.from(root.querySelectorAll("[data-lume]"));
}

// src/events.ts
function createEventBus(target = new EventTarget) {
  return {
    emit(name, detail) {
      target.dispatchEvent(new CustomEvent(name, { detail }));
    },
    listen(name, handler) {
      const listener = (e) => {
        handler(e.detail);
      };
      target.addEventListener(name, listener);
      return () => target.removeEventListener(name, listener);
    }
  };
}
var globalTarget = new EventTarget;
var globalBus = createEventBus(globalTarget);

// src/reactivity.ts
var activeEffect = null;
function createEffect(fn) {
  const effect = {
    fn,
    deps: new Set,
    cleanup: null
  };
  return effect;
}
function runEffect(effect) {
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
function signal(initial) {
  let value = initial;
  const subscribers = new Set;
  const getter = () => {
    if (activeEffect) {
      subscribers.add(activeEffect);
      activeEffect.deps.add(subscribers);
    }
    return value;
  };
  getter.set = (newValue) => {
    if (Object.is(value, newValue))
      return;
    value = newValue;
    for (const effect of [...subscribers]) {
      runEffect(effect);
    }
  };
  getter.update = (fn) => {
    getter.set(fn(value));
  };
  return getter;
}
function effect(fn) {
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

// src/context.ts
function createContext(root, appBus) {
  const cleanups = [];
  const ctx = {
    root,
    part(name) {
      return queryPart(root, name);
    },
    parts(name) {
      return queryParts(root, name);
    },
    template(name) {
      return queryTemplate(root, name);
    },
    signal(initial) {
      return signal(initial);
    },
    effect(fn) {
      const dispose = effect(fn);
      cleanups.push(dispose);
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
      const off = appBus.listen(name, handler);
      cleanups.push(off);
    },
    global: {
      emit(name, detail) {
        globalBus.emit(name, detail);
      },
      listen(name, handler) {
        const off = globalBus.listen(name, handler);
        cleanups.push(off);
      }
    }
  };
  return {
    ctx,
    dispose() {
      for (const fn of cleanups) {
        fn();
      }
      cleanups.length = 0;
    }
  };
}

// src/app.ts
function createLume() {
  const components = new Map;
  const instances = new Map;
  const disposeMap = new Map;
  const appBus = createEventBus();
  const app = {
    component(name, def) {
      components.set(name, def);
      return app;
    },
    mount(root = document) {
      const roots = findLumeRoots(root);
      for (const el of roots) {
        const name = el.getAttribute("data-lume");
        if (!name)
          continue;
        const def = components.get(name);
        if (!def)
          continue;
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
    get(id) {
      return instances.get(id);
    },
    require(id) {
      const instance = instances.get(id);
      if (!instance) {
        throw new Error(`[lume] Component with id "${id}" not found. Make sure it is mounted.`);
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
      }
    },
    use(plugin) {
      plugin(app);
      return app;
    }
  };
  return app;
}
// src/component.ts
function defineComponent(factory) {
  return {
    __lume_component: true,
    factory
  };
}

//# debugId=F91072EF65636E9A64756E2164756E21
