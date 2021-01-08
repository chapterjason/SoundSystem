import { RuntimeException } from "./RuntimeException";

export class UnknownMigrationVersion extends RuntimeException {
    public static new(version: string) {
        return new this(`Could not find migration version ${version}`);
    }
}
