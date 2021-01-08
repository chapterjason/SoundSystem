"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationNotFound = void 0;
const RuntimeException_1 = require("./RuntimeException");
class MigrationNotFound extends RuntimeException_1.RuntimeException {
    static new(version) {
        return new this(`Migration "${version}" was not found?`);
    }
}
exports.MigrationNotFound = MigrationNotFound;
//# sourceMappingURL=MigrationNotFound.js.map