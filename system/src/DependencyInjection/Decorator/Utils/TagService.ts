import { ServiceOptions } from "../../Service/ServiceOptions";
import { SERVICE_DEFAULTS } from "../../Service/ServiceDefaults";
import { Service } from "../ServiceDecorator";

export function tagService(target: Function, options: Partial<Omit<ServiceOptions, "name">> & Pick<ServiceOptions, "name">): void {
    if (!Reflect.hasOwnMetadata(Service.OPTIONS, target)) {

        Reflect.defineMetadata(Service.OPTIONS, {
            ...SERVICE_DEFAULTS,
            ...options,
        } as ServiceOptions, target);
    }
}
