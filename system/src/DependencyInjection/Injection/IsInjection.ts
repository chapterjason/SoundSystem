import { Injection } from "./Injection";

export function isInjection(target: unknown): target is Injection {
    return typeof target === "object" && typeof (target as Injection).serviceIdentifier !== "undefined";
}
