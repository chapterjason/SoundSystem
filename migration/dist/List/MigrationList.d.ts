export interface MigrationListItemInterface {
    getVersion(): string;
}
export declare class MigrationList<T extends MigrationListItemInterface> {
    protected migrations: T[];
    constructor(migrations: T[]);
    getAll(): T[];
    getFirst(offset?: number): T;
    getLast(offset?: number): T;
    get(version: string): T;
    has(version: string): boolean;
    length(): number;
}
//# sourceMappingURL=MigrationList.d.ts.map