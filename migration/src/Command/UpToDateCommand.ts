import { Command, InputInterface, InputOptions, OptionMode, OutputInterface, StyledOutput } from "@mscs/console";
import { VersionAliasResolver } from "../Alias/VersionAliasResolver";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationStatusCalculator } from "../Calculator/MigrationStatusCalculator";
import { MigrationList } from "../List/MigrationList";
import { MigrationInterface } from "../Migration/MigrationInterface";
import { ExecutedMigration } from "../Executed/ExecutedMigration";
import { alphanumericComparator } from "../Comparator/AlphanumericComparator";
import { MigrationStatusInfosHelper } from "../Utils/MigrationStatusInfosHelper";

interface UpToDateCommandOptions extends InputOptions {
    "list-migrations": boolean;
}

export class UpToDateCommand extends Command<{}, UpToDateCommandOptions> {

    protected migrationStorage: MigrationStorageInterface;

    protected versionAliasResolver: VersionAliasResolver;

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        super();
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
        this.versionAliasResolver = new VersionAliasResolver(this.migrationStorage, this.executedMigrationStorage);
    }

    protected configure(): void {
        this
            .setName("migrations:up-to-date")
            .setAliases(["up-to-date"])
            .setDescription("Tells you if your environment is up-to-date.")
            .addOption("list-migrations", "l", OptionMode.VALUE_NONE, "Show a list of missing or not migrated versions.")
        ;
    }

    protected async execute(input: InputInterface<{}, UpToDateCommandOptions>, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const statusCalculator = new MigrationStatusCalculator(this.migrationStorage, this.executedMigrationStorage);

        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();
        const newMigrations = await statusCalculator.getNewMigrations();
        const newMigrationsCount = newMigrations.length();
        const executedUnavailableMigrationsCount = executedUnavailableMigrations.length();

        if (newMigrationsCount === 0 && executedUnavailableMigrationsCount === 0) {
            io.success("Up-to-date! No migrations to execute.");

            return 0;
        }

        let exitCode = 0;
        if (newMigrationsCount > 0) {
            io.error(`Out-of-date! ${newMigrationsCount} migration${newMigrationsCount > 1 ? "s are" : " is"} available to execute.`);

            exitCode = 1;
        }

        if (executedUnavailableMigrationsCount > 0) {
            const second = executedUnavailableMigrationsCount > 1 ? "s" : "";
            console.error(`You have ${executedUnavailableMigrationsCount} previously executed migration${second} in the database that ${executedUnavailableMigrationsCount > 1 ? "are not" : "is not a"} registered migration${second}.`);
        }

        if (input.getOption("list-migrations")) {
            const versions = this.getSortedVersions(newMigrations, executedUnavailableMigrations);
            const helper = new MigrationStatusInfosHelper(this.migrationStorage, this.executedMigrationStorage);

            await helper.listVersions(io, versions);
        }

        return exitCode;
    }

    private getSortedVersions(newMigrations: MigrationList<MigrationInterface>, executedUnavailableMigrations: MigrationList<ExecutedMigration>): string[] {
        const executedUnavailableVersion = executedUnavailableMigrations.getAll().map(migration => migration.getVersion());
        const newVersions = newMigrations.getAll().map(migration => migration.getVersion());

        const versions = [
            ...executedUnavailableVersion,
            ...newVersions,
        ].filter((value, index, self) => {
            return self.indexOf(value) === index;
        });

        return versions.sort(alphanumericComparator);
    }
}

