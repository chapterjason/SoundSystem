import { AbstractMigration } from "../../src";

export class MigrationMock extends AbstractMigration {

    public upExecuted: number = 0;

    public preDownExecuted: number = 0;

    public downExecuted: number = 0;

    public postDownExecuted: number = 0;

    public preUpExecuted: number = 0;

    public postUpExecuted: number = 0;

    private readonly version: string;

    private readonly description: string;

    public constructor(version: string, description: string = "") {
        super();
        this.version = version;
        this.description = description;
    }

    public getDescription(): string {
        return this.description;
    }

    public getVersion(): string {
        return this.version;
    }

    public async up(): Promise<void> {
        this.upExecuted++;
    }

    public async preDown(): Promise<void> {
        this.preDownExecuted++;
    }

    public async down(): Promise<void> {
        this.downExecuted++;
    }

    public async postDown(): Promise<void> {
        this.postDownExecuted++;
    }

    public async preUp(): Promise<void> {
        this.preUpExecuted++;
    }

    public async postUp(): Promise<void> {
        this.postUpExecuted++;
    }
}
