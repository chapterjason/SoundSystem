import { isInjection } from "./IsInjection";
import { PropertyInjection } from "./PropertyInjection";

export function isPropertyInjection<T extends object = {}>(target: unknown): target is PropertyInjection<T> {
    return isInjection(target) && typeof (target as PropertyInjection<T>).property !== "undefined";
}
