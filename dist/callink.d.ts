declare const TRANSFER: unique symbol;
type WithTransfer<T> = T & {
    [TRANSFER]?: Transferable[];
};
/** 인자에 붙일 Transferable 헬퍼 */
export declare function transfer<T>(value: T, list: Transferable[]): WithTransfer<T>;
export declare function connect<T extends Record<string, any>>(): { [K in keyof T]: T[K] extends (...args: any[]) => infer R ? (...args: [...Parameters<T[K]>, (Transferable[] | undefined)?]) => Promise<Awaited<R>> : Promise<T[K]>; };
export declare function provide<T extends Record<string, any>>(worker: Worker, api: T): void;
export declare const Callink: {
    readonly connect: typeof connect;
    readonly provide: typeof provide;
    readonly transfer: typeof transfer;
};
export {};
