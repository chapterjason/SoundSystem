/*
import { MigrationStorageInterface } from "./Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "./Executed/ExecutedMigrationStorageInterface";
import { AliasResolver } from "./Alias/AliasResolver";
import { Alias } from "./Alias/Alias";
import { MigrationNotFound } from "./Exception/MigrationNotFound";
import { NoMigrationsToExecute } from "./Exception/NoMigrationsToExecute";
import { MigrationStatusCalculator } from "./Calculator/MigrationStatusCalculator";
import { MigrationList } from "./List/MigrationList";
import { UnknownMigrationVersion } from "./Exception/UnknownMigrationVersion";
import { NoMigrationsFoundWithCriteria } from "./Exception/NoMigrationsFoundWithCriteria";
import { Direction } from "./Migration/Direction";
import { MigrationPlanCalculator } from "./Calculator/MigrationPlanCalculator";
import { Executor } from "./Executor/Executor";
import { ExecutedMigration } from "./Executed/ExecutedMigration";
import { alphanumericComparator } from "./Comparator/AlphanumericComparator";

export class Service {

    private storage: MigrationStorageInterface;

    private resolver: AliasResolver;

    private state: ExecutedMigrationStorageInterface;

    public constructor(storage: MigrationStorageInterface, state: ExecutedMigrationStorageInterface, resolver: AliasResolver) {
        this.state = state;
        this.resolver = resolver;
        this.storage = storage;
    }

    public getStorage(): MigrationStorageInterface {
        return this.storage;
    }



    public async upToDate() {
        const statusCalculator = new MigrationStatusCalculator(this.storage, this.state);

        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();
        const newMigrations = await statusCalculator.getNewMigrations();
        const newMigrationsCount = newMigrations.length();
        const executedUnavailableMigrationsCount = executedUnavailableMigrations.length();

        if (newMigrationsCount === 0 && executedUnavailableMigrationsCount === 0) {
            console.log("Up-to-date! No migrations to execute.");
            return;
        }

        if (newMigrationsCount > 0) {
            console.error(`Out-of-date! ${newMigrationsCount} migration${newMigrationsCount > 1 ? "s are" : " is"} available to execute.`);
        }

        if (executedUnavailableMigrationsCount > 0) {
            const second = executedUnavailableMigrationsCount > 1 ? "s" : "";
            console.error(`You have ${executedUnavailableMigrationsCount} previously executed migration${second} in the database that ${executedUnavailableMigrationsCount > 1 ? "are not" : "is not a"} registered migration${second}.`);
        }
    }



}
*/
