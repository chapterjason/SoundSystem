import { Command as ConsoleCommand, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { update } from "../Utils/Update";
import { AdvancedPackageTool, Service } from "@soundsystem/system";

@Service("command.update", { tags: ["command"] })
export class UpdateCommand extends ConsoleCommand {

    protected configure(): void {
        this.setName("update");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        // Update system
        const system = new AdvancedPackageTool();
        await system.update();
        await system.upgrade();

        // Update client file

        // Restart service

        return 0;
    }
}
