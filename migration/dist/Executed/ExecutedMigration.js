"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedMigration = void 0;
class ExecutedMigration {
    constructor(version, timestamp, duration) {
        this.version = version;
        this.timestamp = timestamp;
        this.duration = duration;
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
    toJSON() {
        return {
            version: this.version,
            timestamp: this.timestamp,
            duration: this.duration,
        };
    }
}
exports.ExecutedMigration = ExecutedMigration;
//# sourceMappingURL=ExecutedMigration.js.map