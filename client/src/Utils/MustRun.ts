import { Process, ProcessOptions } from "@mscs/process";

export async function mustRun(command: string[], options: Partial<ProcessOptions> = {}) {
    const commandProcess = new Process(command, options);

    return await commandProcess.mustRun();
}
