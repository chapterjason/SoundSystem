import { Command, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationStatusInfosHelper } from "../Utils/MigrationStatusInfosHelper";

export class StatusCommand extends Command {

    protected migrationStorage: MigrationStorageInterface;

    protected executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        super();
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
    }

    protected configure(): void {
        this
            .setName("migrations:status")
            .setAliases(["status"])
            .setDescription("View the status of a set of migrations.");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const helper = new MigrationStatusInfosHelper(this.migrationStorage, this.executedMigrationStorage);

        await helper.displayStatus(io);

        return 0;
    }

}

