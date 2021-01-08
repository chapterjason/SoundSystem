import { MigrationInterface } from "./MigrationInterface";
export declare abstract class AbstractMigration implements MigrationInterface {
    warnIf(condition: boolean, message?: string): void;
    abortIf(condition: boolean, message?: string): void;
    skipIf(condition: boolean, message?: string): void;
    getDescription(): string;
    preDown(): Promise<void>;
    down(): Promise<void>;
    postDown(): Promise<void>;
    preUp(): Promise<void>;
    abstract getVersion(): string;
    abstract up(): Promise<void>;
    postUp(): Promise<void>;
}
//# sourceMappingURL=AbstractMigration.d.ts.map