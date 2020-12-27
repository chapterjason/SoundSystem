import { ProcessEnvironment } from "@mscs/environment";
import { Client } from "./Client";
import path from "path";
import fs, { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import os from "os";

export const ENVIRONMENT = new ProcessEnvironment();

export const CLIENT = new Client();

// PREPARE ID FILE
const idFile = path.join(__dirname, ".id");

if (!existsSync(idFile)) {
    fs.writeFileSync(idFile, uuidv4());
}

export const ID = fs.readFileSync(idFile).toString();

export const HOSTNAME = os.hostname();
