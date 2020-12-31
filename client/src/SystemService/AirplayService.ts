import { SystemService } from "./SystemService";
import { Span, Transaction } from "@sentry/types";

export class AirplayService extends SystemService {

    public constructor(tracing: Span) {
        super("airplay-playback", tracing);
    }

}
