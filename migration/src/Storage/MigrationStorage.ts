import { MigrationStorageInterface } from "./MigrationStorageInterface";
import { MigrationInterface } from "../Migration/MigrationInterface";
import { MigrationList } from "../List/MigrationList";

export class MigrationStorage implements MigrationStorageInterface {

    private migrations: MigrationInterface[] = [];

    public add(migration: MigrationInterface): void {
        this.migrations.push(migration);
    }

    public getAll(): MigrationList<MigrationInterface> {
        return new MigrationList(this.migrations);
    }

}
