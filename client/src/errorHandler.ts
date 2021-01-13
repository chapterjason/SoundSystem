import { InjectionException, InjectionRecursionException } from "@soundsystem/system";
import * as os from "os";

export interface ErrorWithPrevious extends Error {
    previous: ErrorWithPrevious | Error;
}

function isPreviousError(error: unknown): error is ErrorWithPrevious {
    return typeof error !== "undefined" && error !== null && typeof (error as ErrorWithPrevious).previous !== "undefined";
}

function indent(text: string, depth: number, char: string = "   "){
    return text
        .split(/\r?\n/g)
        .map(line => char.repeat(depth) + line)
        .join(os.EOL);
}

function printError(error: Error | ErrorWithPrevious, level: number = 0) {
    if (!error) {
        return;
    }

    const type = (error?.constructor?.name ?? "Error");
    console.error(indent(`[${level}][${type}] ${error.stack}`, level));

    if (error instanceof InjectionRecursionException) {
        //console.info("definition", error.definition);
    }

    if (error instanceof InjectionException) {
        //console.info("injection", error.injection);
        //console.info("definition", error.definition);
    }

    if (isPreviousError(error)) {
        printError(error.previous, level + 1);
    }
}

export async function errorHandler(error: Error): Promise<number> {
    printError(error);

    return 1;
}
