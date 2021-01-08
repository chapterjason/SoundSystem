"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationStorage = void 0;
const MigrationList_1 = require("../List/MigrationList");
class MigrationStorage {
    constructor() {
        this.migrations = [];
    }
    add(migration) {
        this.migrations.push(migration);
    }
    getAll() {
        return new MigrationList_1.MigrationList(this.migrations);
    }
}
exports.MigrationStorage = MigrationStorage;
//# sourceMappingURL=MigrationStorage.js.map