import { MigrationListItemInterface } from "../List/MigrationList";
import { ExecutedMigrationData } from "./ExecutedMigrationData";
import { Direction } from "../Migration/Direction";

export class ExecutedMigration implements MigrationListItemInterface {
    private readonly version: string;

    private readonly timestamp: number;

    private readonly duration: number;

    private readonly direction: Direction;

    public constructor(version: string, timestamp: number, duration: number, direction: Direction) {
        this.version = version;
        this.timestamp = timestamp;
        this.duration = duration;
        this.direction = direction;
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

    public getDirection(): Direction {
        return this.direction;
    }

    public toJSON(): ExecutedMigrationData {
        return {
            version: this.version,
            timestamp: this.timestamp,
            duration: this.duration,
            direction: this.direction,
        };
    }

}
