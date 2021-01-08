import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationInterface } from "../Migration/MigrationInterface";
import { Direction } from "../Migration/Direction";
import { MigrationList } from "../List/MigrationList";
import { MigrationPlanList } from "../Plan/MigrationPlanList";
export declare class MigrationPlanCalculator {
    private migrationStorage;
    private executedMigrationStorage;
    constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface);
    getPlanForVersions(versions: string[], direction: Direction): Promise<MigrationPlanList>;
    getPlanUntilVersion(to: string): Promise<MigrationPlanList>;
    getMigrations(): MigrationList<MigrationInterface>;
    private findDirection;
    private arrangeMigrationsForDirection;
    private findMigrationsToExecute;
}
//# sourceMappingURL=MigrationPlanCalculator.d.ts.map