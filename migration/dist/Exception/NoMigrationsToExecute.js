"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoMigrationsToExecute = void 0;
const RuntimeException_1 = require("./RuntimeException");
class NoMigrationsToExecute extends RuntimeException_1.RuntimeException {
    static new(error) {
        return new this(`Could not find any migrations to execute.`, error);
    }
}
exports.NoMigrationsToExecute = NoMigrationsToExecute;
//# sourceMappingURL=NoMigrationsToExecute.js.map