import { RuntimeException } from "./RuntimeException";
import { ServiceDefinition } from "../Service/ServiceDefinition";

export class InjectionRecursionException extends RuntimeException {

    public definition: ServiceDefinition;

    public constructor(definition: ServiceDefinition) {
        super(`Recursion detected while trying to resolve service "${definition.getName()}".`);
        this.definition = definition;
    }

}
