import { MigrationStorageInterface } from "./MigrationStorageInterface";
import { MigrationInterface } from "../Migration/MigrationInterface";
import { MigrationList } from "../List/MigrationList";
export declare class MigrationStorage implements MigrationStorageInterface {
    private migrations;
    add(migration: MigrationInterface): void;
    getAll(): MigrationList<MigrationInterface>;
}
//# sourceMappingURL=MigrationStorage.d.ts.map