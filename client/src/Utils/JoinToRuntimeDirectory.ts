import path from "path";
import { RUNTIME_DIRECTORY } from "../constants";

export function joinToRunetimeDirectory(item: string) {
    return path.join(RUNTIME_DIRECTORY, item);
}
