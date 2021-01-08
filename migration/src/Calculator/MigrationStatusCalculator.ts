import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { MigrationList } from "../List/MigrationList";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";

export class MigrationStatusCalculator {

    private migrationStorage: MigrationStorageInterface;

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
    }

    public async getExecutedUnavailableMigrations() {
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const availableMigrations = this.migrationStorage.getAll();

        return new MigrationList([...executedMigrations.getAll()].filter(item => !availableMigrations.has(item.getVersion())));
    }

    public async getNewMigrations() {
        const executedMigrations = await this.executedMigrationStorage.getAll();
        const availableMigrations = this.migrationStorage.getAll();

        return new MigrationList([...availableMigrations.getAll()].filter(item => !executedMigrations.has(item.getVersion())));
    }
}
