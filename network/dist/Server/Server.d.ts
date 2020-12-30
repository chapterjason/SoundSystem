/// <reference types="node" />
import { ListenOptions, Server as BaseServer, Socket as BaseSocket } from "net";
import { EventEmitter } from "events";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";
export declare class Server<UserDataType extends object = {}> extends EventEmitter {
    protected server: BaseServer;
    protected sockets: Set<BidirectionalSocket<UserDataType>>;
    constructor();
    listen(options: ListenOptions): this;
    stop(): Promise<void>;
    protected handleConnect(socket: BaseSocket): void;
    protected handleListen(): void;
}
//# sourceMappingURL=Server.d.ts.map