import { ArgumentMode, Command as ConsoleCommand, InputArguments, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { promises as fs } from "fs";
import { Process } from "@mscs/process";
import { Inject, Service } from "@soundsystem/system";

interface ConfigureCommandArguments extends InputArguments {
    hostname: string;

    host: string;

    port: string;

    servicePort: string;
}

@Service("command.configure", { tags: ["command"] })
export class ConfigureCommand extends ConsoleCommand<ConfigureCommandArguments> {

    protected environmentFile: string;

    constructor(@Inject("%environment.file%") environmentFile: string) {
        super();
        this.environmentFile = environmentFile;
    }

    protected configure(): void {
        this.setName("configure")
            .addArgument("hostname", ArgumentMode.REQUIRED, "Hostname of this node")
            .addArgument("host", ArgumentMode.REQUIRED, "Host of the main server")
            .addArgument("port", ArgumentMode.REQUIRED, "Port of the main server")
            .addArgument("servicePort", ArgumentMode.REQUIRED, "Service port for main server communications")
        ;
    }

    protected async execute(input: InputInterface<ConfigureCommandArguments>, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        const host = input.getArgument("host");
        const port = input.getArgument("port");
        const servicePort = input.getArgument("servicePort");

        await fs.writeFile(this.environmentFile, `HOST=${host}
PORT=${port}
SERVICE_PORT=${servicePort}`);

        // Set Hostname
        const hostname = input.getArgument("hostname");

        const setHostnameProcess = new Process(["sudo", "raspi-config", "nonint", "do_hostname", hostname]);
        await setHostnameProcess.mustRun();

        return 0;
    }
}
