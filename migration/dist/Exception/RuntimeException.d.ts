export declare class RuntimeException extends Error {
    private readonly previous?;
    constructor(message?: string, previous?: Error);
    getPrevious(): Error | undefined;
}
//# sourceMappingURL=RuntimeException.d.ts.map