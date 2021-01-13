import { MigrationInterface } from "../Migration/MigrationInterface";
import { MigrationList } from "../List/MigrationList";

export interface MigrationStorageInterface {

    add(migration: MigrationInterface): void;

    addMigrations(migrations: MigrationInterface[]): void;

    getAll(): MigrationList<MigrationInterface>;

}
