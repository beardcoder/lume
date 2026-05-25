---
title: Components
description: How to define and register components in Lume.
---

Components are the core building block of Lume. A component attaches reactive logic to an existing HTML element.

## Defining a Component

Use `defineComponent` to create a component definition:

```ts
import { defineComponent } from "@beardcoder/lume";

export const myComponent = defineComponent((ctx) => {
  // ctx provides: root, part, parts, template, signal, effect, on, cleanup, emit, listen, global
  
  return {
    // Public API (optional)
  };
});
```

The factory function receives a [Component Context](/lume/api/component-context/) and returns an optional public API object.

## Registering Components

Register components on a Lume app under a name that matches the `data-lume` attribute:

```ts
import { createLume } from "@beardcoder/lume";
import { disclosure } from "./disclosure";
import { tabs } from "./tabs";

const app = createLume();
app
  .component("disclosure", disclosure)
  .component("tabs", tabs)
  .mount();
```

## HTML Connection

Lume connects components to HTML via the `data-lume` attribute:

```html
<!-- This element will be initialized by the "disclosure" component -->
<div data-lume="disclosure">
  <button data-lume-part="button">Toggle</button>
  <div data-lume-part="panel">Content here</div>
</div>
```

### HTML Attributes

| Attribute        | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `data-lume`      | Marks the root element and specifies the component name |
| `data-lume-part` | Marks a named child element inside the component     |
| `data-lume-id`   | Assigns an ID for external access via `app.get()`/`app.require()` |

## Multiple Instances

Each `data-lume` element gets its own independent component instance:

```html
<!-- Two separate disclosure instances, each with its own state -->
<div data-lume="disclosure" data-lume-id="menu">...</div>
<div data-lume="disclosure" data-lume-id="faq">...</div>
```

## Public API

Return an object from your factory to expose a public API:

```ts
const disclosure = defineComponent(({ part, signal, on, effect }) => {
  const open = signal(false);
  
  // ... setup logic ...

  return {
    show: () => open.set(true),
    hide: () => open.set(false),
    toggle: () => open.update((v) => !v),
  };
});
```

Access the API externally:

```ts
const menu = app.require<{ show(): void; hide(): void }>("menu");
menu.show();
```

## Lifecycle

- **Mount**: The factory runs when `.mount()` is called on the app
- **Unmount**: All effects, listeners, and cleanup functions run when `.unmount()` is called
- There is no "update" lifecycle — reactivity is handled by signals and effects
