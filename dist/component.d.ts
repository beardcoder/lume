import type { ComponentDefinition, ComponentFactory } from "./types";
export declare function defineComponent<T extends Record<string, unknown>>(factory: ComponentFactory<T>): ComponentDefinition<T>;
