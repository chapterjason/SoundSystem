import { ExecutedMigrationStorageInterface } from "./ExecutedMigrationStorageInterface";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { ExecutedMigration } from "./ExecutedMigration";
import { MigrationList } from "../List/MigrationList";

export class ExecutedMigrationMemoryStorage implements ExecutedMigrationStorageInterface {

    private items: ExecutedMigration[] = [];

    public async getAll() {
        return new MigrationList(this.items);
    }

    public async complete(result: ExecutionResult): Promise<void> {
        this.items.push(result.toExecutedMigration());
    }

    public clear() {
        this.items = [];
    }
}
