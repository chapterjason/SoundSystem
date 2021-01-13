import { Command, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { VersionAliasResolver } from "../Alias/VersionAliasResolver";
import { VersionAlias } from "../Alias/VersionAlias";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { MigrationNotFound } from "../Exception/MigrationNotFound";
import { NoMigrationsToExecute } from "../Exception/NoMigrationsToExecute";

export class LatestCommand extends Command {

    protected migrationStorage: MigrationStorageInterface;

    protected versionAliasResolver: VersionAliasResolver;

    public constructor(migrationStorage: MigrationStorageInterface, versionAliasResolver: VersionAliasResolver) {
        super();
        this.migrationStorage = migrationStorage;
        this.versionAliasResolver = versionAliasResolver;
    }

    protected configure(): void {
        this
            .setName("migrations:latest")
            .setAliases(["latest"])
            .setDescription("Outputs the latest version");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        let version;
        let description;

        try {
            version = await this.versionAliasResolver.resolveVersionAlias(VersionAlias.LATEST);
            const migrations = this.migrationStorage.getAll();
            const availableMigration = migrations.get(version);
            description = availableMigration.getDescription();
        } catch (error) {
            if (error instanceof NoMigrationsToExecute) {
                version = "0";
                description = "";
            } else {
                throw error;
            }
        }

        io.text(`<info>${version}</info>${description !== "" ? ` - ${description}` : ""}`);

        return 0;
    }
}

