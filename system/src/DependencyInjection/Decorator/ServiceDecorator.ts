import { ServiceOptions } from "../Service/ServiceOptions";
import { tagService } from "./Utils/TagService";

export function Service(name: string, options?: Partial<Omit<ServiceOptions, "name">>) {
    return (<TFunction extends Function>(target: TFunction): TFunction | void => {
        tagService(target, {
            ...options,
            name,
        });

        return target;
    }) as ClassDecorator;
}

Service.OPTIONS = "service.options";
