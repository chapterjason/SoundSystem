import { Direction, ExecutedMigrationMemoryStorage, State, Executor, MigrationPlan, MigrationPlanList } from "../src";
import { MigrationMock } from "./Mock/MigrationMock";

describe("Executor", () => {

    const executedMigrationStorage = new ExecutedMigrationMemoryStorage();
    const executor = new Executor(executedMigrationStorage);

    afterEach(() => {
        executedMigrationStorage.clear();
    });

    describe("migrate", () => {
        it("should return empty array if the plan is empty", async () => {
            // Arrange
            const migrationPlanList = new MigrationPlanList([], Direction.UP);

            // Act
            const actual = await executor.migrate(migrationPlanList);

            // Assert
            expect(actual).toHaveLength(0);
        });

        it("should execute all given migration plans", async () => {
            // Arrange
            const migration = new MigrationMock("A");
            const migrationPlan = new MigrationPlan(migration, Direction.UP);
            const migrationPlanList = new MigrationPlanList([migrationPlan], Direction.UP);

            // Act
            const actual = await executor.migrate(migrationPlanList);

            // Assert
            expect(actual).toHaveLength(1);
            expect(actual[0].getVersion()).toBe("A");
            expect(actual[0].getState()).toBe(State.NONE);
            expect(actual[0].getSkipped()).toBeNull();
            expect(actual[0].getError()).toBeNull();
            expect(actual[0].hasError()).toBeFalsy();
            expect(actual[0].isSkipped()).toBeFalsy();

            expect(migration.preDownExecuted).toBe(0);
            expect(migration.downExecuted).toBe(0);
            expect(migration.postDownExecuted).toBe(0);

            expect(migration.preUpExecuted).toBe(1);
            expect(migration.upExecuted).toBe(1);
            expect(migration.postUpExecuted).toBe(1);
        });
    });

    describe("execute", () => {

        it("should skip migration",  async () => {
            // Arrange
            class SkippedMigration extends MigrationMock {

                public async up(): Promise<void> {
                    this.skipIf(true, "foo");
                    return super.up();
                }
            }

            const migration = new SkippedMigration("A");
            const migrationPlan = new MigrationPlan(migration, Direction.UP);
            const migrationPlanList = new MigrationPlanList([migrationPlan], Direction.UP);

            // Act
            const actual = await executor.migrate(migrationPlanList);

            // Assert
            expect(actual).toHaveLength(1);
            expect(actual[0].getVersion()).toBe("A");
            expect(actual[0].getState()).toBe(State.EXECUTE);
            expect(actual[0].getSkipped()?.message).toBe("foo");
            expect(actual[0].getError()).toBeNull();
            expect(actual[0].hasError()).toBeFalsy();
            expect(actual[0].isSkipped()).toBeTruthy();

            expect(migration.preDownExecuted).toBe(0);
            expect(migration.downExecuted).toBe(0);
            expect(migration.postDownExecuted).toBe(0);

            expect(migration.preUpExecuted).toBe(1);
            expect(migration.upExecuted).toBe(0);
            expect(migration.postUpExecuted).toBe(0);
        });


        it("should abort migration on abort migration",  async () => {
            // Arrange
            class AbortMigrations extends MigrationMock {

                public async up(): Promise<void> {
                    this.abortIf(true, "foo");
                    return super.up();
                }
            }

            const migrationA = new AbortMigrations("A");
            const migrationB = new AbortMigrations("B");
            const migrationPlanA = new MigrationPlan(migrationA, Direction.UP);
            const migrationPlanB = new MigrationPlan(migrationB, Direction.UP);
            const migrationPlanList = new MigrationPlanList([migrationPlanA, migrationPlanB], Direction.UP);

            // Act
            const actual = await executor.migrate(migrationPlanList);

            // Assert
            expect(actual).toHaveLength(2);
            expect(actual[0].getVersion()).toBe("A");
            expect(actual[0].getDirection()).toBe(Direction.UP);
            expect(actual[0].getState()).toBe(State.EXECUTE);
            expect(actual[0].getSkipped()).toBeNull();
            expect(actual[0].getError()?.message).toBe("foo");
            expect(actual[0].hasError()).toBeTruthy();
            expect(actual[0].isSkipped()).toBeFalsy();

            expect(actual[1].getVersion()).toBe("A");
            expect(actual[1].getDirection()).toBe(Direction.DOWN);
            expect(actual[1].getState()).toBe(State.NONE);
            expect(actual[1].getSkipped()).toBeNull();
            expect(actual[1].getError()).toBeNull();
            expect(actual[1].hasError()).toBeFalsy();
            expect(actual[1].isSkipped()).toBeFalsy();

            expect(migrationA.preDownExecuted).toBe(1);
            expect(migrationA.downExecuted).toBe(1);
            expect(migrationA.postDownExecuted).toBe(1);

            expect(migrationA.preUpExecuted).toBe(1);
            expect(migrationA.upExecuted).toBe(0);
            expect(migrationA.postUpExecuted).toBe(0);

            expect(migrationB.preDownExecuted).toBe(0);
            expect(migrationB.downExecuted).toBe(0);
            expect(migrationB.postDownExecuted).toBe(0);

            expect(migrationB.preUpExecuted).toBe(0);
            expect(migrationB.upExecuted).toBe(0);
            expect(migrationB.postUpExecuted).toBe(0);
        });

        it("should execute migrations as expected",  async () => {
            // Arrange
            const migrationA = new MigrationMock("A");
            const migrationB = new MigrationMock("B");
            const migrationPlanA = new MigrationPlan(migrationA, Direction.UP);
            const migrationPlanB = new MigrationPlan(migrationB, Direction.UP);
            const migrationPlanList = new MigrationPlanList([migrationPlanA, migrationPlanB], Direction.UP);

            // Act
            const actual = await executor.migrate(migrationPlanList);

            // Assert
            expect(actual).toHaveLength(2);
            expect(actual[0].getVersion()).toBe("A");
            expect(actual[0].getState()).toBe(State.NONE);
            expect(actual[0].getSkipped()).toBeNull();
            expect(actual[0].getError()).toBeNull();
            expect(actual[0].hasError()).toBeFalsy();
            expect(actual[0].isSkipped()).toBeFalsy();

            expect(actual[1].getVersion()).toBe("B");
            expect(actual[1].getState()).toBe(State.NONE);
            expect(actual[1].getSkipped()).toBeNull();
            expect(actual[1].getError()).toBeNull();
            expect(actual[1].hasError()).toBeFalsy();
            expect(actual[1].isSkipped()).toBeFalsy();

            expect(migrationA.preDownExecuted).toBe(0);
            expect(migrationA.downExecuted).toBe(0);
            expect(migrationA.postDownExecuted).toBe(0);

            expect(migrationA.preUpExecuted).toBe(1);
            expect(migrationA.upExecuted).toBe(1);
            expect(migrationA.postUpExecuted).toBe(1);

            expect(migrationB.preDownExecuted).toBe(0);
            expect(migrationB.downExecuted).toBe(0);
            expect(migrationB.postDownExecuted).toBe(0);

            expect(migrationB.preUpExecuted).toBe(1);
            expect(migrationB.upExecuted).toBe(1);
            expect(migrationB.postUpExecuted).toBe(1);
        });

    });

});
