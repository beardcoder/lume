# lume

> Small reactive components for existing HTML.

[![Bundle Size](https://img.shields.io/badge/gzip-~1kB-brightgreen)](https://github.com/beardcoder/lume)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Lume lets you attach reactive TypeScript components to existing HTML — no renderer, no Virtual DOM, no JSX. It is calm, clean, and browser-native.

### Bundle Size

| Format         | Size    | Gzipped    |
| -------------- | ------- | ---------- |
| ESM (minified) | ~2.4 kB | **~1 kB**  |
| ESM            | ~5.2 kB | ~1.5 kB    |
| CJS            | ~6.5 kB | ~1.9 kB    |

---

## Installation

```bash
npm install @beardcoder/lume
# or
bun add @beardcoder/lume
```

---

## Quick Start

**HTML:**

```html
<div data-lume="disclosure" data-lume-id="main-menu">
  <button data-lume-part="button" aria-expanded="false">Toggle</button>
  <div data-lume-part="panel">Content</div>
</div>
```

**TypeScript:**

```ts
import { createLume, defineComponent } from "@beardcoder/lume";

const disclosure = defineComponent(({ part, signal, on, effect }) => {
  const button = part("button");
  const panel = part("panel");
  const open = signal(false);

  on(button, "click", () => open.update(v => !v));

  effect(() => {
    panel.hidden = !open();
    button.setAttribute("aria-expanded", String(open()));
  });

  return {
    show: () => open.set(true),
    hide: () => open.set(false),
  };
});

const app = createLume();
app.component("disclosure", disclosure).mount();

const menu = app.require("main-menu");
menu.hide();
```

---

## HTML Attributes

| Attribute       | Purpose                                      |
| --------------- | -------------------------------------------- |
| `data-lume`     | Marks the root element of a component        |
| `data-lume-part`| Marks a named element or template inside     |
| `data-lume-id`  | Assigns an ID so the component API can be retrieved |

---

## Components

Define a component using `defineComponent`. It receives a context object and returns its public API.

```ts
import { defineComponent } from "@beardcoder/lume";

export default defineComponent(({ part, signal, effect, on }) => {
  // ...
  return { /* public API */ };
});
```

Register and mount:

```ts
import { createLume } from "@beardcoder/lume";
import myComponent from "./my-component";

const app = createLume();
app.component("my-component", myComponent).mount();
```

---

## Component Context

| Property          | Description                                         |
| ----------------- | --------------------------------------------------- |
| `root`            | The component root element                          |
| `part(name)`      | Finds one `[data-lume-part="name"]` inside root     |
| `parts(name)`     | Finds all matching parts                            |
| `template(name)`  | Returns a factory that clones a `<template>` part   |
| `signal(initial)` | Creates a reactive signal                           |
| `computed(fn)`    | Creates a derived signal                            |
| `effect(fn)`      | Runs fn immediately and again when signals change   |
| `untrack(fn)`     | Reads signals without subscribing the effect        |
| `on(target, event, handler, options?)` | Adds an event listener with auto cleanup |
| `cleanup(fn)`     | Registers a cleanup function                        |
| `emit(name, detail?)` | Emits a local app event                         |
| `listen(name, handler)` | Listens to a local app event                  |
| `global.emit(name, detail?)` | Emits a global event (shared across apps) |
| `global.listen(name, handler)` | Listens to a global event             |

---

## Signals & Effects

```ts
const count = signal(0);   // create
count();                   // read (subscribes the surrounding effect)
count.peek();              // read without subscribing
count.set(1);              // write
count.update(v => v + 1);  // transform

effect(() => {
  console.log("count is", count()); // runs on change
});

// Read multiple signals untracked
import { untrack } from "@beardcoder/lume";
const total = untrack(() => price() * quantity());
```

---

## Events

### Local (per-app)

```ts
// Inside a component
emit("my-event", { value: 42 });
listen("my-event", (detail) => console.log(detail));

// On the app
app.emit("my-event", { value: 42 });
app.listen("my-event", (detail) => console.log(detail));
```

### Global (shared across apps)

```ts
// Inside a component
global.emit("global-event", payload);
global.listen("global-event", handler);
```

---

## Templates

Use native `<template>` elements with `data-lume-part`:

```html
<div data-lume="toast" data-lume-id="toaster">
  <template data-lume-part="item">
    <div class="toast" role="status">
      <span data-lume-part="message"></span>
      <button type="button">Close</button>
    </div>
  </template>
</div>
```

```ts
const createItem = template("item");
const frag = createItem(); // cloned DocumentFragment
root.appendChild(frag);
```

---

## Public API via Return

Expose your component's public methods by returning an object from `defineComponent`. Access it via `app.get(id)` or `app.require(id)`.

```ts
const menu = app.require<MenuApi>("main-menu");
menu.hide();
```

- `app.get(id)` — returns `T | undefined`
- `app.require(id)` — returns `T` or throws a clear error

---

## Plugins

A plugin is just a function that receives the app:

```ts
function myPlugin(app) {
  app.component("tooltip", tooltip);
}

app.use(myPlugin);
```

---

## What Lume Does Not Do

Lume intentionally has no:

- Virtual DOM or renderer
- JSX or custom templates
- Directives (`data-lume-show`, `data-lume-on`, etc.)
- Router, store, or SSR
- Animation APIs
- Devtools or inspect
- Framework-style contracts or aliases

HTML marks structure. TypeScript contains the logic.

---

## License

MIT
