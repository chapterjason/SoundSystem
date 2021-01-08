
export interface MigrationInterface {

    getVersion(): string;

    getDescription(): string;

    warnIf(condition: boolean, message?: string): void;

    abortIf(condition: boolean, message?: string): void;

    skipIf(condition: boolean, message?: string): void;

    preUp(): Promise<void>;

    up(): Promise<void>;

    postUp(): Promise<void>;

    preDown(): Promise<void>;

    down(): Promise<void>;

    postDown(): Promise<void>;
}
