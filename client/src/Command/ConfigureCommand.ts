import { Command as ConsoleCommand, InputInterface, InputOptions, OptionMode, OutputInterface, StyledOutput } from "@mscs/console";
import { promises as fs } from "fs";
import { Process } from "@mscs/process";
import { Inject, Service } from "@soundsystem/system";

interface ConfigureCommandOptions extends InputOptions {
    hostname: string;

    host: string;

    port: string;

    servicePort: string;
}

@Service("command.configure", { tags: ["command"] })
export class ConfigureCommand extends ConsoleCommand<{}, ConfigureCommandOptions> {

    protected environmentFile: string;

    constructor(@Inject("%environment.file%") environmentFile: string) {
        super();
        this.environmentFile = environmentFile;
    }

    protected configure(): void {
        this.setName("configure")
            .addOption("hostname", null, OptionMode.VALUE_REQUIRED, "Hostname of this node")
            .addOption("host", null, OptionMode.VALUE_REQUIRED, "Host of the main server")
            .addOption("port", null, OptionMode.VALUE_REQUIRED, "Port of the main server")
            .addOption("servicePort", null, OptionMode.VALUE_REQUIRED, "Service port for main server communications")
        ;
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const host = input.getOption("host") as string;
        const port = input.getOption("port") as string;
        const servicePort = input.getOption("servicePort") as string;

        await fs.writeFile(this.environmentFile, `HOST=${host}
PORT=${port}
SERVICE_PORT=${servicePort}`);


        // Set Hostname
        const hostname = input.getOption("hostname") as string;

        const setHostnameProcess = new Process(["sudo", "raspi-config", "nonint", "do_hostname", hostname]);
        await setHostnameProcess.mustRun();

        return 0;
    }
}
