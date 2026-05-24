import { type createEventBus } from "./events";
import type { ComponentContext } from "./types";
export declare function createContext(root: HTMLElement, appBus: ReturnType<typeof createEventBus>): {
    ctx: ComponentContext;
    dispose: () => void;
};
