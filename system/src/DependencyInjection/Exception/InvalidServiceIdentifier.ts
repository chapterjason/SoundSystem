import { RuntimeException } from "./RuntimeException";

export class InvalidServiceIdentifier extends RuntimeException {

    public serviceIdentifier: string;

    public constructor(serviceIdentifier: string) {
        super(`ServiceIdentifier "${serviceIdentifier}" is invalid.`);
        this.serviceIdentifier = serviceIdentifier;
    }
}
