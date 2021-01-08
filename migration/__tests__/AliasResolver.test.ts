import { NoMigrationsFoundWithCriteria, Alias, AliasResolver, ExecutedMigrationMemoryStorage, ExecutionResult, MigrationStorage, UnknownMigrationVersion } from "../src";
import { MigrationMock } from "./MigrationMock";

describe("AliasResolver", () => {

    describe("resolveVersionAlias", () => {

        it("should resolve aliases", () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();

            migrationStorage.add(new MigrationMock("A"));
            migrationStorage.add(new MigrationMock("B"));
            migrationStorage.add(new MigrationMock("C"));

            executedMigrationStorage.complete(new ExecutionResult("A", 0));
            executedMigrationStorage.complete(new ExecutionResult("B", 1));

            const aliasResolver = new AliasResolver(migrationStorage, executedMigrationStorage);

            // Act and Assert
            expect(aliasResolver.resolveVersionAlias(Alias.FIRST)).resolves.toBe("0");
            expect(aliasResolver.resolveVersionAlias(Alias.CURRENT)).resolves.toBe("B");
            expect(aliasResolver.resolveVersionAlias(Alias.PREVIOUS)).resolves.toBe("A");
            expect(aliasResolver.resolveVersionAlias(Alias.NEXT)).resolves.toBe("C");
            expect(aliasResolver.resolveVersionAlias(Alias.LATEST)).resolves.toBe("C");
            expect(aliasResolver.resolveVersionAlias("current-1")).resolves.toBe("A");
            expect(aliasResolver.resolveVersionAlias("current+1")).resolves.toBe("C");
            expect(aliasResolver.resolveVersionAlias("B")).resolves.toBe("B");
            expect(aliasResolver.resolveVersionAlias("0")).resolves.toBe("0");
            expect(aliasResolver.resolveVersionAlias("X")).rejects.toBeInstanceOf(UnknownMigrationVersion);
        });


        it("should resolve aliases without executions", () => {
            // Arrange
            const migrationStorage = new MigrationStorage();
            const executedMigrationStorage = new ExecutedMigrationMemoryStorage();

            migrationStorage.add(new MigrationMock("A"));
            migrationStorage.add(new MigrationMock("B"));
            migrationStorage.add(new MigrationMock("C"));

            const aliasResolver = new AliasResolver(migrationStorage, executedMigrationStorage);

            // Act and Assert
            expect(aliasResolver.resolveVersionAlias(Alias.FIRST)).resolves.toBe("0");
            expect(aliasResolver.resolveVersionAlias(Alias.CURRENT)).resolves.toBe("0");
            expect(aliasResolver.resolveVersionAlias(Alias.PREVIOUS)).resolves.toBe("0");
            expect(aliasResolver.resolveVersionAlias(Alias.NEXT)).resolves.toBe("A");
            expect(aliasResolver.resolveVersionAlias(Alias.LATEST)).resolves.toBe("C");
            expect(aliasResolver.resolveVersionAlias("current-1")).rejects.toBeInstanceOf(NoMigrationsFoundWithCriteria);
            expect(aliasResolver.resolveVersionAlias("current+1")).resolves.toBe("A");
            expect(aliasResolver.resolveVersionAlias("B")).resolves.toBe("B");
            expect(aliasResolver.resolveVersionAlias("X")).rejects.toBeInstanceOf(UnknownMigrationVersion);
        });

    });

});
