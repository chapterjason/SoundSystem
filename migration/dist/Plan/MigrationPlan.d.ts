import { MigrationInterface } from "../Migration/MigrationInterface";
import { Direction } from "../Migration/Direction";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { MigrationListItemInterface } from "../List/MigrationList";
export declare class MigrationPlan implements MigrationListItemInterface {
    private readonly migration;
    private readonly direction;
    private result;
    constructor(migration: MigrationInterface, direction: Direction);
    getResult(): ExecutionResult | null;
    getDirection(): Direction;
    getMigration(): MigrationInterface;
    getVersion(): string;
    markAsExecuted(result: ExecutionResult): void;
}
//# sourceMappingURL=MigrationPlan.d.ts.map