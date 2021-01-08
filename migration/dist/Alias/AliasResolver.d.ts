import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { Alias } from "./Alias";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
export declare class AliasResolver {
    private migrationStorage;
    private executedMigrationStorage;
    private migrationStatusCalculator;
    constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface);
    resolveVersionAlias(alias: Alias | string): Promise<string>;
}
//# sourceMappingURL=AliasResolver.d.ts.map