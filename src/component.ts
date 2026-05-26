import type { ComponentFactory } from "./types";

export function defineComponent<T extends Record<string, unknown>>(
  factory: ComponentFactory<T>
): ComponentFactory<T> {
  return factory;
}
