---
title: Component Context
description: API reference for the ComponentContext object.
---

The Component Context is the object passed to your factory function in `defineComponent`. It provides all the tools needed to build reactive components.

## Properties & Methods

### `root`

The component's root element (the element with `data-lume`).

```ts
defineComponent(({ root }) => {
  root.classList.add("initialized");
  return {};
});
```

**Type**: `HTMLElement`

---

### `part(name)`

Finds a single element with `data-lume-part="name"` inside the root.

```ts
const button = part("button"); // HTMLElement
```

**Throws** if the element is not found.

---

### `parts(name)`

Finds all elements with `data-lume-part="name"` inside the root.

```ts
const items = parts("item"); // HTMLElement[]
```

**Returns** an empty array if no elements match.

---

### `template(name)`

Returns a factory function that clones a `<template data-lume-part="name">` element.

```ts
const createItem = template("item");
const fragment = createItem(); // DocumentFragment
root.appendChild(fragment);
```

**Returns**: `() => DocumentFragment`

---

### `signal<T>(initial)`

Creates a reactive signal with an initial value.

```ts
const count = signal(0);

count();              // Read: 0
count.set(5);         // Write: 5
count.update(v => v + 1); // Transform: 6
```

**Returns**: `SignalGetter<T>` — a callable object with `.set()` and `.update()` methods.

---

### `effect(fn)`

Runs a function immediately and re-runs it whenever any signal it reads changes.

```ts
effect(() => {
  element.textContent = String(count());
});
```

The function may return a cleanup function:

```ts
effect(() => {
  const timer = setInterval(() => tick(), interval());
  return () => clearInterval(timer);
});
```

---

### `on(target, event, handler, options?)`

Adds an event listener that is automatically removed on unmount.

```ts
on(button, "click", () => count.update((v) => v + 1));
on(window, "resize", handleResize, { passive: true });
```

| Parameter | Type | Description |
| --- | --- | --- |
| `target` | `EventTarget` | Any event target (element, window, etc.) |
| `event` | `string` | Event name |
| `handler` | `EventListener` | Event handler function |
| `options` | `AddEventListenerOptions` | Optional listener options |

---

### `cleanup(fn)`

Registers a function to be called when the component unmounts.

```ts
const observer = new IntersectionObserver(callback);
observer.observe(root);

cleanup(() => observer.disconnect());
```

---

### `emit(name, detail?)`

Emits a local event within the app.

```ts
emit("item-selected", { id: 42 });
```

---

### `listen(name, handler)`

Listens to local app events. Automatically cleaned up on unmount.

```ts
listen("theme-changed", (detail) => {
  applyTheme(detail);
});
```

---

### `global`

Object for global (cross-app) events.

#### `global.emit(name, detail?)`

```ts
global.emit("user-action", { type: "click" });
```

#### `global.listen(name, handler)`

```ts
global.listen("app-ready", () => {
  initialize();
});
```

---

## Complete Example

```ts
import { defineComponent } from "@beardcoder/lume";

export const accordion = defineComponent(
  ({ root, part, parts, signal, effect, on, cleanup, emit }) => {
    const items = parts("item");
    const activeIndex = signal(-1);

    for (const [i, item] of items.entries()) {
      const trigger = item.querySelector("[data-role='trigger']")!;
      on(trigger, "click", () => {
        activeIndex.update((v) => (v === i ? -1 : i));
      });
    }

    effect(() => {
      const idx = activeIndex();
      for (const [i, item] of items.entries()) {
        item.classList.toggle("active", i === idx);
      }
      emit("accordion-changed", { index: idx });
    });

    return {
      open: (index: number) => activeIndex.set(index),
      close: () => activeIndex.set(-1),
    };
  }
);
```
