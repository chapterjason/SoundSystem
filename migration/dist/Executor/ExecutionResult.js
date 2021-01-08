"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionResult = void 0;
const State_1 = require("../Migration/State");
const ExecutedMigration_1 = require("../Executed/ExecutedMigration");
class ExecutionResult {
    constructor(version, timestamp) {
        this.skipped = null;
        this.error = null;
        this.state = State_1.State.NONE;
        this.version = version;
        this.timestamp = timestamp;
    }
    getSkipped() {
        return this.skipped;
    }
    getError() {
        return this.error;
    }
    setDuration(duration) {
        this.duration = duration;
    }
    setSkipped(skipped) {
        this.skipped = skipped;
    }
    setError(error) {
        this.error = error;
    }
    isSkipped() {
        return this.skipped !== null;
    }
    hasError() {
        return this.error !== null;
    }
    setState(state) {
        this.state = state;
    }
    getVersion() {
        return this.version;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getDuration() {
        return this.duration;
    }
    toExecutedMigration() {
        return new ExecutedMigration_1.ExecutedMigration(this.version, this.timestamp, this.duration);
    }
    getState() {
        return this.state;
    }
}
exports.ExecutionResult = ExecutionResult;
//# sourceMappingURL=ExecutionResult.js.map