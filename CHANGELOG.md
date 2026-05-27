# @beardcoder/lume

## 0.5.0

### Minor Changes

- 6b08091: Add `signal.peek()`, `untrack()`, and harden DOM lookups.

  - `signal.peek()` — read the current value without subscribing the surrounding effect.
  - `untrack(fn)` — exported and available as `ctx.untrack` inside components. Runs `fn` so any signals read inside are not tracked.
  - `queryPart`/`queryParts`/`queryTemplate` now escape the `name` via `CSS.escape`, preventing broken selectors when names contain special characters.
  - Part/template "not found" errors now include the component name and id (e.g. `part "x" not found in counter#c1`).
  - `mount()` throws if two roots share the same `data-lume-id`, instead of silently overwriting the first instance.

## 0.4.0

### Minor Changes

- ae287b7: Streamline core, add modern reactivity primitives, and modernize the codebase to TS6 / ES2024+.

  **New**

  - `computed(fn)` — derived signals that track their dependencies automatically.
  - `batch(fn)` — group multiple `set` calls into a single effect run.
  - `Symbol.dispose` support — `effect()` and `createLume()` are usable with the `using` keyword.
  - Generic `part<T>()` / `parts<T>()` for typed element queries.
  - New examples: `examples/counter` (signals + computed), `examples/tabs` (parts list + effect).

  **Improvements**

  - `mount()` is now idempotent — re-mounting the same root skips already-mounted elements.
  - `unmount()` properly removes instances by id.
  - Internal refactors for tighter, simpler reactivity (~25% smaller core).

  **Refactor (non-breaking for typical users)**

  - `defineComponent` now returns the factory directly; the `ComponentDefinition` wrapper type was removed. If you used `defineComponent`, your code keeps working.
  - Switched `tsconfig` target to ES2024 with `noUncheckedIndexedAccess`.
