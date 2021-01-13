import { ArgumentMode, Command, InputArguments, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationPlanCalculator } from "../Calculator/MigrationPlanCalculator";
import { Executor } from "../Executor/Executor";
import { VersionAlias } from "../Alias/VersionAlias";
import { VersionAliasResolver } from "../Alias/VersionAliasResolver";
import { UnknownMigrationVersion } from "../Exception/UnknownMigrationVersion";
import { NoMigrationsToExecute } from "../Exception/NoMigrationsToExecute";
import { NoMigrationsFoundWithCriteria } from "../Exception/NoMigrationsFoundWithCriteria";
import { MigrationStatusCalculator } from "../Calculator/MigrationStatusCalculator";
import { MigrationList } from "../List/MigrationList";
import { ExecutedMigration } from "../Executed/ExecutedMigration";

interface MigrateCommandArguments extends InputArguments {
    version: string;
}

export class MigrateCommand extends Command<MigrateCommandArguments> {

    protected migrationStorage: MigrationStorageInterface;

    protected executedMigrationStorage: ExecutedMigrationStorageInterface;

    protected versionAliasResolver: VersionAliasResolver;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        super();
        this.executedMigrationStorage = executedMigrationStorage;
        this.migrationStorage = migrationStorage;
        this.versionAliasResolver = new VersionAliasResolver(this.migrationStorage, this.executedMigrationStorage);
    }

    protected configure(): void {
        this
            .setName("migrations:migrate")
            .setAliases(["migrate"])
            .setDescription("Execute a migration to a specified version or the latest available version.")
            .addArgument("version", ArgumentMode.OPTIONAL, "The version or alias (first, prev, next, latest) to migrate to.", VersionAlias.LATEST)
        ;
    }

    protected async execute(input: InputInterface<MigrateCommandArguments>, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const versionAlias = input.getArgument("version") as string;
        const migrations = this.migrationStorage.getAll();

        if (migrations.length() === 0) {
            io.error(`The version "${versionAlias}" couldn't be reached, there are no registered migrations.`);
            return 1;
        }

        let version: string;

        try {
            version = await this.versionAliasResolver.resolveVersionAlias(versionAlias);
        } catch (error) {
            if (error instanceof UnknownMigrationVersion) {
                console.error(`Unknown version: ${versionAlias}`);

                return 1;
            } else if (error instanceof NoMigrationsToExecute || error instanceof NoMigrationsFoundWithCriteria) {
                return this.exitForAlias(io, versionAlias);
            }

            throw error;
        }

        const planCalculator = new MigrationPlanCalculator(this.migrationStorage, this.executedMigrationStorage);
        const statusCalculator = new MigrationStatusCalculator(this.migrationStorage, this.executedMigrationStorage);
        const executedUnavailableMigrations = await statusCalculator.getExecutedUnavailableMigrations();

        const result = await this.checkExecutedUnavailableMigrations(io, input, executedUnavailableMigrations);

        if (result === false) {
            return 3;
        }

        const plan = await planCalculator.getPlanUntilVersion(version);

        if (plan.length() === 0) {
            return this.exitForAlias(io, versionAlias);
        }

        io.note(`Migrating ${plan.getDirection()} to ${version}`);

        const migrator = new Executor(this.executedMigrationStorage, io);

        await migrator.migrate(plan);

        io.newLine();

        return 0;
    }

    protected formatDate(timestamp: number | null): string {
        if (!timestamp) {
            return "";
        }

        const date = new Date(timestamp);

        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    private exitForAlias(io: StyledOutput, versionAlias: string | VersionAlias): number {
        const version = this.versionAliasResolver.resolveVersionAlias(VersionAlias.CURRENT);

        if (versionAlias === VersionAlias.CURRENT || versionAlias === VersionAlias.LATEST || versionAlias === VersionAlias.FIRST) {
            io.success(`Already at the ${versionAlias} version ("${version}")`);
        } else if (versionAlias === VersionAlias.NEXT || versionAlias === VersionAlias.PREVIOUS) {
            io.error(`The version "${versionAlias}" couldn\'t be reached, you are at version "${version}"`);
        } else {
            io.success(`You are already at version "${version}"'`);
        }

        return 0;
    }

    private async checkExecutedUnavailableMigrations(io: StyledOutput, input: InputInterface, executedUnavailableMigrations: MigrationList<ExecutedMigration>): Promise<boolean> {
        if (executedUnavailableMigrations.length() !== 0) {
            io.warning(`You have ${executedUnavailableMigrations.length()} previously executed migrations that are not registered migrations.`);

            for (const executedUnavailableMigration of executedUnavailableMigrations.getAll()) {
                io.text(`<comment>>></comment> ${this.formatDate(executedUnavailableMigration.getTimestamp())} (${executedUnavailableMigration.getVersion()})`);
            }

            const question = "Are you sure you wish to continue?";
            const canExecute = await this.canExecute(question, input, io);
            if (!canExecute) {
                io.error("Migration cancelled!");

                return false;
            }
        }

        return true;
    }

    private async canExecute(question: string, input: InputInterface, io: StyledOutput): Promise<boolean> {
        return !input.isInteractive() || await io.confirm(question);
    }
}

