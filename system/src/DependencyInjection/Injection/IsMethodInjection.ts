import { isInjection } from "./IsInjection";
import { MethodInjection } from "./MethodInjection";

export function isMethodInjection<T extends object = {}>(target: unknown): target is MethodInjection<T> {
    return isInjection(target) && typeof (target as MethodInjection<T>).method !== "undefined";
}
