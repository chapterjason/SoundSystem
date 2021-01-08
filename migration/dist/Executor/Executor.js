"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const Direction_1 = require("../Migration/Direction");
const SkipMigration_1 = require("../Exception/SkipMigration");
const ExecutionResult_1 = require("./ExecutionResult");
const State_1 = require("../Migration/State");
class Executor {
    constructor(executedMigrationStorage) {
        this.executedMigrationStorage = executedMigrationStorage;
    }
    async migrate(plan) {
        if (plan.length() === 0) {
            return [];
        }
        const results = [];
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
    async execute(migrationPlan) {
        const version = migrationPlan.getVersion();
        const result = new ExecutionResult_1.ExecutionResult(version, Date.now());
        try {
            await this.executeMigration(migrationPlan, result);
        }
        catch (error) {
            if (error instanceof SkipMigration_1.SkipMigration) {
                result.setSkipped(error);
            }
            else {
                result.setError(error);
            }
        }
        return result;
    }
    async executeMigration(migrationPlan, result) {
        const start = Date.now();
        const direction = migrationPlan.getDirection();
        const migration = migrationPlan.getMigration();
        result.setState(State_1.State.PRE);
        if (direction === Direction_1.Direction.UP) {
            await migration.preUp();
        }
        else if (direction === Direction_1.Direction.DOWN) {
            await migration.preDown();
        }
        result.setState(State_1.State.EXECUTE);
        if (direction === Direction_1.Direction.UP) {
            await migration.up();
        }
        else if (direction === Direction_1.Direction.DOWN) {
            await migration.down();
        }
        result.setState(State_1.State.POST);
        if (direction === Direction_1.Direction.UP) {
            await migration.postUp();
        }
        else if (direction === Direction_1.Direction.DOWN) {
            await migration.postDown();
        }
        const stop = Date.now();
        result.setDuration(stop - start);
        await this.executedMigrationStorage.complete(result);
        result.setState(State_1.State.NONE);
    }
}
exports.Executor = Executor;
//# sourceMappingURL=Executor.js.map