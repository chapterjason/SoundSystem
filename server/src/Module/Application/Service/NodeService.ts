import { Server, Socket } from "net";
import { Node } from "../../../Node";
import { Logger } from "@nestjs/common";
import { ENVIRONMENT } from "../../../Meta";
import { Reporting } from "../../../Reporting";

const DEFAULT_SERVICE_PORT = 3200;
const SERVICE_PORT = ENVIRONMENT.has("SERVICE_PORT") ? parseInt(ENVIRONMENT.get("SERVICE_PORT"), 10) : DEFAULT_SERVICE_PORT;
ENVIRONMENT.set("SERVICE_PORT", SERVICE_PORT.toString());

export class NodeService extends Server {

    private nodes: Record<string, Node> = {};

    private readonly logger = new Logger("NodeService");

    private reporting: Reporting;

    public constructor(reporting: Reporting) {
        super();

        this.reporting = reporting;

        this.on("connection", this.onConnect.bind(this));
        this.on("listening", this.onListen.bind(this));

        this.maxConnections = 12;

        this.listen(SERVICE_PORT, "0.0.0.0");
    }

    public getNodes() {
        return this.nodes;
    }

    private onListen(): void {
        this.logger.log("Service listen to: " + ENVIRONMENT.get("APP_IP") + ":" + SERVICE_PORT);
    }

    /**
     * Emitted when new client connects
     *
     * @param {Socket} socket
     * @private
     */
    private onConnect(socket: Socket): void {
        socket.setKeepAlive(true);
        socket.setEncoding("utf8");
        socket.setNoDelay(true);

        const node = new Node(this.reporting, socket, (node: Node) => {
            this.nodes[node.getId()] = node;
            this.logger.log(`Connected ${node.getHostname()}`);
        }, (node: Node) => {
            node.getSocket().destroy();
            this.logger.log(`Disconnected ${node.getHostname()}`);

            delete this.nodes[node.getId()];
        });
    }
}
