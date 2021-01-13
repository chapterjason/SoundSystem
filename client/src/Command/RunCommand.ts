import { Command as ConsoleCommand, InputInterface, OutputInterface, StyledOutput } from "@mscs/console";
import { Configuration } from "../Configuration/Configuration";
import { HOSTNAME } from "../constants";
import { Command } from "@soundsystem/network";
import { SoundClient } from "../Sound/SoundClient";
import { EnvironmentInterface } from "@mscs/environment";
import { Inject, Service } from "@soundsystem/system";
import { IdentifierService } from "../Service/IdentifierService";

@Service("command.run", { tags: ["command"] })
export class RunCommand extends ConsoleCommand {

    private client: SoundClient;

    private environment: EnvironmentInterface;

    private identifierService: IdentifierService;

    constructor(@Inject("@client") soundClient: SoundClient, @Inject("@environment") environment: EnvironmentInterface, @Inject("@identifier") identifierService: IdentifierService) {
        super();
        this.client = soundClient;
        this.environment = environment;
        this.identifierService = identifierService;
    }

    protected configure(): void {
        this.setName("run");
    }

    protected async execute(input: InputInterface, output: OutputInterface): Promise<number> {
        const io = new StyledOutput(input, output);

        return new Promise(resolve => {
            this.client.connect({
                family: 4,
                host: this.environment.get("HOST"),
                port: parseInt(this.environment.get("SERVICE_PORT"), 10),
            });

            this.client.on("connect", async () => {
                Configuration.afterSave = async (config) => {
                    const command = Command.create("configuration", {
                        ...config,
                        hostname: HOSTNAME,
                        id: this.identifierService.get(),
                    });

                    await this.client.request(command.toPacket());
                };

                await this.client.init();
            });

            this.client.on("error", (error) => {
                io.error(error.message);
                resolve(1);
            });

            this.client.on("close", () => {
                io.error("Connection closed.");
                resolve(1);
            });
        });
    }
}
