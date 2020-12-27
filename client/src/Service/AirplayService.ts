import { SystemService } from "../System/SystemService";
import { ContextualCommandHandler } from "../ContextualCommandHandler";

export class AirplayService extends SystemService {

    public constructor() {
        super("airplay-playback");
    }

}
