import { LogicException } from "./LogicException";

export class LockedException extends LogicException {
    public constructor(instance: string, method?: string) {
        super(`${instance}${method ? `.${method}` : ""} is locked.`);
    }
}
