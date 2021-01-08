import { RuntimeException } from "./RuntimeException";

export class MigrationNotFound extends RuntimeException {
    public static new(version: string) {
        return new this(`Migration "${version}" was not found?`);
    }
}
