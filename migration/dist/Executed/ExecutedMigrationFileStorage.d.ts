import { ExecutedMigrationStorageInterface } from "./ExecutedMigrationStorageInterface";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { ExecutedMigration } from "./ExecutedMigration";
import { MigrationList } from "../List/MigrationList";
import { ExecutedMigrationData } from "./ExecutedMigrationData";
export declare class ExecutedMigrationFileStorage implements ExecutedMigrationStorageInterface {
    private readonly file;
    private list;
    constructor(file: string);
    load(): Promise<ExecutedMigrationData[]>;
    save(executedMigrations: ExecutedMigrationData[]): Promise<void>;
    getAll(): Promise<MigrationList<ExecutedMigration>>;
    complete(result: ExecutionResult): Promise<void>;
    private loadList;
}
//# sourceMappingURL=ExecutedMigrationFileStorage.d.ts.map