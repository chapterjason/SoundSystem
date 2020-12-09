import * as path from "path";
import { ProcessEnvironment } from "@mscs/environment";

export const PACKAGE_DIRECTORY = path.join(__dirname, "..");

export function joinToPackageDirectory(item: string) {
    return path.join(PACKAGE_DIRECTORY, item);
}

export const ENVIRONMENT = new ProcessEnvironment();
