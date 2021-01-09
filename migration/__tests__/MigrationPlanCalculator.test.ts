import { Direction, MigrationNotFound, ExecutedMigrationMemoryStorage, MigrationPlanCalculator, ExecutionResult, MigrationStorage } from "../src";
import { MigrationMock } from "./Mock/MigrationMock";

describe("MigrationPlanCalculator", () => {

    const migrationStorage = new MigrationStorage();
    const executedMigrationStorage = new ExecutedMigrationMemoryStorage();

    migrationStorage.add(new MigrationMock("B"));
    migrationStorage.add(new MigrationMock("A"));
    migrationStorage.add(new MigrationMock("C"));

    const planCalculator = new MigrationPlanCalculator(migrationStorage, executedMigrationStorage);

    beforeEach(async () => {
        executedMigrationStorage.clear();
    });

    test("plan for versions when no migrations", async () => {
        const plan = await planCalculator.getPlanForVersions(["C"], Direction.UP);

        expect(plan.length()).toBe(1);
        expect(plan.getDirection()).toBe(Direction.UP);
        expect(plan.getAll().getFirst().getDirection()).toBe(Direction.UP);
        expect(plan.getAll().getFirst().getVersion()).toBe("C");
    });

    test("plan for multiple versions are sorted up", async () => {
        const plan = await planCalculator.getPlanForVersions(["C", "A"], Direction.UP);

        expect(plan.length()).toBe(2);
        expect(plan.getDirection()).toBe(Direction.UP);
        expect(plan.getAll().getFirst().getDirection()).toBe(Direction.UP);

        expect(plan.getAll().getFirst().getVersion()).toBe("A");
        expect(plan.getAll().getLast().getVersion()).toBe("C");
    });

    test("plan for multiple versions are sorted down", async () => {
        const plan = await planCalculator.getPlanForVersions(["A", "C"], Direction.DOWN);

        expect(plan.length()).toBe(2);
        expect(plan.getDirection()).toBe(Direction.DOWN);
        expect(plan.getAll().getFirst().getDirection()).toBe(Direction.DOWN);

        expect(plan.getAll().getFirst().getVersion()).toBe("C");
        expect(plan.getAll().getLast().getVersion()).toBe("A");
    });

    test("plan for no migration", async () => {
        const plan = await planCalculator.getPlanForVersions([], Direction.UP);

        expect(plan.length()).toBe(0);
        expect(plan.getDirection()).toBe(Direction.UP);
    });

    describe("plan when no migrations", () => {
        test("target A", async () => {
            const plan = await planCalculator.getPlanUntilVersion("A");

            expect(plan.length()).toBe(1);
            expect(plan.getDirection()).toBe(Direction.UP);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[0].getVersion()).toBe("A");
        });

        test("target B", async () => {
            const plan = await planCalculator.getPlanUntilVersion("B");

            expect(plan.length()).toBe(2);
            expect(plan.getDirection()).toBe(Direction.UP);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[0].getVersion()).toBe("A");

            expect(migrationPlans[1].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[1].getVersion()).toBe("B");
        });

        test("target C", async () => {
            const plan = await planCalculator.getPlanUntilVersion("C");

            expect(plan.length()).toBe(3);
            expect(plan.getDirection()).toBe(Direction.UP);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[0].getVersion()).toBe("A");

            expect(migrationPlans[1].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[1].getVersion()).toBe("B");

            expect(migrationPlans[2].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[2].getVersion()).toBe("C");
        });

    });

    test("plan when migrations", async () => {
        await executedMigrationStorage.complete(new ExecutionResult("A", 0, Direction.UP));
        await executedMigrationStorage.complete(new ExecutionResult("B", 1, Direction.UP));

        // 0
        {
            const plan = await planCalculator.getPlanUntilVersion("0");

            expect(plan.length()).toBe(2);
            expect(plan.getDirection()).toBe(Direction.DOWN);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.DOWN);
            expect(migrationPlans[0].getVersion()).toBe("B");

            expect(migrationPlans[1].getDirection()).toBe(Direction.DOWN);
            expect(migrationPlans[1].getVersion()).toBe("A");
        }

        // A
        {
            const plan = await planCalculator.getPlanUntilVersion("A");

            expect(plan.length()).toBe(1);
            expect(plan.getDirection()).toBe(Direction.DOWN);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.DOWN);
            expect(migrationPlans[0].getVersion()).toBe("B");
        }

        // B
        {
            const plan = await planCalculator.getPlanUntilVersion("B");

            expect(plan.length()).toBe(0);
            expect(plan.getDirection()).toBe(Direction.UP);
        }

        // C
        {
            const plan = await planCalculator.getPlanUntilVersion("C");

            expect(plan.length()).toBe(1);
            expect(plan.getDirection()).toBe(Direction.UP);

            const migrationPlans = plan.getAll().getAll();

            expect(migrationPlans[0].getDirection()).toBe(Direction.UP);
            expect(migrationPlans[0].getVersion()).toBe("C");
        }
    });

    test("target migration not found", async () => {
        await expect(planCalculator.getPlanUntilVersion("D")).rejects.toBeInstanceOf(MigrationNotFound);
    });

});
