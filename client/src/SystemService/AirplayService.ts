import { Service, SystemService } from "@soundsystem/system";

@Service("system.airplay", { tags: ["system"] })
export class AirplayService extends SystemService {

    public constructor() {
        super("airplay-playback");
    }

}
