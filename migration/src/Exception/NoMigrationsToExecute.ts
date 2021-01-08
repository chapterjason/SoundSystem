import { RuntimeException } from "./RuntimeException";

export class NoMigrationsToExecute extends RuntimeException {
    public static new(error: Error) {
        return new this(`Could not find any migrations to execute.`, error);
    }
}
