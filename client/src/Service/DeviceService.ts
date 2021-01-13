import { Inject, Service } from "@soundsystem/system";
import { EnvironmentInterface } from "@mscs/environment";

@Service("device")
export class DeviceService {

    protected device!: string;

    private environment: EnvironmentInterface;

    public constructor(@Inject("@environment") environment: EnvironmentInterface) {
        this.environment = environment;
    }

    public get(): string {
        if (!this.device) {
            if (this.environment.has("DEVICE")) {
                this.device = this.environment.get("DEVICE");
            } else {
                this.device = "Headphone";
            }
        }

        return this.device;
    }
}
