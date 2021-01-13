import { Inject } from "../InjectDecorator";
import { ServiceIdentifier } from "../../Service/ServiceIdentifier";
import { PropertyInjection } from "../../Injection/PropertyInjection";

export function tagInjectProperty<T extends object>(target: T, serviceIdentifier: ServiceIdentifier, property: string): void {
    const constructor = target.constructor;

    if (!Reflect.hasOwnMetadata(Inject.PROPERTY, constructor)) {
        Reflect.defineMetadata(Inject.PROPERTY, [], constructor);
    }

    const injections: PropertyInjection<T>[] = Reflect.getOwnMetadata(Inject.PROPERTY, constructor);

    injections.push({
        serviceIdentifier,
        property,
    });

    Reflect.defineMetadata(Inject.PROPERTY, injections, constructor);
}
