"use strict";
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

    public async current() {
        const version = await this.resolver.resolveVersionAlias(Alias.CURRENT);

        if (version === "0") {
            console.log("0 - (No migration executed yet)");
        } else {
            try {
                const availableMigration = this.storage.getAll().get(version);
                console.log(`${version} - ${availableMigration.getDescription()}`);
            } catch (error) { // MigrationClassNotFound
                if (error instanceof MigrationNotFound) {
                    console.log(`${version} - (Migration info not available)`);
                } else {
                    throw error;
                }
            }
        }
    }

    public async latest() {
        let version = "";
        let description = "";
        try {
            version = await this.resolver.resolveVersionAlias(Alias.LATEST);
            const migration = this.storage.getAll().get(version);
            description = migration.getDescription();
        } catch (error) {
            if (error instanceof NoMigrationsToExecute) {
                description = "";
                version = "0";
            } else {
                throw error;
            }
        }

        console.log(`${version}${description !== "" ? ` - ${description}` : ""}`);
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

    public async status() {
        const executedMigrations = await this.state.getAll();
        const availableVersions = this.storage.getAll();
        const statusCalculator = new MigrationStatusCalculator(this.storage, this.state);

        const newMigrations = await statusCalculator.getNewMigrations();
        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();

        const migrations = {
            "Executed": executedMigrations.length(),
            "Executed Unavailable": executedUnavailableMigrations.length() > 0 ? executedUnavailableMigrations.length() : "0",
            "Available": availableVersions.length(),
            "New": newMigrations.length() > 0 ? newMigrations.length() : "0",
        };

        const versions = {
            Previous: this.getFormattedVersionAlias(Alias.PREVIOUS),
            Current: this.getFormattedVersionAlias(Alias.CURRENT),
            Next: this.getFormattedVersionAlias(Alias.NEXT),
            Latest: this.getFormattedVersionAlias(Alias.LATEST),
        };

        console.table(versions);

        console.table(migrations);
    }

    public async migrate(versionAlias: string | Alias = Alias.LATEST) {
        if (this.storage.getAll().length() === 0) {
            console.error(`The version "${versionAlias}" couldn't be reached, there are no registered migrations.`);
            return;
        }

        let version: string;

        try {
            version = await this.resolver.resolveVersionAlias(versionAlias);
        } catch (error) {
            if (error instanceof UnknownMigrationVersion) {
                console.error(`Unknown version: ${versionAlias}`);
            } else if (error instanceof NoMigrationsToExecute || error instanceof NoMigrationsFoundWithCriteria) {
                this.exitForAlias(versionAlias);
            }

            return;
        }

        const planCalculator = new MigrationPlanCalculator(this.storage, this.state);
        const statusCalculator = new MigrationStatusCalculator(this.storage, this.state);
        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();

        this.checkExecutedUnavailableMigrations(executedUnavailableMigrations);

        const plan = await planCalculator.getPlanUntilVersion(version);

        if (plan.length() === 0) {
            this.exitForAlias(versionAlias);
            return;
        }

        console.log(`Migrating ${Direction[plan.getDirection()]} to ${version}`);

        const migrator = new Executor(this.state);

        await migrator.migrate(plan);
    }

    public async execute(versions: string[], direction: Direction = Direction.UP, dry: boolean = false) {
        const planCalculator = new MigrationPlanCalculator(this.storage, this.state);
        const plan = await planCalculator.getPlanForVersions(versions, direction);

        console.log(`Executing ${versions.join(", ")} ${Direction[direction]}`);

        const migrator = new Executor(this.state);

        await migrator.migrate(plan);
    }

    public async list() {
        const executedVersions = await this.state.getAll();
        const availableVersions = await this.storage.getAll();
        const versions: string[] = [...executedVersions.getAll().map(item => item.getVersion()), ...availableVersions.getAll().map(item => item.getVersion())].sort(alphanumericComparator);
        const migrations: Record<string, any> = {};

        for (const version of versions) {
            let description = null;
            let executedAt = null;
            let executionTime = null;
            let status = null;

            if (executedVersions.has(version)) {
                const migration = executedVersions.get(version);
                executionTime = migration.getDuration();
                executedAt = new Date(migration.getTimestamp());
            }

            if (availableVersions.has(version)) {
                description = this.storage.getAll().get(version).getDescription();
            }

            if (executedVersions.has(version) && availableVersions.has(version)) {
                status = "migrated";
            } else if (executedVersions.has(version)) {
                status = "migrated, not available";
            } else {
                status = "not migrated";
            }

            migrations[version] = {
                status,
                executedAt,
                executionTime: executionTime !== null ? `${executionTime}s` : "",
                description,
            };
        }

        console.table(migrations);
    }

    private checkExecutedUnavailableMigrations(executedUnavailableMigrations: MigrationList<ExecutedMigration>) {
        if (executedUnavailableMigrations.length() !== 0) {
            console.warn(`You have ${executedUnavailableMigrations.length()} previously executed migrations in the storage that are not registered migrations.`);

            for (const [version, executedUnavailableMigration] of executedUnavailableMigrations.getAll().entries()) {
                const timestamp = new Date(executedUnavailableMigration.getTimestamp());
                const formatted = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
                console.log(`>> ${formatted} (${version})`);
            }
        }
    }

    private async getFormattedVersionAlias(alias: Alias) {
        let version;

        try {
            version = await this.resolver.resolveVersionAlias(alias);
        } catch {
            version = null;
        }

        if (version === null) {
            if (alias === Alias.NEXT) {
                return "Already at latest version";
            }

            if (alias === Alias.PREVIOUS) {
                return "Already at first version";
            }
        }

        return version;

    }

    private exitForAlias(versionAlias: string | Alias): void {
        const version = this.resolver.resolveVersionAlias(Alias.CURRENT);

        if (versionAlias === Alias.CURRENT || versionAlias === Alias.LATEST || versionAlias === Alias.FIRST) {
            console.log(`Already at the ${versionAlias} version ("${version}")`);
        }
    }
}
*/
//# sourceMappingURL=Service.js.map