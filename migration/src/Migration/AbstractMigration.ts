import { MigrationInterface } from "./MigrationInterface";
import { AbortMigration } from "../Exception/AbortMigration";
import { SkipMigration } from "../Exception/SkipMigration";

export abstract class AbstractMigration implements MigrationInterface {

    public warnIf(condition: boolean, message: string = "Unknown Reason"): void {
        if (!condition) {
            return;
        }

        console.warn(message);
    }

    public abortIf(condition: boolean, message: string = "Unknown Reason"): void {
        if (condition) {
            throw new AbortMigration(message);
        }
    }

    public skipIf(condition: boolean, message: string = "Unknown Reason"): void {
        if (condition) {
            throw new SkipMigration(message);
        }
    }

    public getDescription(): string {
        return "";
    }

    public async preDown(): Promise<void> {
    }

    public async down(): Promise<void> {
        this.abortIf(true, `No down() migration implemented for "${this.constructor.name}"`);
    }

    public async postDown(): Promise<void> {
    }

    public async preUp(): Promise<void> {
    }

    public abstract getVersion(): string;

    public abstract up(): Promise<void>;

    public async postUp(): Promise<void> {
    }

}
