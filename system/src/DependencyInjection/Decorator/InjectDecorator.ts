import { tagInjectConstructor } from "./Utils/TagInjectConstructor";
import { tagInjectMethod } from "./Utils/TagInjectMethod";
import { tagInjectProperty } from "./Utils/TagInjectProperty";
import { ServiceIdentifier } from "../Service/ServiceIdentifier";

export function Inject(id: ServiceIdentifier) {
    return (function (target: Object, propertyKey: string, parameterIndexOrDescriptor?: number | PropertyDescriptor): void {
            if (typeof parameterIndexOrDescriptor === "number") {
                tagInjectConstructor(target, id, parameterIndexOrDescriptor);
            } else if (typeof parameterIndexOrDescriptor !== "undefined") {
                if (!parameterIndexOrDescriptor.writable) {
                    throw new Error(`Can not inject "${parameterIndexOrDescriptor}" into private or protected methods.`);
                }

                tagInjectMethod(target, id, propertyKey);
            } else {
                tagInjectProperty(target, id, propertyKey);
            }
        }
    ) as (PropertyDecorator & ParameterDecorator & MethodDecorator);
}


Inject.CONSTRUCTOR = "inject.constructor";
Inject.PROPERTY = "inject.property";
Inject.METHOD = "inject.method";
