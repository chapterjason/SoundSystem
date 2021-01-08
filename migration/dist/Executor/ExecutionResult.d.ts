import { State } from "../Migration/State";
import { ExecutedMigration } from "../Executed/ExecutedMigration";
import { SkipMigration } from "../Exception/SkipMigration";
export declare class ExecutionResult {
    private readonly version;
    private duration;
    private skipped;
    private error;
    private state;
    private timestamp;
    constructor(version: string, timestamp: number);
    getSkipped(): SkipMigration | null;
    getError(): Error | null;
    setDuration(duration: number): void;
    setSkipped(skipped: SkipMigration): void;
    setError(error: Error): void;
    isSkipped(): boolean;
    hasError(): boolean;
    setState(state: State): void;
    getVersion(): string;
    getTimestamp(): number;
    getDuration(): number;
    toExecutedMigration(): ExecutedMigration;
    getState(): State;
}
//# sourceMappingURL=ExecutionResult.d.ts.map