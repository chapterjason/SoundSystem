import { exec } from "child_process";

export function escapeShellArguments(args: string[]) {
    return args.map((item: string) => {
        if (/[^A-Za-z0-9_=:-]/.test(item)) {
            return "'" + item.replace(/'/g, "'\\''") + "'";
        }

        return item;
    });
}

export async function execute(command: string[]) {
    const args = escapeShellArguments(command);

    return new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
        exec(args.join(" "), (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({ stdout, stderr });
        });
    });
}
