import { Direction } from "../Migration/Direction";
import { MigrationPlan } from "./MigrationPlan";
import { MigrationList } from "../List/MigrationList";
export declare class MigrationPlanList {
    private migrations;
    private direction;
    constructor(migrations: MigrationPlan[], direction: Direction);
    length(): number;
    getDirection(): Direction;
    getAll(): MigrationList<MigrationPlan>;
}
//# sourceMappingURL=MigrationPlanList.d.ts.map