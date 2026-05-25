---
title: defineComponent
description: API reference for the defineComponent function.
---

`defineComponent()` wraps a factory function into a component definition that can be registered on a Lume app.

## Signature

```ts
function defineComponent<T extends Record<string, unknown>>(
  factory: ComponentFactory<T>
): ComponentDefinition<T>;
```

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `factory` | `(ctx: ComponentContext) => T` | A function that sets up the component and returns its public API |

## Returns

A `ComponentDefinition` object that can be passed to `app.component()`.

## Usage

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

## The Factory Function

The factory function is called once per component instance (per `data-lume` element found during mount). It receives a [Component Context](/lume/api/component-context/) object with all the tools needed to build reactive behavior.

### What to Do in the Factory

1. **Query parts** — Use `part()` and `parts()` to find named elements
2. **Create signals** — Use `signal()` for reactive state
3. **Register effects** — Use `effect()` for DOM updates
4. **Bind events** — Use `on()` for event listeners
5. **Return public API** — Expose methods for external access

### Return Value

The returned object becomes the component's public API, accessible via `app.get(id)` or `app.require(id)`.

If you don't need a public API, you can return an empty object or omit the return:

```ts
const autoScroller = defineComponent(({ root, effect, signal }) => {
  // Internal-only component, no public API needed
  const scrollPos = signal(0);
  
  effect(() => {
    root.scrollTop = scrollPos();
  });

  return {};
});
```

## Type Safety

The generic parameter `T` is inferred from the return type of the factory:

```ts
// Type is inferred as ComponentDefinition<{ show(): void; hide(): void }>
const disclosure = defineComponent(({ signal }) => {
  const open = signal(false);
  return {
    show: () => open.set(true),
    hide: () => open.set(false),
  };
});
```
