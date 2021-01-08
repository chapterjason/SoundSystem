import { MigrationListItemInterface } from "../List/MigrationList";
import { ExecutedMigrationData } from "./ExecutedMigrationData";
export declare class ExecutedMigration implements MigrationListItemInterface {
    private readonly version;
    private readonly timestamp;
    private readonly duration;
    constructor(version: string, timestamp: number, duration: number);
    getVersion(): string;
    getTimestamp(): number;
    getDuration(): number;
    toJSON(): ExecutedMigrationData;
}
//# sourceMappingURL=ExecutedMigration.d.ts.map