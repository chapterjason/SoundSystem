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
        handler.on("error", (error, time) => {
            this.report(ReportingPointType.ERROR, serializeError(error), time);
        });

        handler.on("beforeExecute", (time) => {
            this.report(ReportingPointType.REQUEST_RECEIVED, this.networkCommand.toString(), time);
        });

        handler.on("afterExecute", (time) => {
            this.report(ReportingPointType.RESPONSE_SENT, this.networkCommand.toString(), time);
            CLIENT.response(this.networkCommand.getId(), this.networkCommand.toString());
        });

        // beforeStart, afterStart
        // beforeStop, afterStop
        handler.bindEvents({
            beforeStart: (service: string, time: number) => {
                this.report(ReportingPointType.SERVICE_START, service, time);
            },
            afterStart: (service: string, time: number) => {
                this.report(ReportingPointType.SERVICE_STARTED, service, time);
            },
            beforeStop: (service: string, time: number) => {
                this.report(ReportingPointType.SERVICE_STOP, service, time);
            },
            afterStop: (service: string, time: number) => {
                this.report(ReportingPointType.SERVICE_STOPPED, service, time);
            },
        });

        const command = this.networkCommand.getCommand();
        const data = this.networkCommand.getData();

        await handler.execute(command, data);
    }

    public report(type: ReportingPointType, data: string, timestamp: number = Date.now()) {
        console.log("report", new Date(timestamp).toISOString(), ReportingPointType[type], this.networkCommand.getId());

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
