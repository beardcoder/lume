---
"@beardcoder/lume": minor
---

Add `signal.peek()`, `untrack()`, and harden DOM lookups.

- `signal.peek()` — read the current value without subscribing the surrounding effect.
- `untrack(fn)` — exported and available as `ctx.untrack` inside components. Runs `fn` so any signals read inside are not tracked.
- `queryPart`/`queryParts`/`queryTemplate` now escape the `name` via `CSS.escape`, preventing broken selectors when names contain special characters.
- Part/template "not found" errors now include the component name and id (e.g. `part "x" not found in counter#c1`).
- `mount()` throws if two roots share the same `data-lume-id`, instead of silently overwriting the first instance.
