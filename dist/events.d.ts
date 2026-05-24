export type EventBus = {
    emit(name: string, detail?: unknown): void;
    listen(name: string, handler: (detail: unknown) => void): () => void;
};
export declare function createEventBus(target?: EventTarget): EventBus;
export declare const globalBus: EventBus;
