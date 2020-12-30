/// <reference types="node" />
import { SocketConnectOpts } from "net";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";
export declare class Client extends BidirectionalSocket {
    constructor();
    connect(options: SocketConnectOpts): void;
    protected handleConnect(): void;
    protected handleError(error: Error): void;
}
//# sourceMappingURL=Client.d.ts.map