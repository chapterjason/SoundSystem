import { RuntimeException } from "./RuntimeException";

export class MissingParameter extends RuntimeException {
    public parameter: string;

    public constructor(parameter: string) {
        super(`Parameter "${parameter}" not found.`);
        this.parameter = parameter;
    }
}
