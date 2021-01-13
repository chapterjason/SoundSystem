import { AbstractMigration } from "@soundsystem/migration";
import * as fs from "fs";
import { Service } from "@soundsystem/system";

@Service("migration.migrations.1-0.test", {tags: ["migrations"]})
export class TestMigration extends AbstractMigration {

    public getVersion(): string {
        return "20210114124120";
    }

    public async up(): Promise<void> {
        fs.writeFileSync("~/test.md", "# hello");
    }

    public async down(): Promise<void> {
        fs.unlinkSync("~/test.md");
    }
}
