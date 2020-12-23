import { MakeLogicType } from "kea";
import { PacketReport, Report } from "common";

interface Values {
    packets: PacketReport[];

    reports: Report[];

    autoRefresh: boolean;

    updated: boolean;

    requestTime: number;

    timeout: number;
}

interface Actions {
    setPackets: (packets: PacketReport[]) => { packets: PacketReport[] }

    setAutoRefresh: (autoRefresh: boolean) => { autoRefresh: boolean };

    setRequestTime: (requestTime: number) => { requestTime: number };

    setTimeout: (timeout: number) => { timeout: number };

    update: () => true;

    updateDone: () => true;
}

interface Props {

}

export type ReportLogicType = MakeLogicType<Values, Actions, Props>
