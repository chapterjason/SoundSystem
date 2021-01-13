import path from "path";
import { PACKAGE_DIRECTORY } from "../constants";

export function joinToPackageDirectory(item: string) {
    return path.join(PACKAGE_DIRECTORY, item);
}
