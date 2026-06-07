# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## What Lume is

Lume is a tiny (~1 kB gzipped) library for attaching reactive TypeScript
components to **existing, server-rendered HTML**. There is no Virtual DOM, no
renderer, no JSX, and no template directives. HTML marks structure via `data-*`
attributes; TypeScript holds the logic. The reactivity is a hand-rolled
signals/effects system.

Published to npm as `@beardcoder/lume`. Source of truth for behavior is `src/`;
`README.md` and `docs/` are user-facing documentation that must be kept in sync
with the code.

## Tooling

This project uses **Bun** as the runtime, test runner, and bundler, and
**Biome** for linting/formatting. There is no Jest, ESLint, Prettier, webpack,
or Vite for the library itself.

- Runtime/package manager: `bun@1.3.14` (pinned via `packageManager`); requires
  Node `>=24` and Bun `>=1.3`.
- Lint + format: Biome (`biome.json`) — 2-space indent, double quotes, ES5
  trailing commas, organize-imports on. `dist/` is excluded.
- Types: TypeScript strict mode, `target` ES2024, `moduleResolution: bundler`,
  `noUncheckedIndexedAccess` on. Type declarations are emitted by `tsc`; JS is
  bundled by Bun.
- Tests: `bun test` with `happy-dom` providing the DOM.

## Commands

Run from the repo root with `bun run <script>`:

| Command | What it does |
| --- | --- |
| `bun run check` | **The gate.** Runs `typecheck` → `lint` → `test` → `build` in order. Run this before considering any change done. |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check .` (read-only) |
| `bun run format` | `biome check --write .` (auto-fixes lint + format) |
| `bun run test` | `bun test --preload ./test/setup.ts` |
| `bun run build` | Bundles ESM/CJS/min via `scripts/build.ts`, then emits `.d.ts` via `tsc -p tsconfig.build.json` |
| `bun run changeset` | Create a changeset (for releases) |

Run a single test file: `bun test --preload ./test/setup.ts test/app.test.ts`.

`test/setup.ts` installs a `happy-dom` `GlobalWindow` onto `globalThis` (so
`document`, `HTMLElement`, `CustomEvent`, etc. exist) and clears
`document.body` after each test. Any new global the tests rely on must be added
to the `Object.assign(globalThis, …)` block there.

## Source layout (`src/`)

The public entry is `src/index.ts`, which re-exports everything. Internally the
code is split by concern:

- `index.ts` — public API surface and type re-exports. Anything not exported
  here is internal.
- `app.ts` — `createLume()`. Owns the component registry, mounted-instance
  bookkeeping, the per-app event bus, `mount`/`unmount`, `get`/`require`,
  `use(plugin)`, and `Symbol.dispose`.
- `component.ts` — `defineComponent()`. Identity helper purely for type
  inference; it just returns the factory.
- `context.ts` — `createContext()`. Builds the `ComponentContext` handed to each
  factory and tracks per-instance cleanups (effects, listeners, manual cleanups)
  so `unmount` can dispose them.
- `reactivity.ts` — the signals engine: `signal`, `effect`, `computed`,
  `batch`, `untrack`. Push-based, synchronous, dependency tracking via a global
  `activeEffect`. No external dependency.
- `dom.ts` — DOM queries: `queryPart`, `queryParts`, `queryTemplate`,
  `findLumeRoots`. Selectors are built from `data-lume-part` and escaped with
  `CSS.escape`. Missing single parts/templates throw descriptive errors.
- `events.ts` — `createEventBus()` (wraps an `EventTarget` + `CustomEvent`) and
  the shared `globalBus` singleton.
- `types.ts` — all shared types: `SignalGetter`, `EffectFn`, `Dispose`,
  `ComponentContext`, `ComponentFactory`, `Plugin`, `LumeApp`.

## Core concepts

### HTML contract
- `data-lume="<name>"` — marks a component root; `<name>` must match a
  registered component.
- `data-lume-part="<name>"` — marks a named element (or `<template>`) inside a
  root.
- `data-lume-id="<id>"` — optional unique id so the component's returned API can
  be fetched via `app.get(id)` / `app.require(id)`. Duplicate ids throw on
  `mount`.

### Components
A component is `defineComponent((ctx) => publicApi)`. It receives a
`ComponentContext` and returns a plain object that becomes its public API. The
context provides `root`, `part`/`parts`/`template`, `signal`/`computed`/
`effect`/`untrack`, `on` (auto-cleaned event listeners), `cleanup`, and
`emit`/`listen` plus `global.emit`/`global.listen`.

### Reactivity model
- `signal(initial)` returns a getter function with `.set`, `.update`, `.peek`.
- Calling the getter inside an `effect` subscribes that effect; `.peek()` reads
  without subscribing.
- `.set` is a no-op when the value is `Object.is`-equal to the current one.
- `effect(fn)` runs immediately, re-runs when dependencies change, re-tracks
  dependencies on every run, and may return a cleanup function.
- `computed(fn)` is a signal backed by an effect.
- `batch(fn)` defers effect runs until the outermost batch exits.
- `untrack(fn)` reads without subscribing the surrounding effect.
- Disposal: `effect` returns a `Dispose` (callable and `Symbol.dispose`). The
  component context collects all of these so `unmount` tears everything down.

### Events
Three scopes: per-component/per-app bus (`ctx.emit`/`ctx.listen`, `app.emit`/
`app.listen`) and a process-wide `globalBus` (`global.emit`/`global.listen`).
All are built on `EventTarget` + `CustomEvent`; `detail` is the payload.

### Lifecycle
`createLume()` → `.component(name, factory)` (chainable) → `.mount(root?)`
(defaults to `document`, skips already-mounted roots) → `.unmount()` (disposes
all instances). The app itself is `Disposable`.

## Conventions to follow

- **Keep it tiny.** Bundle size is a feature (README advertises ~1 kB gzipped).
  Do not add runtime dependencies; the library has none. Be skeptical of any
  change that grows the output meaningfully — the build reports sizes.
- **No framework features.** Lume deliberately omits a VDOM, JSX, directives,
  router, store, SSR, and devtools (see "What Lume Does Not Do" in `README.md`).
  Don't add them.
- **Errors are prefixed `[lume]`** and name the offending part/id/root. Match
  this style for new error messages.
- **Match existing style**: double quotes, 2-space indent, ES5 trailing commas,
  explicit types on public API, `import type` for type-only imports. Let Biome
  decide formatting — run `bun run format`.
- **Public API changes** must be reflected in `src/index.ts`, the `LumeApp`/
  `ComponentContext` types in `src/types.ts`, the `README.md` tables, and the
  relevant pages under `docs/`.
- **Tests** live in `test/` as `*.test.ts` using `bun:test`
  (`describe`/`test`/`expect`/`mock`). New behavior needs a test; follow the
  `setupDOM(html)` pattern in `test/app.test.ts`.

## Docs site (`docs/`)

A separate **Astro + Starlight** project (`@beardcoder/lume-docs`, private). It
has its own `package.json` and uses **npm** (`package-lock.json`), not Bun.
Content lives in `docs/src/content/docs/`. It is built and deployed to GitHub
Pages on push to `main` via `.github/workflows/docs.yml`. Keep concept/API docs
in sync with library changes.

## Examples (`examples/`)

Static HTML demos (`basic`, `counter`, `tabs`, `toast`) that import directly
from `../../src/index.ts`. Useful as runnable references for the HTML contract
and component patterns.

## CI & releases

- **CI** (`.github/workflows/ci.yml`): on push/PR to `main`, runs
  `bun run check` (typecheck + lint + test + build). This must pass.
- **Versioning**: [Changesets](https://github.com/changesets/changesets).
  `baseBranch` is `main`, `access` public. Add a changeset (`bun run changeset`)
  for any user-facing change.
- **Release** (`release.yml`): triggered by a `v*` tag (or `workflow_call`);
  runs `check`, publishes to npm with provenance, and creates a GitHub Release.
- **Feature Release** (`feature-release.yml`): manual `workflow_dispatch` that
  bumps minor/major, tags, and chains into `release.yml` (supports dry-run).
- Dependabot keeps deps current with auto-merge for passing updates.

## Git workflow for this environment

Develop on the assigned feature branch and push with
`git push -u origin <branch>`. Do not push to `main`. Do not open a pull
request unless explicitly asked.
