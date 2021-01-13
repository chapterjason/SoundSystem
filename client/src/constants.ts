import * as os from "os";
import * as path from "path";

export const PACKAGE_DIRECTORY = path.join(__dirname, "..");

export const RUNTIME_DIRECTORY = process.cwd();

export const HOSTNAME = os.hostname();

export const ID_FILE = path.join(RUNTIME_DIRECTORY, ".id");
