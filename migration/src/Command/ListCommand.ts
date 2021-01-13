import { Command, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { alphanumericComparator } from "../Comparator/AlphanumericComparator";
import { TablePrinter } from "../Utils/TablePrinter";
import { MigrationStatusInfosHelper } from "../Utils/MigrationStatusInfosHelper";

export class ListCommand extends Command {

    protected migrationStorage: MigrationStorageInterface;

    protected executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        super();
        this.executedMigrationStorage = executedMigrationStorage;
        this.migrationStorage = migrationStorage;
    }

    protected configure(): void {
        this
            .setName("migrations:list")
            .setAliases(["list-migrations"])
            .setDescription("Display a list of all available migrations and their status.")
        ;
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const executedVersions = await this.executedMigrationStorage.getAll();
        const availableVersions = await this.migrationStorage.getAll();
        const versions: string[] = [...executedVersions.getAll().map(item => item.getVersion()), ...availableVersions.getAll().map(item => item.getVersion())].sort(alphanumericComparator);

        const helper = new MigrationStatusInfosHelper(this.migrationStorage, this.executedMigrationStorage);

        await helper.listVersions(io, versions);

        return 0;
    }


}

