"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeException = void 0;
class RuntimeException extends Error {
    constructor(message, previous) {
        super(message);
        this.previous = previous;
    }
    getPrevious() {
        return this.previous;
    }
}
exports.RuntimeException = RuntimeException;
//# sourceMappingURL=RuntimeException.js.map