import path from "path";
import * as fs from "fs";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { ENVIRONMENT } from "./Singleton/Environment";

const idFile = path.join(__dirname, ".id");

if (!existsSync(idFile)) {
    fs.writeFileSync(idFile, uuidv4());
}

export const ID = fs.readFileSync(idFile).toString();

export const DEVICE = ENVIRONMENT.has("DEVICE") ? ENVIRONMENT.get("DEVICE") : "Headphone";
