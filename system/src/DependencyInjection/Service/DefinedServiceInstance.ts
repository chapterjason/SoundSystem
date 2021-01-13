import { ServiceInstance } from "./ServiceInstance";
import { ServiceDefinition } from "./ServiceDefinition";

export class DefinedServiceInstance<T = unknown> extends ServiceInstance<T> {

    private definition: ServiceDefinition;

    public constructor(instance: T, definition: ServiceDefinition) {
        super(instance);
        this.definition = definition;
    }

}
