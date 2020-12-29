import { Command, ReportingPoint } from "@soundsystem/common";
import { ID } from "./meta";
import { v4 as uuidv4 } from "uuid";
import { CLIENT } from "./Singleton/Client";

export class Reporting {

    public async report(id: string, type: string, time: number) {
        const command = Command.create("report", {
            nodeId: ID,
            id: uuidv4(),
            timestamp: Date.now(),
            type,
            time,
            correlationId: id,
        } as ReportingPoint);

        const packet = command.toPacket();

        await CLIENT.request(packet);
    }

}
