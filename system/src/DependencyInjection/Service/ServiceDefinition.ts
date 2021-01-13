import { ServiceOptions } from "./ServiceOptions";
import { Injection } from "../Injection/Injection";
import { isConstructorInjection } from "../Injection/IsConstructorInjection";
import { isPropertyInjection } from "../Injection/IsPropertyInjection";
import { isMethodInjection } from "../Injection/IsMethodInjection";

export abstract class ServiceDefinition {

    private options: ServiceOptions;

    private injections: Injection[];

    public constructor(options: ServiceOptions, injections: Injection[]) {
        this.options = options;
        this.injections = injections;
    }

    public getName() {
        return this.options.name;
    }

    public isLazy() {
        return this.options.lazy;
    }

    public isShared() {
        return this.options.shared;
    }

    public isPrivate() {
        return this.options.private;
    }

    public hasTag(tag: string) {
        return this.options.tags.includes(tag);
    }

    public getAliases() {
        return [...this.options.aliases];
    }

    public getConstructorInjections() {
        return this.injections.filter(isConstructorInjection);
    }

    public getPropertyInjections() {
        return this.injections.filter(isPropertyInjection);
    }

    public getMethodInjections() {
        return this.injections.filter(isMethodInjection);
    }

}
