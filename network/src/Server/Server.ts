import { ListenOptions, Server as BaseServer, Socket as BaseSocket } from "net";
import { EventEmitter } from "events";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";

export class Server<UserDataType extends object = {}> extends EventEmitter {

    protected server: BaseServer;

    protected sockets: Set<BidirectionalSocket<UserDataType>> = new Set<BidirectionalSocket<UserDataType>>();

    public constructor() {
        super();

        this.server = new BaseServer({ pauseOnConnect: false, allowHalfOpen: false }, this.handleConnect.bind(this));
        this.server.on("error", error => this.emit("error", error));
    }

    public listen(options: ListenOptions) {
        this.server.listen(options, this.handleListen.bind(this));

        return this;
    }

    public async stop() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }

        this.sockets.clear();

        return new Promise<void>((resolve, reject) => {
            this.server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    protected handleConnect(socket: BaseSocket) {
        const communicationSocket = new BidirectionalSocket<UserDataType>(socket);

        this.sockets.add(communicationSocket);

        communicationSocket.on("close", () => {
            this.sockets.delete(communicationSocket);
        });

        communicationSocket.on("request", (socket, packet) => this.emit("request", socket, packet));
        communicationSocket.on("error", error => this.emit("clientError", communicationSocket, error));

        this.emit("connect", communicationSocket);
    }

    protected handleListen() {

    }

}
