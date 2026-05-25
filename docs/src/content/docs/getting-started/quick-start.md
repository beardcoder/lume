---
title: Quick Start
description: Build your first reactive component with Lume in 5 minutes.
---

## 1. Write HTML

Mark your interactive elements with `data-lume` attributes:

```html
<div data-lume="counter">
  <button data-lume-part="decrement">-</button>
  <span data-lume-part="display">0</span>
  <button data-lume-part="increment">+</button>
</div>
```

## 2. Define a Component

Create a TypeScript file with your component logic:

```ts
import { defineComponent } from "@beardcoder/lume";

export const counter = defineComponent(({ part, signal, on, effect }) => {
  const display = part("display");
  const count = signal(0);

  on(part("increment"), "click", () => count.update((v) => v + 1));
  on(part("decrement"), "click", () => count.update((v) => v - 1));

  effect(() => {
    display.textContent = String(count());
  });

  return {
    reset: () => count.set(0),
    value: count,
  };
});
```

## 3. Mount the App

Register the component and mount:

```ts
import { createLume } from "@beardcoder/lume";
import { counter } from "./counter";

const app = createLume();
app.component("counter", counter).mount();
```

That's it! Lume will find all elements with `data-lume="counter"` and attach the reactive logic.

## What Just Happened?

1. **`defineComponent`** wraps your factory function into a component definition
2. **`createLume()`** creates an app instance with an event bus
3. **`.component("counter", counter)`** registers the component under the name `"counter"`
4. **`.mount()`** scans the DOM for `[data-lume="counter"]` elements and initializes each one

Each component instance gets its own signals, effects, and event listeners — all automatically cleaned up when `.unmount()` is called.

## Next Steps

- Learn about [Components](/lume/concepts/components/) in detail
- Understand [Signals & Effects](/lume/concepts/signals/)
- See the full [API Reference](/lume/api/create-lume/)
