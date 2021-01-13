import { Injection } from "./Injection";
import { NonFunctionKeys } from "utility-types";

export interface PropertyInjection<T extends object> extends Injection {
    property: NonFunctionKeys<T> | string;
}
