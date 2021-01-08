import { MigrationPlanList } from "../Plan/MigrationPlanList";
import { ExecutionResult } from "./ExecutionResult";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationPlan } from "../Plan/MigrationPlan";
export declare class Executor {
    private executedMigrationStorage;
    constructor(executedMigrationStorage: ExecutedMigrationStorageInterface);
    migrate(plan: MigrationPlanList): Promise<ExecutionResult[]>;
    execute(migrationPlan: MigrationPlan): Promise<ExecutionResult>;
    private executeMigration;
}
//# sourceMappingURL=Executor.d.ts.map