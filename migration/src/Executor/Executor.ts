import { MigrationPlanList } from "../Plan/MigrationPlanList";
import { Direction } from "../Migration/Direction";
import { SkipMigration } from "../Exception/SkipMigration";
import { ExecutionResult } from "./ExecutionResult";
import { State } from "../Migration/State";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationPlan } from "../Plan/MigrationPlan";

export class Executor {

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(executedMigrationStorage: ExecutedMigrationStorageInterface) {
        this.executedMigrationStorage = executedMigrationStorage;
    }

    public async migrate(plan: MigrationPlanList): Promise<ExecutionResult[]> {
        if (plan.length() === 0) {
            return [];
        }

        const results: ExecutionResult[] = [];
        const migrationPlans = plan.getAll();

        for await (const migrationPlan of migrationPlans.getAll()) {
            const result = await this.execute(migrationPlan);

            results.push(result);

            if (result.hasError()) {
                break;
            }
        }

        return results;
    }

    public async execute(migrationPlan: MigrationPlan): Promise<ExecutionResult> {
        const version = migrationPlan.getVersion();
        const result = new ExecutionResult(version, Date.now());

        try {
            await this.executeMigration(migrationPlan, result);
        } catch (error) {
            if (error instanceof SkipMigration) {
                result.setSkipped(error);
            } else {
                result.setError(error);
            }
        }

        return result;

    }

    private async executeMigration(migrationPlan: MigrationPlan, result: ExecutionResult): Promise<void> {
        const start = Date.now();
        const direction = migrationPlan.getDirection();
        const migration = migrationPlan.getMigration();

        result.setState(State.PRE);

        if (direction === Direction.UP) {
            await migration.preUp();
        } else if (direction === Direction.DOWN) {
            await migration.preDown();
        }

        result.setState(State.EXECUTE);

        if (direction === Direction.UP) {
            await migration.up();
        } else if (direction === Direction.DOWN) {
            await migration.down();
        }

        result.setState(State.POST);

        if (direction === Direction.UP) {
            await migration.postUp();
        } else if (direction === Direction.DOWN) {
            await migration.postDown();
        }

        const stop = Date.now();

        result.setDuration(stop - start);

        await this.executedMigrationStorage.complete(result);

        result.setState(State.NONE);

    }

}
