import { Alias, AliasResolver, Direction, ExecutedMigrationMemoryStorage, ExecutionResult, MigrationStorage, NoMigrationsFoundWithCriteria, UnknownMigrationVersion } from "../src";
import { MigrationMock } from "./Mock/MigrationMock";

describe("AliasResolver", () => {

    describe("resolveVersionAlias", () => {

        it("should resolve aliases", async () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();

            migrationStorage.add(new MigrationMock("A"));
            migrationStorage.add(new MigrationMock("B"));
            migrationStorage.add(new MigrationMock("C"));

            executedMigrationStorage.complete(new ExecutionResult("A", 0, Direction.UP));
            executedMigrationStorage.complete(new ExecutionResult("B", 1, Direction.UP));

            const aliasResolver = new AliasResolver(migrationStorage, executedMigrationStorage);

            // Act and Assert
            await expect(aliasResolver.resolveVersionAlias(Alias.FIRST)).resolves.toBe("0");
            await expect(aliasResolver.resolveVersionAlias(Alias.CURRENT)).resolves.toBe("B");
            await expect(aliasResolver.resolveVersionAlias(Alias.PREVIOUS)).resolves.toBe("A");
            await expect(aliasResolver.resolveVersionAlias(Alias.NEXT)).resolves.toBe("C");
            await expect(aliasResolver.resolveVersionAlias(Alias.LATEST)).resolves.toBe("C");
            await expect(aliasResolver.resolveVersionAlias("current-1")).resolves.toBe("A");
            await expect(aliasResolver.resolveVersionAlias("current+1")).resolves.toBe("C");
            await expect(aliasResolver.resolveVersionAlias("B")).resolves.toBe("B");
            await expect(aliasResolver.resolveVersionAlias("0")).resolves.toBe("0");
            await expect(aliasResolver.resolveVersionAlias("X")).rejects.toBeInstanceOf(UnknownMigrationVersion);
        });


        it("should resolve aliases without executions", async () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();

            migrationStorage.add(new MigrationMock("A"));
            migrationStorage.add(new MigrationMock("B"));
            migrationStorage.add(new MigrationMock("C"));

            const aliasResolver = new AliasResolver(migrationStorage, executedMigrationStorage);

            // Act and Assert
            await expect(aliasResolver.resolveVersionAlias(Alias.FIRST)).resolves.toBe("0");
            await expect(aliasResolver.resolveVersionAlias(Alias.CURRENT)).resolves.toBe("0");
            await expect(aliasResolver.resolveVersionAlias(Alias.PREVIOUS)).resolves.toBe("0");
            await expect(aliasResolver.resolveVersionAlias(Alias.NEXT)).resolves.toBe("A");
            await expect(aliasResolver.resolveVersionAlias(Alias.LATEST)).resolves.toBe("C");
            await expect(aliasResolver.resolveVersionAlias("current-1")).rejects.toBeInstanceOf(NoMigrationsFoundWithCriteria);
            await expect(aliasResolver.resolveVersionAlias("current+1")).resolves.toBe("A");
            await expect(aliasResolver.resolveVersionAlias("B")).resolves.toBe("B");
            await expect(aliasResolver.resolveVersionAlias("X")).rejects.toBeInstanceOf(UnknownMigrationVersion);
        });

    });

});
