"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationPlanList = void 0;
const MigrationList_1 = require("../List/MigrationList");
class MigrationPlanList {
    constructor(migrations, direction) {
        this.migrations = migrations;
        this.direction = direction;
    }
    length() {
        return this.migrations.length;
    }
    getDirection() {
        return this.direction;
    }
    getAll() {
        return new MigrationList_1.MigrationList(this.migrations);
    }
}
exports.MigrationPlanList = MigrationPlanList;
//# sourceMappingURL=MigrationPlanList.js.map