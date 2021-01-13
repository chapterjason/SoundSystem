import { ServiceFactory } from "../ServiceFactory";

export function isServiceFactory<T = unknown>(target: unknown): target is ServiceFactory<T> {
    return typeof target === "function" && !/^\s*class\s+/.test(target.toString());
}
