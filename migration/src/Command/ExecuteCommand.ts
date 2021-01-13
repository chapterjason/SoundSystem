import { ArgumentMode, Command, InputArguments, InputInterface, InputOptions, OptionMode, OutputInterface, StyledOutput } from "@mscs/console";
import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationPlanCalculator } from "../Calculator/MigrationPlanCalculator";
import { Direction } from "../Migration/Direction";
import { Executor } from "../Executor/Executor";

interface ExecuteCommandArguments extends InputArguments {
    versions: string[];
}

interface ExecuteCommandOptions extends InputOptions {
    up: boolean;

    down: boolean;
}

export class ExecuteCommand extends Command<ExecuteCommandArguments, ExecuteCommandOptions> {

    protected migrationStorage: MigrationStorageInterface;

    protected executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        super();
        this.executedMigrationStorage = executedMigrationStorage;
        this.migrationStorage = migrationStorage;
    }

    protected configure(): void {
        this
            .setName("migrations:execute")
            .setAliases(["execute"])
            .setDescription("Execute one or more migration versions up or down manually.")
            .addArgument("versions", ArgumentMode.REQUIRED | ArgumentMode.IS_ARRAY, "The versions to execute.")
            .addOption("up", null, OptionMode.VALUE_NONE, "Execute the migration up.")
            .addOption("down", null, OptionMode.VALUE_NONE, "Execute the migration down.")
        ;
    }

    protected async execute(input: InputInterface<ExecuteCommandArguments, ExecuteCommandOptions>, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const versions = input.getArgument("versions") as string[];
        const direction = input.getOption("down") !== false ? Direction.DOWN : Direction.UP;

        const planCalculator = new MigrationPlanCalculator(this.migrationStorage, this.executedMigrationStorage);
        const plan = await planCalculator.getPlanForVersions(versions, direction);

        io.note(`Executing ${versions.join(", ")} ${direction}`);

        const migrator = new Executor(this.executedMigrationStorage);

        const results = await migrator.migrate(plan);

        if (results.length === 0) {
            io.note("No migrations to execute.");
        } else {
            const duration = results.reduce((previous, next) => previous + next.getDuration(), 0);

            io.text(`finished in ${duration}ms, ${results.length} migrations executed.`);
        }

        io.newLine();

        return 0;
    }
}

