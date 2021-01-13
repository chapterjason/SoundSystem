import { Injection } from "./Injection";
import { FunctionKeys } from "utility-types";

export interface MethodInjection<T extends object = {}> extends Injection {
    method: FunctionKeys<T> | string;
}
