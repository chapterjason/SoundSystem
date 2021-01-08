import { ExecutionResult, SkipMigration, State } from "../src";

describe("ExecutionResult", () => {

    describe("GetSetDuration", () => {

        it("should set and returns the version", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            result.setDuration(4);

            const actual = result.getDuration();

            // Assert
            expect(actual).toBe(4);
        });

    });

    describe("GetSetSkipped", () => {

        it("should return false default", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            const actual = result.isSkipped();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should set and return skip", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            result.setSkipped(new SkipMigration("foo"));

            const actual = result.isSkipped();

            // Assert
            expect(actual).toBeTruthy();
        });

    });

    describe("HasSetError", () => {
        it("should be default to false", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            const actual = result.hasError();

            // Assert
            expect(actual).toBeFalsy();
        });

        it("should set and return true", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            result.setError(new Error());

            // Assert
            const actual = result.hasError();

            expect(actual).toBeTruthy();
        });
    });

    describe("SetGetState", () => {
        it("should set and get state", () => {
            // Arrange
            const result = new ExecutionResult("A", 1);

            // Act
            result.setState(State.EXECUTE);
            const actual = result.getState();

            // Assert
            expect(actual).toBe(State.EXECUTE);
        });
    });

    describe("Version", () => {
        it("should set via constructor", () => {
            // Act
            const result = new ExecutionResult("A", 1);

            // Assert
            expect(result.getVersion()).toBe("A");
        });

        it("should return version", () => {
            // Arrange
            const result = new ExecutionResult("B", 1);

            // Act
            const actual = result.getVersion();

            // Assert
            expect(actual).toBe("B");
        });
    });

    describe("Timestamp", () => {
        it("should set via constructor", () => {
            // Act
            const result = new ExecutionResult("A", 10);

            // Assert
            expect(result.getTimestamp()).toBe(10);
        });

        it("should return version", () => {
            // Arrange
            const result = new ExecutionResult("B", 20);

            // Act
            const actual = result.getTimestamp();

            // Assert
            expect(actual).toBe(20);
        });
    });

});
