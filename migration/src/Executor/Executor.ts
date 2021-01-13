import { MigrationPlanList } from "../Plan/MigrationPlanList";
import { Direction } from "../Migration/Direction";
import { SkipMigration } from "../Exception/SkipMigration";
import { ExecutionResult } from "./ExecutionResult";
import { State } from "../Migration/State";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationPlan } from "../Plan/MigrationPlan";
import { StyledOutput } from "@mscs/console";
import { MigrationInterface } from "../Migration/MigrationInterface";

export class Executor {

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    private io: StyledOutput;

    public constructor(executedMigrationStorage: ExecutedMigrationStorageInterface, io: StyledOutput) {
        this.executedMigrationStorage = executedMigrationStorage;
        this.io = io;
    }

    public getMigrationHeader(plan: MigrationPlan, migration: MigrationInterface, direction: Direction): string {
        const version = plan.getVersion();
        const description = migration.getDescription();

        let info = version;

        if (description !== "") {
            info += ` (${description})`;
        }

        if (direction === Direction.UP) {
            return `++ migrating ${info}`;
        }

        return `++ reverting ${info}`;
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
                if (result.getState() === State.EXECUTE) {
                    const otherDirection = migrationPlan.getDirection() === Direction.UP ? Direction.DOWN : Direction.UP;
                    const migration = migrationPlan.getMigration();
                    const revertPlan = new MigrationPlan(migration, otherDirection);

                    const result = await this.execute(revertPlan);

                    results.push(result);
                }

                break;
            }
        }

        return results;
    }

    public async execute(migrationPlan: MigrationPlan): Promise<ExecutionResult> {
        const version = migrationPlan.getVersion();
        const direction = migrationPlan.getDirection();
        const result = new ExecutionResult(version, Date.now(), direction);

        try {
            await this.executeMigration(migrationPlan, result);
        } catch (error) {
            if (error instanceof SkipMigration) {
                result.setSkipped(error);
                this.io.error(`Migration ${version} skipped during ${result.getState()}. Reason: "${error.message}"`);
            } else {
                result.setError(error);
                this.io.error(`Migration ${version} failed during ${result.getState()}. Reason: "${error.message}"`);
            }
        }

        return result;

    }

    private async executeMigration(migrationPlan: MigrationPlan, result: ExecutionResult): Promise<void> {
        const start = Date.now();
        const version = migrationPlan.getVersion();
        const direction = migrationPlan.getDirection();
        const migration = migrationPlan.getMigration();

        result.setState(State.PRE);

        if (direction === Direction.UP) {
            await migration.preUp();
        } else if (direction === Direction.DOWN) {
            await migration.preDown();
        }

        this.io.note(this.getMigrationHeader(migrationPlan, migration, direction));

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

        this.io.note(`Migration ${version} ${direction} (took ${result.getDuration()}ms)`);

        result.setState(State.NONE);

    }

}
