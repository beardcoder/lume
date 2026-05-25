---
title: "Example: Toast"
description: A dynamic toast notification component using native templates.
---

A toast notification component that demonstrates Lume's template system for dynamically creating elements.

## HTML

```html
<div data-lume="toast" data-lume-id="toaster" class="toast-container">
  <template data-lume-part="item">
    <div class="toast" role="status">
      <span data-lume-part="message"></span>
      <button type="button" data-lume-part="close">Close</button>
    </div>
  </template>
</div>

<button type="button" id="trigger">Show Toast</button>
```

## Styles

```css
.toast-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  background: #333;
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
}
```

## Component

```ts
import { defineComponent } from "@beardcoder/lume";

export const toast = defineComponent(({ root, template }) => {
  const createItem = template("item");

  function show(message: string) {
    const frag = createItem();
    const item = frag.querySelector(".toast")!;
    const msgEl = frag.querySelector("[data-lume-part='message']")!;
    const closeBtn = frag.querySelector("[data-lume-part='close']")!;

    msgEl.textContent = message;
    closeBtn.addEventListener("click", () => item.remove());
    root.appendChild(frag);

    // Auto-dismiss after 5 seconds
    setTimeout(() => item.remove(), 5000);
  }

  return { show };
});
```

## Mounting

```ts
import { createLume } from "@beardcoder/lume";
import { toast } from "./toast";

const app = createLume();
app.component("toast", toast).mount();

// Show a toast from anywhere
const toaster = app.require<{ show(msg: string): void }>("toaster");
toaster.show("Hello from Lume!");
```

## Key Points

- **Native templates**: Uses `<template>` elements for zero-cost DOM cloning
- **No innerHTML**: All content is set safely via DOM APIs
- **Self-cleaning**: Each toast can remove itself via the close button
- **Public API**: The `show()` method can be called from anywhere via `app.require()`
