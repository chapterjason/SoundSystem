import { PackageInfoParser } from "./PackageInfoParser";
import { Process } from "@mscs/process";

export class AdvancedPackageTool {

    protected parser: PackageInfoParser =  new PackageInfoParser();

    public async show(packageName: string) {
        const showProcess = new Process(["sudo", "apt", "show", packageName]);

        await showProcess.mustRun();

        const output = showProcess.getOutput();

        return this.parser.parse(output);
    }

    public async install(packageName: string) {
        const installProcess = new Process(["sudo", "apt", "install", "--no-install-recommends", "--yes", packageName]);

        return await installProcess.mustRun();
    }

    public async update() {
        const updateProcess = new Process(["sudo", "apt", "update"]);

        return await updateProcess.mustRun();
    }

    public async upgrade() {
        const upgradeProcess = new Process(["sudo", "apt", "upgrade", "--yes"]);

        return await upgradeProcess.mustRun();
    }

    public async uninstall(packageName: string) {
        const installProcess = new Process(["sudo", "apt", "remove", "--purge", packageName]);

        return await installProcess.mustRun();
    }
}
