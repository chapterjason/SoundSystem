
export function debounce (exec: (...args: any[]) => Promise<any>, interval: number): () => ReturnType<typeof exec> {
    let handle: NodeJS.Timeout;
    let resolves: Array<(value?: unknown) => void> = [];

    return async (...args: unknown[]) => {
        clearTimeout(handle);
        handle = setTimeout(
            () => {
                const result = exec(...args);
                resolves.forEach(resolve => resolve(result));
                resolves = [];
            },
            interval
        );

        return new Promise(resolve => resolves.push(resolve));
    };
}
