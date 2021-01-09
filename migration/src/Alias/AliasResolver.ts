import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { Alias } from "./Alias";
import { MigrationStatusCalculator } from "../Calculator/MigrationStatusCalculator";
import { NoMigrationsFoundWithCriteria } from "../Exception/NoMigrationsFoundWithCriteria";
import { UnknownMigrationVersion } from "../Exception/UnknownMigrationVersion";
import { NoMigrationsToExecute } from "../Exception/NoMigrationsToExecute";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";

export class AliasResolver {

    private migrationStorage: MigrationStorageInterface;

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    private migrationStatusCalculator: MigrationStatusCalculator;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
        this.migrationStatusCalculator = new MigrationStatusCalculator(this.migrationStorage, this.executedMigrationStorage);
    }

    public async resolveVersionAlias(alias: Alias | string): Promise<string> {
        const availableMigrations = this.migrationStorage.getAll();
        const executedMigrations = await this.executedMigrationStorage.getAll();

        switch (alias) {
            case "0":
            case Alias.FIRST:
                return "0";
            case  Alias.CURRENT:
                try {
                    return executedMigrations.getLast().getVersion();
                } catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria) {
                        return "0";
                    } else {
                        throw error;
                    }
                }
            case Alias.PREVIOUS:
                try {
                    return executedMigrations.getLast(-1).getVersion();
                } catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria) {
                        return "0";
                    } else {
                        throw error;
                    }
                }
            case Alias.NEXT:
                const newMigrations = await this.migrationStatusCalculator.getNewMigrations();

                try {
                    return newMigrations.getFirst().getVersion();
                } catch (error) { // NoMigrationsFoundWithCriteria
                    if (error instanceof NoMigrationsFoundWithCriteria) {
                        throw NoMigrationsToExecute.new(error);
                    } else {
                        throw error;
                    }
                }
            case Alias.LATEST:
                try {
                    return availableMigrations.getLast().getVersion();
                } catch (error) {
                    if (error instanceof NoMigrationsFoundWithCriteria) {
                        return this.resolveVersionAlias(Alias.CURRENT);
                    } else {
                        throw error;
                    }
                }
            default:
                if (availableMigrations.has(alias)) {
                    return alias;
                }

                if (alias.toString().substr(0, 7) === Alias.CURRENT) {
                    const value = parseInt(alias.toString().substr(7), 10);
                    if (value > 0) {
                        const newMigrations = await this.migrationStatusCalculator.getNewMigrations();

                        return newMigrations.getFirst(value - 1).getVersion();
                    }

                    return executedMigrations.getLast(value).getVersion();
                }
        }

        throw UnknownMigrationVersion.new(alias);
    }

}
