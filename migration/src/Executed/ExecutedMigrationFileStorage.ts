import { ExecutedMigrationStorageInterface } from "./ExecutedMigrationStorageInterface";
import { existsSync, promises as fs } from "fs";
import { ExecutionResult } from "../Executor/ExecutionResult";
import { ExecutedMigration } from "./ExecutedMigration";
import { MigrationList } from "../List/MigrationList";
import { ExecutedMigrationData } from "./ExecutedMigrationData";
import { alphanumericComparator } from "../Comparator/AlphanumericComparator";

export class ExecutedMigrationFileStorage implements ExecutedMigrationStorageInterface {

    private readonly file: string;

    private list: MigrationList<ExecutedMigration> | null = null;

    public constructor(file: string) {
        this.file = file;
    }

    public async load(): Promise<ExecutedMigrationData[]> {
        if (!existsSync(this.file)) {
            await this.save([]);
        }

        const buffer = await fs.readFile(this.file);
        const data = buffer.toString();

        return JSON.parse(data);
    }

    public async save(executedMigrations: ExecutedMigrationData[]): Promise<void> {
        const data = JSON.stringify(executedMigrations, null, "  ");

        return await fs.writeFile(this.file, data);
    }

    public async getAll() {
        return await this.loadList();
    }

    public async complete(result: ExecutionResult): Promise<void> {
        const list = await this.loadList();
        const items = list.getAll();

        items.push(result.toExecutedMigration());

        await this.save(items.map(item => item.toJSON()));
    }

    private async loadList(): Promise<MigrationList<ExecutedMigration>> {
        if (!this.list) {
            const dataItems = await this.load();
            const items = dataItems
                .map(dataItem => new ExecutedMigration(dataItem.version, dataItem.timestamp, dataItem.duration, dataItem.direction))
                .sort((a, b) => alphanumericComparator(a.getVersion(), b.getVersion()));

            this.list = new MigrationList(items);
        }

        return this.list;

    }
}
