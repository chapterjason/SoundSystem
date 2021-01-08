import { MigrationListItemInterface } from "../List/MigrationList";
import { ExecutedMigrationData } from "./ExecutedMigrationData";

export class ExecutedMigration implements MigrationListItemInterface {
    private readonly version: string;

    private readonly timestamp: number;

    private readonly duration: number;

    public constructor(version: string, timestamp: number, duration: number) {
        this.version = version;
        this.timestamp = timestamp;
        this.duration = duration;
    }

    public getVersion(): string {
        return this.version;
    }

    public getTimestamp(): number {
        return this.timestamp;
    }

    public getDuration(): number {
        return this.duration;
    }

    public toJSON(): ExecutedMigrationData {
        return {
            version: this.version,
            timestamp: this.timestamp,
            duration: this.duration,
        };
    }

}
