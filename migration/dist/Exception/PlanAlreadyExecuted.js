"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanAlreadyExecuted = void 0;
const RuntimeException_1 = require("./RuntimeException");
class PlanAlreadyExecuted extends RuntimeException_1.RuntimeException {
    static new() {
        return new this("This plan was already marked as executed.");
    }
}
exports.PlanAlreadyExecuted = PlanAlreadyExecuted;
//# sourceMappingURL=PlanAlreadyExecuted.js.map