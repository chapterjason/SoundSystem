import { NetworkCommand, ReportingPoint, ReportingPointType } from "common";
import { v4 as uuidv4 } from "uuid";
import { CLIENT, ID } from "./meta";
import { ContextualCommandHandler } from "./ContextualCommandHandler";
import { serializeError } from "serialize-error";

export class NetworkCommandHandler {

    private networkCommand: NetworkCommand;

    public constructor(networkCommand: NetworkCommand) {
        this.networkCommand = networkCommand;
    }

    public async execute() {
        const handler = new ContextualCommandHandler();

        // error, beforeExecute, afterExecute
        handler.on("error", (error) => {
            this.report(ReportingPointType.ERROR, serializeError(error));
        });

        handler.on("beforeExecute", () => {
            this.report(ReportingPointType.REQUEST_RECEIVED, this.networkCommand.toString());
        });

        handler.on("afterExecute", () => {
            this.report(ReportingPointType.RESPONSE_SENT, this.networkCommand.toString());
            CLIENT.response(this.networkCommand.getId(), this.networkCommand.toString());
        });

        // beforeStart, afterStart
        // beforeStop, afterStop
        handler.bindEvents({
            beforeStart: (service: string) => {
                this.report(ReportingPointType.SERVICE_START, service);
            },
            afterStart: (service: string) => {
                this.report(ReportingPointType.SERVICE_STARTED, service);
            },
            beforeStop: (service: string) => {
                this.report(ReportingPointType.SERVICE_STOP, service);
            },
            afterStop: (service: string) => {
                this.report(ReportingPointType.SERVICE_STOPPED, service);
            },
        });

        const command = this.networkCommand.getCommand();
        const data = this.networkCommand.getData();

        await handler.execute(command, data)
    }

    public report(type: ReportingPointType, data: string, timestamp: number = Date.now()) {
        const networkCommand = NetworkCommand.create("report", JSON.stringify({
            id: uuidv4(),
            correlationId: this.networkCommand.getId(),
            timestamp,
            data,
            type,
            nodeId: ID,
        } as ReportingPoint));

        CLIENT.send(networkCommand);
    }

}
