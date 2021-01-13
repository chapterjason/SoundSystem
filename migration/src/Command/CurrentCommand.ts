import { Command, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { VersionAliasResolver } from "../Alias/VersionAliasResolver";
import { VersionAlias } from "../Alias/VersionAlias";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { MigrationNotFound } from "../Exception/MigrationNotFound";

export class CurrentCommand extends Command {

    protected migrationStorage: MigrationStorageInterface;

    protected versionAliasResolver: VersionAliasResolver;

    public constructor(migrationStorage: MigrationStorageInterface, versionAliasResolver: VersionAliasResolver) {
        super();
        this.migrationStorage = migrationStorage;
        this.versionAliasResolver = versionAliasResolver;
    }

    protected configure(): void {
        this
            .setName("migrations:current")
            .setAliases(["current"])
            .setDescription("Outputs the current version");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const version = await this.versionAliasResolver.resolveVersionAlias(VersionAlias.CURRENT);
        let description;

        if (version === "0") {
            description = "(No migration executed yet)";
        } else {
            try {
                const migrations = this.migrationStorage.getAll();
                const availableMigration = migrations.get(version);
                description = availableMigration.getDescription();
            } catch (error) {
                if (error instanceof MigrationNotFound) {
                    description = "(Migration info not available)";
                } else {
                    throw error;
                }
            }
        }

        io.text(`<info>${version}</info>${description !== "" ? ` - ${description}` : ""}`);

        return 0;
    }
}

