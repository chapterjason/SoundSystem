import { ServiceOptions } from "./ServiceOptions";
import { ServiceFactory } from "../ServiceFactory";
import { Injection } from "../Injection/Injection";
import { ServiceClassDefinition } from "./ServiceClassDefinition";
import { Class } from "utility-types";

export class ServiceFactoryDefinition<T = unknown> extends ServiceClassDefinition {

    private readonly factory: ServiceFactory<T>;

    public constructor(factory: ServiceFactory<T>, service: Class<T>, options: ServiceOptions, injections: Injection[]) {
        super(service, options, injections);
        this.factory = factory;
    }

    public getFactory() {
        return this.factory;
    }

}
