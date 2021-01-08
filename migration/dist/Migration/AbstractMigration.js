"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMigration = void 0;
const AbortMigration_1 = require("../Exception/AbortMigration");
const SkipMigration_1 = require("../Exception/SkipMigration");
class AbstractMigration {
    warnIf(condition, message = "Unknown Reason") {
        if (!condition) {
            return;
        }
        console.warn(message);
    }
    abortIf(condition, message = "Unknown Reason") {
        if (condition) {
            throw new AbortMigration_1.AbortMigration(message);
        }
    }
    skipIf(condition, message = "Unknown Reason") {
        if (condition) {
            throw new SkipMigration_1.SkipMigration(message);
        }
    }
    getDescription() {
        return "";
    }
    async preDown() {
    }
    async down() {
        this.abortIf(true, `No down() migration implemented for "${this.constructor.name}"`);
    }
    async postDown() {
    }
    async preUp() {
    }
    async postUp() {
    }
}
exports.AbstractMigration = AbstractMigration;
//# sourceMappingURL=AbstractMigration.js.map