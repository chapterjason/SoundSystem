import { RuntimeException } from "./RuntimeException";

export class MissingService extends RuntimeException {

    public serviceName: string;

    public constructor(serviceName: string) {
        super(`Service "${serviceName}" not found.`);
        this.serviceName = serviceName;
    }
}
