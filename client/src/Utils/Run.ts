import { Process, ProcessOptions } from "@mscs/process";

export async function run(command: string[], options: Partial<ProcessOptions> = {}) {
    const commandProcess = new Process(command, options);

    await commandProcess.run();

    return commandProcess;
}
