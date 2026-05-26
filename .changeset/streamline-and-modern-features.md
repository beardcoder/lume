---
"@beardcoder/lume": minor
---

Streamline core, add modern reactivity primitives, and modernize the codebase to TS6 / ES2024+.

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
