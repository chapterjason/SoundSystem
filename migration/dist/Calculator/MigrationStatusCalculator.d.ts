import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { MigrationList } from "../List/MigrationList";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
export declare class MigrationStatusCalculator {
    private migrationStorage;
    private executedMigrationStorage;
    constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface);
    getExecutedUnavailableMigrations(): Promise<MigrationList<import("..").ExecutedMigration>>;
    getNewMigrations(): Promise<MigrationList<import("..").MigrationInterface>>;
}
//# sourceMappingURL=MigrationStatusCalculator.d.ts.map