import { MigrationStorageInterface } from "../Storage/MigrationStorageInterface";
import { ExecutedMigrationStorageInterface } from "../Executed/ExecutedMigrationStorageInterface";
import { MigrationInterface } from "../Migration/MigrationInterface";
import { Direction } from "../Migration/Direction";
import { MigrationList } from "../List/MigrationList";
import { MigrationNotFound } from "../Exception/MigrationNotFound";
import { MigrationPlanList } from "../Plan/MigrationPlanList";
import { MigrationPlan } from "../Plan/MigrationPlan";
import { ExecutedMigration } from "../Executed/ExecutedMigration";
import { alphanumericComparator } from "../Comparator/AlphanumericComparator";

export class MigrationPlanCalculator {

    private migrationStorage: MigrationStorageInterface;

    private executedMigrationStorage: ExecutedMigrationStorageInterface;

    public constructor(migrationStorage: MigrationStorageInterface, executedMigrationStorage: ExecutedMigrationStorageInterface) {
        this.migrationStorage = migrationStorage;
        this.executedMigrationStorage = executedMigrationStorage;
    }

    public async getPlanForVersions(versions: string[], direction: Direction): Promise<MigrationPlanList> {
        const migrationsToCheck = this.arrangeMigrationsForDirection(direction, this.getMigrations());
        const availableMigrations = migrationsToCheck.getAll()
                                                     .filter(item => versions.includes(item.getVersion()));

        const plannedMigrations = availableMigrations.map((migration) => new MigrationPlan(migration, direction));

        if (versions.length !== plannedMigrations.length) {
            const plannedVersions = plannedMigrations.map(plan => plan.getVersion())
                                                     .filter(version => !versions.includes(version));

            throw MigrationNotFound.new(plannedVersions.join());
        }

        return new MigrationPlanList(plannedMigrations, direction);
    }

    public async getPlanUntilVersion(to: string): Promise<MigrationPlanList> {
        const list = this.migrationStorage.getAll();

        if (to !== "0" && !list.has(to)) {
            throw MigrationNotFound.new(to);
        }

        const availableMigrations = this.getMigrations();
        const executedMigrations = await this.executedMigrationStorage.getAll();

        const direction = this.findDirection(to, executedMigrations);
        const migrationToCheck = this.arrangeMigrationsForDirection(direction, availableMigrations);
        const toExecute = this.findMigrationsToExecute(to, migrationToCheck, direction, executedMigrations);

        return new MigrationPlanList(toExecute.map(item => new MigrationPlan(item, direction)), direction);

    }

    public getMigrations(): MigrationList<MigrationInterface> {
        const availableMigrations = [...this.migrationStorage.getAll().getAll()].sort((a, b) => alphanumericComparator(a.getVersion(), b.getVersion()));

        return new MigrationList(availableMigrations);
    }

    private findDirection(to: string, executedMigrations: MigrationList<ExecutedMigration>) {
        if (to === "0" || (executedMigrations.has(to) && executedMigrations.getLast().getVersion() !== to)) {
            return Direction.DOWN;
        }

        return Direction.UP;
    }

    private arrangeMigrationsForDirection(direction: Direction, availableMigrations: MigrationList<MigrationInterface>) {
        const entries = [...availableMigrations.getAll()];

        return new MigrationList(direction === Direction.UP ? entries : entries.reverse());
    }

    private findMigrationsToExecute(to: string, migrationsToCheck: MigrationList<MigrationInterface>, direction: Direction, executedMigrations: MigrationList<ExecutedMigration>): MigrationInterface[] {
        const toExecute: MigrationInterface[] = [];

        for (const migration of migrationsToCheck.getAll()) {
            const version = migration.getVersion();

            if (direction === Direction.DOWN && version === to) {
                break;
            }

            if (direction === Direction.UP && !executedMigrations.has(version)) {
                toExecute.push(migration);
            } else if (direction === Direction.DOWN && executedMigrations.has(version)) {
                toExecute.push(migration);
            }

            if (direction === Direction.UP && version === to) {
                break;
            }
        }

        return toExecute;
    }
}
