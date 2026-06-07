---
"@beardcoder/lume": patch
---

Reduce bundle size (~1.35 kB → ~1.3 kB gzipped minified). Drop the
`CSS.escape` feature-detection fallback (it is supported everywhere the library
runs), share a single `Dispose` helper between the reactivity and event
modules, and factor out the duplicated effect-teardown logic.
