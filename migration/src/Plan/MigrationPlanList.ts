import { Direction } from "../Migration/Direction";
import { MigrationPlan } from "./MigrationPlan";
import { MigrationList } from "../List/MigrationList";

export class MigrationPlanList {

    private migrations: MigrationPlan[];

    private direction: Direction;

    public constructor(migrations: MigrationPlan[], direction: Direction) {
        this.migrations = migrations;
        this.direction = direction;
    }

    public length() {
        return this.migrations.length;
    }

    public getDirection() {
        return this.direction;
    }

    public getAll() {
        return new MigrationList(this.migrations);
    }

}
