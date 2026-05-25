---
title: "Example: Disclosure"
description: A toggleable disclosure (accordion/dropdown) component.
---

A disclosure component that shows/hides content when a button is clicked. This is the most common pattern for menus, FAQs, and expandable sections.

## HTML

```html
<div data-lume="disclosure" data-lume-id="main-menu">
  <button type="button" data-lume-part="button" aria-expanded="false">
    Toggle Menu
  </button>
  <div data-lume-part="panel">
    <ul>
      <li><a href="#">Item 1</a></li>
      <li><a href="#">Item 2</a></li>
      <li><a href="#">Item 3</a></li>
    </ul>
  </div>
</div>
```

## Component

```ts
import { defineComponent } from "@beardcoder/lume";

export const disclosure = defineComponent(({ part, signal, on, effect }) => {
  const button = part("button");
  const panel = part("panel");
  const open = signal(false);

  function show() { open.set(true); }
  function hide() { open.set(false); }
  function toggle() { open.update((v) => !v); }

  on(button, "click", toggle);

  effect(() => {
    panel.hidden = !open();
    button.setAttribute("aria-expanded", String(open()));
  });

  return { show, hide, toggle };
});
```

## Mounting

```ts
import { createLume } from "@beardcoder/lume";
import { disclosure } from "./disclosure";

const app = createLume();
app.component("disclosure", disclosure).mount();

// Programmatic control
const menu = app.require<{ show(): void; hide(): void; toggle(): void }>("main-menu");
menu.hide();
```

## Key Points

- **Accessibility**: The `aria-expanded` attribute is kept in sync automatically via the effect
- **Hidden state**: Uses the native `hidden` property for show/hide
- **Public API**: Exposes `show`, `hide`, and `toggle` for external control
- **Multiple instances**: Each `data-lume="disclosure"` element gets its own state
