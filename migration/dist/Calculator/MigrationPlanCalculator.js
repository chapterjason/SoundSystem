"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationPlanCalculator = void 0;
const Direction_1 = require("../Migration/Direction");
const MigrationList_1 = require("../List/MigrationList");
const MigrationNotFound_1 = require("../Exception/MigrationNotFound");
const MigrationPlanList_1 = require("../Plan/MigrationPlanList");
const MigrationPlan_1 = require("../Plan/MigrationPlan");
const AlphanumericComparator_1 = require("../Comparator/AlphanumericComparator");
class MigrationPlanCalculator {
    constructor(migrationStorage, executedMigrationStorage) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
    }
    async getPlanForVersions(versions, direction) {
        const migrationsToCheck = this.arrangeMigrationsForDirection(direction, this.getMigrations());
        const availableMigrations = migrationsToCheck.getAll()
            .filter(item => versions.includes(item.getVersion()));
        const plannedMigrations = availableMigrations.map((migration) => new MigrationPlan_1.MigrationPlan(migration, direction));
        if (versions.length !== plannedMigrations.length) {
            const plannedVersions = plannedMigrations.map(plan => plan.getVersion())
                .filter(version => !versions.includes(version));
            throw MigrationNotFound_1.MigrationNotFound.new(plannedVersions.join());
        }
        return new MigrationPlanList_1.MigrationPlanList(plannedMigrations, direction);
    }
    async getPlanUntilVersion(to) {
        const list = this.migrationStorage.getAll();
        if (to !== "0" && !list.has(to)) {
            throw MigrationNotFound_1.MigrationNotFound.new(to);
        }
        const availableMigrations = this.getMigrations();
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const direction = this.findDirection(to, executedMigrations);
        const migrationToCheck = this.arrangeMigrationsForDirection(direction, availableMigrations);
        const toExecute = this.findMigrationsToExecute(to, migrationToCheck, direction, executedMigrations);
        return new MigrationPlanList_1.MigrationPlanList(toExecute.map(item => new MigrationPlan_1.MigrationPlan(item, direction)), direction);
    }
    getMigrations() {
        const availableMigrations = [...this.migrationStorage.getAll().getAll()].sort((a, b) => AlphanumericComparator_1.alphanumericComparator(a.getVersion(), b.getVersion()));
        return new MigrationList_1.MigrationList(availableMigrations);
    }
    findDirection(to, executedMigrations) {
        if (to === "0" || (executedMigrations.has(to) && executedMigrations.getLast().getVersion() !== to)) {
            return Direction_1.Direction.DOWN;
        }
        return Direction_1.Direction.UP;
    }
    arrangeMigrationsForDirection(direction, availableMigrations) {
        const entries = [...availableMigrations.getAll()];
        return new MigrationList_1.MigrationList(direction === Direction_1.Direction.UP ? entries : entries.reverse());
    }
    findMigrationsToExecute(to, migrationsToCheck, direction, executedMigrations) {
        const toExecute = [];
        for (const migration of migrationsToCheck.getAll()) {
            const version = migration.getVersion();
            if (direction === Direction_1.Direction.DOWN && version === to) {
                break;
            }
            if (direction === Direction_1.Direction.UP && !executedMigrations.has(version)) {
                toExecute.push(migration);
            }
            else if (direction === Direction_1.Direction.DOWN && executedMigrations.has(version)) {
                toExecute.push(migration);
            }
            if (direction === Direction_1.Direction.UP && version === to) {
                break;
            }
        }
        return toExecute;
    }
}
exports.MigrationPlanCalculator = MigrationPlanCalculator;
//# sourceMappingURL=MigrationPlanCalculator.js.map