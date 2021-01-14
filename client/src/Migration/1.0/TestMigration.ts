import { AbstractMigration } from "@soundsystem/migration";
import * as fs from "fs";
import { Service } from "@soundsystem/system";
import * as os from "os";
import path from "path";

@Service("migration.migrations.1-0.test", {tags: ["migration"]})
export class TestMigration extends AbstractMigration {

    public getVersion(): string {
        return "20210114124120";
    }

    private getFile(){
        return path.join(os.homedir(), "test.md");
    }

    public async up(): Promise<void> {
        fs.writeFileSync(this.getFile(), "# hello");
    }

    public async down(): Promise<void> {
        fs.unlinkSync(this.getFile());
    }
}
