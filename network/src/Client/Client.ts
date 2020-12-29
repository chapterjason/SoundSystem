import { Socket, SocketConnectOpts } from "net";
import { BidirectionalSocket } from "../Common/BidirectionalSocket";

export class Client extends BidirectionalSocket {

    public constructor() {
        super(new Socket({ allowHalfOpen: false }));
    }

    public connect(options: SocketConnectOpts) {
        this.socket.connect(options, this.handleConnect.bind(this));
    }

    protected handleConnect(): void {
        this.socket.on("error", this.handleError.bind(this));
    }

    protected handleError(error: Error): void {
        this.emit("error", error);
    }

}
