"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliasResolver = void 0;
const Alias_1 = require("./Alias");
const MigrationStatusCalculator_1 = require("../Calculator/MigrationStatusCalculator");
const NoMigrationsFoundWithCriteria_1 = require("../Exception/NoMigrationsFoundWithCriteria");
const UnknownMigrationVersion_1 = require("../Exception/UnknownMigrationVersion");
const NoMigrationsToExecute_1 = require("../Exception/NoMigrationsToExecute");
class AliasResolver {
    constructor(migrationStorage, executedMigrationStorage) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
        this.migrationStatusCalculator = new MigrationStatusCalculator_1.MigrationStatusCalculator(this.migrationStorage, this.executedMigrationStorage);
    }
    async resolveVersionAlias(alias) {
        const availableMigrations = this.migrationStorage.getAll();
        const executedMigrations = await this.executedMigrationStorage.getAll();
        switch (alias) {
            case Alias_1.Alias.FIRST:
                return "0";
            case Alias_1.Alias.CURRENT:
                try {
                    return executedMigrations.getLast().getVersion();
                }
                catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria_1.NoMigrationsFoundWithCriteria) {
                        return "0";
                    }
                    else {
                        throw error;
                    }
                }
            case Alias_1.Alias.PREVIOUS:
                try {
                    return executedMigrations.getLast(-1).getVersion();
                }
                catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria_1.NoMigrationsFoundWithCriteria) {
                        return "0";
                    }
                    else {
                        throw error;
                    }
                }
            case Alias_1.Alias.NEXT:
                const newMigrations = await this.migrationStatusCalculator.getNewMigrations();
                try {
                    return newMigrations.getFirst().getVersion();
                }
                catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria_1.NoMigrationsFoundWithCriteria) {
                        throw NoMigrationsToExecute_1.NoMigrationsToExecute.new(error);
                    }
                    else {
                        throw error;
                    }
                }
            case Alias_1.Alias.LATEST:
                try {
                    return availableMigrations.getLast().getVersion();
                }
                catch (error) {
                    if (error instanceof NoMigrationsFoundWithCriteria_1.NoMigrationsFoundWithCriteria) {
                        return this.resolveVersionAlias(Alias_1.Alias.CURRENT);
                    }
                    else {
                        throw error;
                    }
                }
            default:
                if (availableMigrations.has(alias)) {
                    return alias;
                }
                if (alias.toString().substr(0, 7) === Alias_1.Alias.CURRENT) {
                    const value = parseInt(alias.toString().substr(7), 10);
                    if (value > 0) {
                        const newMigrations = await this.migrationStatusCalculator.getNewMigrations();
                        return newMigrations.getFirst(value - 1).getVersion();
                    }
                    return executedMigrations.getLast(value).getVersion();
                }
        }
        throw UnknownMigrationVersion_1.UnknownMigrationVersion.new(alias);
    }
}
exports.AliasResolver = AliasResolver;
//# sourceMappingURL=AliasResolver.js.map