import { Injection } from "./Injection";

export interface ConstructorInjection extends Injection {
    parameterIndex: number;
}
