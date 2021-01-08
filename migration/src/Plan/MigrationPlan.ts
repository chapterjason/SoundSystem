import { MigrationInterface } from "../Migration/MigrationInterface";
import { Direction } from "../Migration/Direction";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { PlanAlreadyExecuted } from "../Exception/PlanAlreadyExecuted";
import { MigrationListItemInterface } from "../List/MigrationList";

export class MigrationPlan implements MigrationListItemInterface {

    private readonly migration: MigrationInterface;

    private readonly direction: Direction;

    private result: ExecutionResult | null = null;

    public constructor(migration: MigrationInterface, direction: Direction) {
        this.migration = migration;
        this.direction = direction;
    }

    public getResult(): ExecutionResult | null {
        return this.result;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public getMigration(): MigrationInterface {
        return this.migration;
    }

    public getVersion(): string {
        return this.migration.getVersion();
    }

    public markAsExecuted(result: ExecutionResult) {
        if (this.result !== null) {
            throw PlanAlreadyExecuted.new();
        }

        this.result = result;
    }
}
