import { ExecutedMigrationStorageInterface } from "./ExecutedMigrationStorageInterface";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { ExecutedMigration } from "./ExecutedMigration";
import { MigrationList } from "../List/MigrationList";
export declare class ExecutedMigrationMemoryStorage implements ExecutedMigrationStorageInterface {
    private items;
    getAll(): Promise<MigrationList<ExecutedMigration>>;
    complete(result: ExecutionResult): Promise<void>;
    clear(): void;
}
//# sourceMappingURL=ExecutedMigrationMemoryStorage.d.ts.map