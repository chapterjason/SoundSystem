import { existsSync, promises as fs } from "fs";
import { ID_FILE } from "../constants";
import { v4 as uuidv4 } from "uuid";
import { Inject, Service } from "@soundsystem/system";

@Service("identifier")
export class IdentifierService {

    private id!: string;

    private file: string;

    public constructor(@Inject("%identifier.file%") file: string) {
        this.file = file;
    }

    public async ensure() {
        if (!existsSync(this.file)) {
            await fs.writeFile(this.file, uuidv4());
        }

        const buffer = await fs.readFile(this.file);

        this.id = buffer.toString();
    }

    public get(): string {
        return this.id;
    }
}
