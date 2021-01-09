import { Direction, ExecutedMigrationMemoryStorage, ExecutionResult, MigrationStatusCalculator, MigrationStorage } from "../src";
import { MigrationMock } from "./Mock/MigrationMock";

describe("MigrationStatusCalculator", () => {

    describe("getNewMigrations", () => {

        it("should return new migrations", async () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();
            const migrationStatusCalculator = new MigrationStatusCalculator(migrationStorage, executedMigrationStorage);

            migrationStorage.add(new MigrationMock("A"));
            migrationStorage.add(new MigrationMock("B"));
            migrationStorage.add(new MigrationMock("C"));

            await executedMigrationStorage.complete(new ExecutionResult("A", 0, Direction.UP));

            // Act
            const actual = await migrationStatusCalculator.getNewMigrations();

            // Assert
            const items = actual.getAll();

            expect(items[0].getVersion()).toBe("B");
            expect(items[1].getVersion()).toBe("C");
        });
    });

    describe("getExecutedUnavailableMigrations", () => {
        it("should return executed unavailable migrations", async () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();
            const migrationStatusCalculator = new MigrationStatusCalculator(migrationStorage, executedMigrationStorage);

            migrationStorage.add(new MigrationMock("A"));

            await executedMigrationStorage.complete(new ExecutionResult("A", 0, Direction.UP));
            await executedMigrationStorage.complete(new ExecutionResult("B", 0, Direction.UP));
            await executedMigrationStorage.complete(new ExecutionResult("C", 0, Direction.UP));

            // Act
            const actual = await migrationStatusCalculator.getExecutedUnavailableMigrations();

            // Assert
            const items = actual.getAll();

            expect(items[0].getVersion()).toBe("B");
            expect(items[1].getVersion()).toBe("C");
        });
    });

});
