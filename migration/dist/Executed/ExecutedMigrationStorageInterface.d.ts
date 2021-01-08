import { MigrationList } from "../List/MigrationList";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { ExecutedMigration } from "./ExecutedMigration";
export interface ExecutedMigrationStorageInterface {
    getAll(): Promise<MigrationList<ExecutedMigration>>;
    complete(result: ExecutionResult): Promise<void>;
}
//# sourceMappingURL=ExecutedMigrationStorageInterface.d.ts.map