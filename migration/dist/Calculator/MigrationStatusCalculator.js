"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationStatusCalculator = void 0;
const MigrationList_1 = require("../List/MigrationList");
class MigrationStatusCalculator {
    constructor(migrationStorage, executedMigrationStorage) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
    }
    async getExecutedUnavailableMigrations() {
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const availableMigrations = this.migrationStorage.getAll();
        return new MigrationList_1.MigrationList([...executedMigrations.getAll()].filter(item => !availableMigrations.has(item.getVersion())));
    }
    async getNewMigrations() {
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const availableMigrations = this.migrationStorage.getAll();
        return new MigrationList_1.MigrationList([...availableMigrations.getAll()].filter(item => !executedMigrations.has(item.getVersion())));
    }
}
exports.MigrationStatusCalculator = MigrationStatusCalculator;
//# sourceMappingURL=MigrationStatusCalculator.js.map