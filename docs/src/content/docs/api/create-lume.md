---
title: createLume
description: API reference for the createLume function.
---

`createLume()` creates a new Lume application instance.

## Signature

```ts
function createLume(): LumeApp;
```

## Returns

A `LumeApp` object with the following methods:

## LumeApp API

### `component(name, definition)`

Registers a component definition under a name.

```ts
app.component("disclosure", disclosure);
```

| Parameter | Type | Description |
| --- | --- | --- |
| `name` | `string` | The component name (matches `data-lume` attribute) |
| `definition` | `ComponentDefinition` | The result of `defineComponent()` |

**Returns**: `LumeApp` (chainable)

---

### `mount(root?)`

Scans the DOM for `[data-lume]` elements and initializes matching components.

```ts
app.mount();           // Scans entire document
app.mount(container);  // Scans a specific element
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `root` | `HTMLElement \| Document` | `document` | The root to scan |

**Returns**: `LumeApp` (chainable)

---

### `unmount()`

Destroys all component instances, running cleanup functions and removing effects.

```ts
app.unmount();
```

---

### `get<T>(id)`

Retrieves a component's public API by its `data-lume-id`.

```ts
const menu = app.get<MenuApi>("main-menu");
if (menu) {
  menu.hide();
}
```

**Returns**: `T | undefined`

---

### `require<T>(id)`

Like `get()`, but throws an error if the component is not found.

```ts
const menu = app.require<MenuApi>("main-menu");
menu.hide(); // guaranteed to exist
```

**Returns**: `T` (throws if not found)

---

### `emit(name, detail?)`

Emits a local event within this app.

```ts
app.emit("notification", { message: "Saved!" });
```

---

### `listen(name, handler)`

Listens to local events within this app.

```ts
app.listen("notification", (detail) => {
  console.log(detail.message);
});
```

---

### `global.emit(name, detail?)`

Emits a global event shared across all Lume apps.

```ts
app.global.emit("theme-changed", { theme: "dark" });
```

---

### `global.listen(name, handler)`

Listens to global events shared across all Lume apps.

```ts
app.global.listen("theme-changed", (detail) => {
  document.body.dataset.theme = detail.theme;
});
```

---

### `use(plugin)`

Applies a plugin to this app.

```ts
app.use(myPlugin);
```

| Parameter | Type | Description |
| --- | --- | --- |
| `plugin` | `Plugin` | A function `(app: LumeApp) => void` |

**Returns**: `LumeApp` (chainable)

## Full Example

```ts
import { createLume } from "@beardcoder/lume";
import { disclosure } from "./components/disclosure";
import { uiPlugin } from "./plugins/ui";

const app = createLume();

app
  .use(uiPlugin)
  .component("disclosure", disclosure)
  .mount();

// Access component APIs
const menu = app.require<{ toggle(): void }>("main-menu");

// App-level events
app.listen("menu-opened", () => console.log("Menu is open"));
```
