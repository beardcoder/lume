---
title: Events
description: Communication between components via local and global events.
---

Lume provides a lightweight event system for communication between components — without tight coupling.

## Local Events (Per App)

Local events are scoped to a single Lume app instance. They're perfect for communication between components that belong to the same app.

### Inside a Component

```ts
const myComponent = defineComponent(({ emit, listen }) => {
  // Emit an event
  emit("item-added", { id: 1, name: "New Item" });

  // Listen for events
  listen("item-removed", (detail) => {
    console.log("Item removed:", detail);
  });
});
```

### On the App Instance

```ts
const app = createLume();
app.component("my-component", myComponent).mount();

// Emit from outside
app.emit("item-added", { id: 2, name: "Another Item" });

// Listen from outside
app.listen("notification", (detail) => {
  showToast(detail.message);
});
```

## Global Events (Across Apps)

Global events are shared across all Lume app instances on the page. Use them when separate apps need to communicate.

### Inside a Component

```ts
const myComponent = defineComponent(({ global }) => {
  // Emit globally
  global.emit("theme-changed", { theme: "dark" });

  // Listen globally
  global.listen("theme-changed", (detail) => {
    applyTheme(detail.theme);
  });
});
```

### On the App Instance

```ts
app.global.emit("user-logged-in", { user: "Alice" });
app.global.listen("user-logged-in", (detail) => {
  console.log(`${detail.user} logged in`);
});
```

## When to Use Which?

| Scenario | Use |
| --- | --- |
| Components in the same app | Local events (`emit`/`listen`) |
| Communication across separate apps | Global events (`global.emit`/`global.listen`) |
| External code triggering components | `app.emit()` |

## Auto-Cleanup

All event listeners registered via `listen` or `global.listen` inside a component are automatically cleaned up when the component unmounts. No manual removal needed.
