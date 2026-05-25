import type { ComponentDefinition, ComponentFactory } from "./types";

export function defineComponent<T extends Record<string, unknown>>(
  factory: ComponentFactory<T>
): ComponentDefinition<T> {
  return { factory };
}
