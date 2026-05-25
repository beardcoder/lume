---
title: Installation
description: How to install Lume in your project.
---

## Package Manager

Install Lume via your preferred package manager:

```bash
# npm
npm install @beardcoder/lume

# bun
bun add @beardcoder/lume

# pnpm
pnpm add @beardcoder/lume

# yarn
yarn add @beardcoder/lume
```

## Bundle Sizes

| Format         | Size    | Gzipped   |
| -------------- | ------- | --------- |
| ESM (minified) | ~2.4 kB | **~1 kB** |
| ESM            | ~5.2 kB | ~1.5 kB   |
| CJS            | ~6.5 kB | ~1.9 kB   |

## Requirements

- A modern browser with ES Module support
- Node.js ≥ 24 (for development/build tooling)

## CDN Usage

You can also use Lume directly from a CDN without any build step:

```html
<script type="module">
  import { createLume, defineComponent } from "https://esm.sh/@beardcoder/lume";
  
  // Your code here...
</script>
```

## TypeScript

Lume is written in TypeScript and ships with complete type definitions. No additional `@types` packages are needed.
