import { ConstructorInjection } from "./ConstructorInjection";
import { isInjection } from "./IsInjection";

export function isConstructorInjection(target: unknown): target is ConstructorInjection {
    return isInjection(target) && typeof (target as ConstructorInjection).parameterIndex !== "undefined";
}

