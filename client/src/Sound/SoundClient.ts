import { Client, CommandControllerInterface, CommandQueue } from "@soundsystem/network";
import { Configuration } from "../Configuration/Configuration";
import { Mode } from "@soundsystem/common";
import { SoundService } from "./SoundService";
import { Inject, Service } from "@soundsystem/system";

@Service("client")
export class SoundClient extends Client {

    private queue: CommandQueue = new CommandQueue(this);

    private service: SoundService;

    private readonly controllers: CommandControllerInterface[];

    private configuration: Configuration;

    public constructor(
        @Inject("@sound") service: SoundService,
        @Inject("@configuration") configuration: Configuration,
        @Inject("!controller") controllers: CommandControllerInterface[],
    ) {
        super();
        this.service = service;
        this.configuration = configuration;
        this.controllers = controllers;
    }

    public async init(): Promise<void> {
        for (const controller of this.controllers) {
            this.queue.register(controller);
        }

        const config = await this.configuration.get();

        const { mode, server, stream, volume, muted } = config;

        if (mode === Mode.IDLE) {
            await this.service.idle();
        } else if (mode === Mode.SINGLE) {
            await this.service.single(stream);
        } else if (mode === Mode.STREAM) {
            await this.service.stream(stream);
        } else if (mode === Mode.LISTEN) {
            await this.service.listen(server);
        } else if (mode === Mode.NONE) {
            await this.service.idle();
        }

        await this.service.setMuted(muted);
        await this.service.setVolume(volume);
    }

}
