import { NoMigrationsFoundWithCriteria } from "../Exception/NoMigrationsFoundWithCriteria";
import { MigrationNotFound } from "../Exception/MigrationNotFound";

export interface MigrationListItemInterface {
    getVersion(): string;
}

export class MigrationList<T extends MigrationListItemInterface> {

    protected migrations: T[];

    public constructor(migrations: T[]) {
        this.migrations = migrations;
    }

    public getAll() {
        return [...this.migrations];
    }

    public getFirst(offset: number = 0): T {
        if (typeof this.migrations[offset] === "undefined") {
            throw new Error(`First migration with offset "${offset}" not found.`);
        }

        return this.migrations[offset];
    }

    public getLast(offset: number = 0): T {
        offset = this.migrations.length - 1 - (-1 * offset);

        if (typeof this.migrations[offset] === "undefined") {
            throw new NoMigrationsFoundWithCriteria(`Latest migration with offset "${offset}" not found.`);
        }

        return this.migrations[offset];

    }

    public get(version: string): T {
        for (const migration of this.migrations) {
            if (migration.getVersion() === version) {
                return migration;
            }
        }

        throw MigrationNotFound.new(version);
    }

    public has(version: string) {
        for (const migration of this.migrations) {
            if (migration.getVersion() === version) {
                return true;
            }
        }

        return false;
    }

    public length() {
        return this.migrations.length;
    }

}
