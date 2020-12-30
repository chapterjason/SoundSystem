import { SystemService } from "./SystemService";
import { Transaction } from "@sentry/types";

export class AirplayService extends SystemService {

    public constructor(transaction: Transaction) {
        super("airplay-playback", transaction);
    }

}
