---
title: Templates
description: Clone and render native HTML templates with Lume.
---

Lume leverages the browser's native `<template>` element for dynamic content creation — no custom template syntax needed.

## How It Works

1. Define a `<template>` element with `data-lume-part` inside your component root
2. Use `template(name)` in your component to get a factory function
3. Call the factory to clone the template content

## HTML Setup

```html
<div data-lume="toast" data-lume-id="toaster" class="toast-container">
  <template data-lume-part="item">
    <div class="toast" role="status">
      <span data-lume-part="message"></span>
      <button type="button" data-lume-part="close">Close</button>
    </div>
  </template>
</div>
```

## Component Logic

```ts
const toast = defineComponent(({ root, template }) => {
  const createItem = template("item");

  function show(message: string) {
    const frag = createItem(); // Returns a DocumentFragment
    const item = frag.querySelector(".toast")!;
    const msgEl = frag.querySelector("[data-lume-part='message']")!;
    const closeBtn = frag.querySelector("[data-lume-part='close']")!;

    msgEl.textContent = message;
    closeBtn.addEventListener("click", () => item.remove());
    root.appendChild(frag);
  }

  return { show };
});
```

## Usage

```ts
const app = createLume();
app.component("toast", toast).mount();

const toaster = app.require<{ show(msg: string): void }>("toaster");
toaster.show("Hello from Lume!");
```

## Why Native Templates?

- **Performance**: `<template>` content is parsed but not rendered until cloned
- **No string parsing**: Unlike innerHTML, templates are parsed by the browser natively
- **Standard**: Uses the platform's built-in `<template>` element — no library-specific syntax
- **Type-safe**: You get full DOM API access on the cloned content
