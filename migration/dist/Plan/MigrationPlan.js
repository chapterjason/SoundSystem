"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationPlan = void 0;
const PlanAlreadyExecuted_1 = require("../Exception/PlanAlreadyExecuted");
class MigrationPlan {
    constructor(migration, direction) {
        this.result = null;
        this.migration = migration;
        this.direction = direction;
    }
    getResult() {
        return this.result;
    }
    getDirection() {
        return this.direction;
    }
    getMigration() {
        return this.migration;
    }
    getVersion() {
        return this.migration.getVersion();
    }
    markAsExecuted(result) {
        if (this.result !== null) {
            throw PlanAlreadyExecuted_1.PlanAlreadyExecuted.new();
        }
        this.result = result;
    }
}
exports.MigrationPlan = MigrationPlan;
//# sourceMappingURL=MigrationPlan.js.map