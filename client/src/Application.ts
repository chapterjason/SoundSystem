import { Application as BaseApplication } from "@mscs/console";
import { Inject, NpmPackage, Service } from "@soundsystem/system";

@Service("application", { private: false })
export class Application extends BaseApplication {

    public constructor(@Inject("@package") npmPackage: NpmPackage) {
        super("client", npmPackage.getData().version);
    }

}
