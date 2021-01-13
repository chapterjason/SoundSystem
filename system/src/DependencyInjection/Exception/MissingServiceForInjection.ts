import { ServiceDefinition } from "../Service/ServiceDefinition";
import { Injection } from "../Injection/Injection";
import { isConstructorInjection } from "../Injection/IsConstructorInjection";
import { isPropertyInjection } from "../Injection/IsPropertyInjection";
import { isMethodInjection } from "../Injection/IsMethodInjection";
import { RuntimeException } from "./RuntimeException";

export class MissingServiceForInjection extends RuntimeException {

    public definition: ServiceDefinition;

    public injection: Injection;

    constructor(definition: ServiceDefinition, injection: Injection, previous: Error) {
        super(MissingServiceForInjection.getMessage(definition, injection), previous);
        this.definition = definition;
        this.injection = injection;
    }

    private static getMessage(definition: ServiceDefinition, injection: Injection): string {
        let message = `Injection for identifier "${injection.serviceIdentifier}" not found. Requested by service "${definition.getName()}" `;

        if (isConstructorInjection(injection)) {
            message += `in constructor injection at index "${injection.parameterIndex}".`;
        } else if (isPropertyInjection(injection)) {
            message += `in property injection for property "${injection.property}".`;
        } else if (isMethodInjection(injection)) {
            message += `in method injection for method "${injection.method}".`;
        } else {
            message += `in injection "${JSON.stringify(injection)}".`;
        }

        return message;
    }
}
