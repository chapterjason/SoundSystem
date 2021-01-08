"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutedMigrationFileStorage = void 0;
const fs_1 = require("fs");
const ExecutedMigration_1 = require("./ExecutedMigration");
const MigrationList_1 = require("../List/MigrationList");
const AlphanumericComparator_1 = require("../Comparator/AlphanumericComparator");
class ExecutedMigrationFileStorage {
    constructor(file) {
        this.list = null;
        this.file = file;
    }
    async load() {
        const buffer = await fs_1.promises.readFile(this.file);
        const data = buffer.toString();
        return JSON.parse(data);
    }
    async save(executedMigrations) {
        const data = JSON.stringify(executedMigrations, null, "  ");
        return await fs_1.promises.writeFile(this.file, data);
    }
    async getAll() {
        return await this.loadList();
    }
    async complete(result) {
        const list = await this.loadList();
        const items = list.getAll();
        items.push(result.toExecutedMigration());
        await this.save(items.map(item => item.toJSON()));
    }
    async loadList() {
        if (!this.list) {
            const dataItems = await this.load();
            const items = dataItems
                .map(dataItem => new ExecutedMigration_1.ExecutedMigration(dataItem.version, dataItem.timestamp, dataItem.duration))
                .sort((a, b) => AlphanumericComparator_1.alphanumericComparator(a.getVersion(), b.getVersion()));
            this.list = new MigrationList_1.MigrationList(items);
        }
        return this.list;
    }
}
exports.ExecutedMigrationFileStorage = ExecutedMigrationFileStorage;
//# sourceMappingURL=ExecutedMigrationFileStorage.js.map