import { State } from "../Migration/State";
import { ExecutedMigration } from "../Executed/ExecutedMigration";
import { SkipMigration } from "../Exception/SkipMigration";
import { Direction } from "../Migration/Direction";

export class ExecutionResult {
    private readonly version: string;

    private duration!: number;

    private skipped: SkipMigration | null = null;

    private error: Error | null = null;

    private state: State = State.NONE;

    private direction: Direction;

    private timestamp: number;

    public constructor(version: string, timestamp: number, direction: Direction) {
        this.version = version;
        this.timestamp = timestamp;
        this.direction = direction;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public getSkipped(): SkipMigration | null {
        return this.skipped;
    }

    public getError(): Error | null {
        return this.error;
    }

    public setDuration(duration: number): void {
        this.duration = duration;
    }

    public setSkipped(skipped: SkipMigration): void {
        this.skipped = skipped;
    }

    public setError(error: Error): void {
        this.error = error;
    }

    public isSkipped(): boolean {
        return this.skipped !== null;
    }

    public hasError(): boolean {
        return this.error !== null;
    }

    public setState(state: State): void {
        this.state = state;
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

    public toExecutedMigration() {
        return new ExecutedMigration(this.version, this.timestamp, this.duration, this.direction);
    }

    public getState(): State {
        return this.state;
    }
}
