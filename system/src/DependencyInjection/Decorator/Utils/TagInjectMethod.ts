import { Inject } from "../InjectDecorator";
import { ServiceIdentifier } from "../../Service/ServiceIdentifier";
import { MethodInjection } from "../../Injection/MethodInjection";

export function tagInjectMethod(target: Object, serviceIdentifier: ServiceIdentifier, method: string): void {
    const constructor = target.constructor;

    if (!Reflect.hasOwnMetadata(Inject.METHOD, constructor)) {
        Reflect.defineMetadata(Inject.METHOD, [], constructor);
    }

    const injections: MethodInjection[] = Reflect.getOwnMetadata(Inject.METHOD, constructor);

    injections.push({
        serviceIdentifier,
        method,
    });

    Reflect.defineMetadata(Inject.METHOD, injections, constructor);
}
