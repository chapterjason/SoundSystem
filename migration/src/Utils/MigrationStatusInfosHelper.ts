import { OutputInterface, StyledOutput } from "@mscs/console";
import { TablePrinter } from "./TablePrinter";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { MigrationStatusCalculator } from "../Calculator/MigrationStatusCalculator";
import { VersionAlias } from "../Alias/VersionAlias";
import { VersionAliasResolver } from "../Alias/VersionAliasResolver";

export class MigrationStatusInfosHelper {

    private readonly migrationStorage: MigrationStorageInterface;

    private readonly executedMigrationStorage: ExecutedMigrationStorageInterface;

    private versionAliasResolver: VersionAliasResolver;

    constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
        this.versionAliasResolver = new VersionAliasResolver(this.migrationStorage, this.executedMigrationStorage);
    }

    public async listVersions(io: StyledOutput, versions: string[]) {
        const executedVersions = await this.executedMigrationStorage.getAll();
        const availableVersions = await this.migrationStorage.getAll();

        const headers = ["Migration", "Status", "Migrated At", "Execution Time", "Description"];
        const rows: string[][] = [];

        for (const version of versions) {
            let status = null;
            let executedAt = null;
            let executionTime = null;
            let description = "";

            if (executedVersions.has(version) && availableVersions.has(version)) {
                status = "migrated";
            } else if (executedVersions.has(version)) {
                status = "migrated, not available";
            } else {
                status = "not migrated";
            }

            if (executedVersions.has(version)) {
                const migration = executedVersions.get(version);
                executedAt = new Date(migration.getTimestamp());
                executionTime = migration.getDuration();
            }

            if (availableVersions.has(version)) {
                description = availableVersions.get(version).getDescription();
            }

            const row = [
                version,
                status,
                this.formatDate(executedAt),
                executionTime !== null ? executionTime + "ms" : "",
                description,
            ];

            rows.push(row);
        }

        const printer = new TablePrinter(io.getOutput());

        printer.printTable(headers, rows);

        io.newLine();
    }

    public async displayStatus(io: StyledOutput) {
        const availableVersions = this.migrationStorage.getAll();
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const statusCalculator = new MigrationStatusCalculator(this.migrationStorage, this.executedMigrationStorage);

        const newMigrations = await statusCalculator.getNewMigrations();
        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();

        const migrations = [
            ["Executed", executedMigrations.length()],
            ["Executed Unavailable", executedUnavailableMigrations.length() > 0 ? executedUnavailableMigrations.length() : "0"],
            ["Available", availableVersions.length()],
            ["New", newMigrations.length() > 0 ? newMigrations.length() : "0"],
        ];

        const versions = [
            ["Previous", await this.getFormattedVersionAlias(VersionAlias.PREVIOUS)],
            ["Current", await this.getFormattedVersionAlias(VersionAlias.CURRENT)],
            ["Next", await this.getFormattedVersionAlias(VersionAlias.NEXT)],
            ["Latest", await this.getFormattedVersionAlias(VersionAlias.LATEST)],
        ];

        const printer = new TablePrinter(io);
        const headers = ["Key", "Value"];

        printer.printTable(headers, migrations);

        io.newLine();

        printer.printTable(headers, versions);
    }

    protected formatDate(date: Date | null): string {
        if (!date) {
            return "";
        }

        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    private async getFormattedVersionAlias(alias: VersionAlias) {
        let version;

        try {
            version = await this.versionAliasResolver.resolveVersionAlias(alias);
        } catch {
            version = null;
        }

        if (version === null) {
            if (alias === VersionAlias.NEXT) {
                return "Already at latest version";
            }

            if (alias === VersionAlias.PREVIOUS) {
                return "Already at first version";
            }
        }

        if (version === "0") {
            return "<comment>0</comment>";
        }

        return `<comment>${version} </comment>`;

    }

}
