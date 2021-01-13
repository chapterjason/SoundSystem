import { Inject } from "../InjectDecorator";
import { ServiceIdentifier } from "../../Service/ServiceIdentifier";
import { ConstructorInjection } from "../../Injection/ConstructorInjection";

export function tagInjectConstructor(target: Object, serviceIdentifier: ServiceIdentifier, parameterIndex: number): void {
    if (!Reflect.hasOwnMetadata(Inject.CONSTRUCTOR, target)) {
        Reflect.defineMetadata(Inject.CONSTRUCTOR, [], target);
    }

    const injections: ConstructorInjection[] = Reflect.getOwnMetadata(Inject.CONSTRUCTOR, target);

    injections.push({
        parameterIndex,
        serviceIdentifier,
    });

    Reflect.defineMetadata(Inject.CONSTRUCTOR, injections, target);
}
