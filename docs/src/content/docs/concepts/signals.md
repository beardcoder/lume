---
title: Signals & Effects
description: Fine-grained reactivity with signals and effects.
---

Lume uses a signal-based reactivity system. Signals hold values, and effects automatically re-run when their dependencies change.

## Signals

A signal is a reactive value container:

```ts
const count = signal(0);

// Read the current value
count(); // → 0

// Set a new value
count.set(5);

// Update based on current value
count.update((v) => v + 1); // → 6
```

### Signal API

| Method | Description |
| --- | --- |
| `signal()` | Read the current value |
| `signal.set(value)` | Set a new value |
| `signal.update(fn)` | Transform the current value |

## Effects

Effects are functions that automatically re-run when any signal they read changes:

```ts
const name = signal("World");

effect(() => {
  console.log(`Hello, ${name()}!`);
});
// Logs: "Hello, World!"

name.set("Lume");
// Logs: "Hello, Lume!"
```

### How Tracking Works

Effects use synchronous tracking. When an effect runs:

1. Lume records which signals are read (called)
2. When any of those signals change, the effect re-runs
3. Dependencies are re-computed on every run (dynamic tracking)

### Effect Cleanup

Effects can return a cleanup function that runs before each re-execution and on unmount:

```ts
effect(() => {
  const interval = setInterval(() => console.log(count()), 1000);
  
  return () => clearInterval(interval); // cleanup
});
```

## Practical Example

```ts
const disclosure = defineComponent(({ part, signal, on, effect }) => {
  const button = part("button");
  const panel = part("panel");
  const open = signal(false);

  on(button, "click", () => open.update((v) => !v));

  effect(() => {
    // This effect re-runs whenever `open` changes
    panel.hidden = !open();
    button.setAttribute("aria-expanded", String(open()));
  });
});
```

## Key Principles

- **Synchronous**: Signal reads are synchronous and tracked automatically
- **Fine-grained**: Only effects that depend on a changed signal re-run
- **No batching needed**: Updates are immediate and predictable
- **Auto-cleanup**: All effects are cleaned up when the component unmounts
