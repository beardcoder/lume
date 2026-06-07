---
"@beardcoder/lume": patch
---

Fix `ctx.computed` leaking its internal effect on `unmount`. A computed created
inside a component now disposes its backing effect when the component unmounts,
so computeds derived from longer-lived signals no longer keep recomputing (and
holding the component alive) after teardown.
