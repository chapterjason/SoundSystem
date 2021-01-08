"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedMigrationMemoryStorage = void 0;
const MigrationList_1 = require("../List/MigrationList");
class ExecutedMigrationMemoryStorage {
    constructor() {
        this.items = [];
    }
    async getAll() {
        return new MigrationList_1.MigrationList(this.items);
    }
    async complete(result) {
        this.items.push(result.toExecutedMigration());
    }
    clear() {
        this.items = [];
    }
}
exports.ExecutedMigrationMemoryStorage = ExecutedMigrationMemoryStorage;
//# sourceMappingURL=ExecutedMigrationMemoryStorage.js.map