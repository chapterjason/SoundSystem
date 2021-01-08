"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownMigrationVersion = void 0;
const RuntimeException_1 = require("./RuntimeException");
class UnknownMigrationVersion extends RuntimeException_1.RuntimeException {
    static new(version) {
        return new this(`Could not find migration version ${version}`);
    }
}
exports.UnknownMigrationVersion = UnknownMigrationVersion;
//# sourceMappingURL=UnknownMigrationVersion.js.map