"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationList = void 0;
const NoMigrationsFoundWithCriteria_1 = require("../Exception/NoMigrationsFoundWithCriteria");
const MigrationNotFound_1 = require("../Exception/MigrationNotFound");
class MigrationList {
    constructor(migrations) {
        this.migrations = migrations;
    }
    getAll() {
        return [...this.migrations];
    }
    getFirst(offset = 0) {
        if (typeof this.migrations[offset] === "undefined") {
            throw new Error(`First migration with offset "${offset}" not found.`);
        }
        return this.migrations[offset];
    }
    getLast(offset = 0) {
        offset = this.migrations.length - 1 - (-1 * offset);
        if (typeof this.migrations[offset] === "undefined") {
            throw new NoMigrationsFoundWithCriteria_1.NoMigrationsFoundWithCriteria(`Latest migration with offset "${offset}" not found.`);
        }
        return this.migrations[offset];
    }
    get(version) {
        for (const migration of this.migrations) {
            if (migration.getVersion() === version) {
                return migration;
            }
        }
        throw MigrationNotFound_1.MigrationNotFound.new(version);
    }
    has(version) {
        for (const migration of this.migrations) {
            if (migration.getVersion() === version) {
                return true;
            }
        }
        return false;
    }
    length() {
        return this.migrations.length;
    }
}
exports.MigrationList = MigrationList;
//# sourceMappingURL=MigrationList.js.map