---
title: Plugins
description: Extend Lume apps with reusable plugins.
---

Plugins let you package and share component registrations and setup logic.

## What Is a Plugin?

A plugin is simply a function that receives the Lume app instance:

```ts
import type { Plugin } from "@beardcoder/lume";

const myPlugin: Plugin = (app) => {
  // Register components, listen to events, etc.
};
```

## Using a Plugin

```ts
import { createLume } from "@beardcoder/lume";
import { uiPlugin } from "./plugins/ui";

const app = createLume();
app.use(uiPlugin).mount();
```

## Example: UI Component Library

```ts
import type { Plugin } from "@beardcoder/lume";
import { disclosure } from "./components/disclosure";
import { tabs } from "./components/tabs";
import { tooltip } from "./components/tooltip";

export const uiPlugin: Plugin = (app) => {
  app
    .component("disclosure", disclosure)
    .component("tabs", tabs)
    .component("tooltip", tooltip);
};
```

## Example: Analytics Plugin

```ts
import type { Plugin } from "@beardcoder/lume";

export const analyticsPlugin: Plugin = (app) => {
  app.listen("page-view", (detail) => {
    sendToAnalytics("page_view", detail);
  });

  app.listen("button-click", (detail) => {
    sendToAnalytics("click", detail);
  });
};
```

## Composability

Plugins can use other plugins:

```ts
const fullPlugin: Plugin = (app) => {
  app.use(uiPlugin);
  app.use(analyticsPlugin);
};
```

## Plugin Type

```ts
type Plugin = (app: LumeApp) => void;
```

Plugins are synchronous and have full access to the app's API — they can register components, emit/listen to events, or perform any setup.
