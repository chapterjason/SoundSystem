import { NpmPackageData } from "@soundsystem/common";

export class NpmPackage {

    protected data: NpmPackageData;

    public constructor(data: NpmPackageData) {
        this.data = data;
    }

    public getData() {
        return this.data;
    }
}
