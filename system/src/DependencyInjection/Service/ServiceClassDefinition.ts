import { ServiceOptions } from "./ServiceOptions";
import { ServiceDefinition } from "./ServiceDefinition";
import { Injection } from "../Injection/Injection";
import { Class } from "utility-types";

export class ServiceClassDefinition<T = unknown> extends ServiceDefinition {

    private constructable: Class<T>;

    public constructor(constructable: Class<T>, options: ServiceOptions, injections: Injection[]) {
        super(options, injections);
        this.constructable = constructable;
    }

    public getConstructable() {
        return this.constructable;
    }

}
