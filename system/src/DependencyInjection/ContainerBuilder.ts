import { ServiceOptions } from "./Service/ServiceOptions";
import { Service } from "./Decorator/ServiceDecorator";
import { SERVICE_DEFAULTS } from "./Service/ServiceDefaults";
import { ServiceDefinition } from "./Service/ServiceDefinition";
import { ServiceClassDefinition } from "./Service/ServiceClassDefinition";
import { Injection } from "./Injection/Injection";
import { Inject } from "./Decorator/InjectDecorator";
import { ConstructorInjection } from "./Injection/ConstructorInjection";
import { PropertyInjection } from "./Injection/PropertyInjection";
import { MethodInjection } from "./Injection/MethodInjection";
import { isConstructorInjection } from "./Injection/IsConstructorInjection";
import { isPropertyInjection } from "./Injection/IsPropertyInjection";
import { isMethodInjection } from "./Injection/IsMethodInjection";
import { ServiceFactory } from "./ServiceFactory";
import { ServiceFactoryDefinition } from "./Service/ServiceFactoryDefinition";
import { Class } from "utility-types";
import { LockedException } from "./Exception/LockedException";

export class ContainerBuilder {

    protected definitions: Map<string, ServiceDefinition> = new Map<string, ServiceDefinition>();

    protected locked: boolean = false;

    public registerService<T extends object>(service: Class<T>, options: Partial<ServiceOptions> = {}, injections: (PropertyInjection<T> | MethodInjection<T> | ConstructorInjection)[] = []) {
        if (this.locked) {
            throw new LockedException("ContainerBuilder", "registerService");
        }

        const evaluatedOptions = this.evaluateOptions<T>(service, options);
        const evaluatedInjections = this.evaluateInjections<T>(service, injections);

        const serviceDefinition = new ServiceClassDefinition<T>(service, evaluatedOptions, evaluatedInjections);

        this.definitions.set(serviceDefinition.getName(), serviceDefinition);

        return this;
    }

    public registerFactory<T extends object>(factory: ServiceFactory<T>, service: Class<T>, options: Partial<ServiceOptions> = {}, injections: (PropertyInjection<T> | MethodInjection<T> | ConstructorInjection)[] = []) {
        if (this.locked) {
            throw new LockedException("ContainerBuilder", "registerFactory");
        }

        const evaluatedOptions = this.evaluateOptions<T>(service, options);
        const evaluatedInjections = this.evaluateInjections<T>(service, injections);

        const serviceDefinition = new ServiceFactoryDefinition<T>(factory, service, evaluatedOptions, evaluatedInjections);

        this.definitions.set(serviceDefinition.getName(), serviceDefinition);

        return this;
    }

    public lock() {
        this.locked = true;
    }

    public get<T extends ServiceDefinition>(serviceName: string): T {
        if (!this.has(serviceName)) {
            throw new Error(`Service definition for service "${serviceName}" not found.`);
        }

        return this.definitions.get(serviceName) as T;
    }

    public getAll() {
        return this.definitions;
    }

    public has(serviceName: string): boolean {
        return this.definitions.has(serviceName);
    }

    public getByTag(tag: string): ServiceDefinition[] {
        return [...this.definitions.values()].filter(definition => definition.hasTag(tag));
    }

    private evaluateOptions<T extends object>(service: Class<T>, options: Partial<ServiceOptions> = {}) {
        const target = service.prototype;
        const metadataOptions = Reflect.getMetadata(Service.OPTIONS, target.constructor);

        const mergedOptions: ServiceOptions = {
            ...SERVICE_DEFAULTS,
            ...metadataOptions,
            ...options,
        };

        if (typeof mergedOptions.name === "undefined" || mergedOptions.name === "") {
            throw new Error("Could not determine the service name. (Specify the service name using the \"@Service\" Decorator at the class or as an option when registering the class/factory over \"ContainerBuilder.registerService\" or \"ContainerBuilder.registerFactory\".)");
        }

        if (mergedOptions.name === "container") {
            throw new Error("Service name \"container\" is reserved.");
        }

        return mergedOptions;
    }

    private evaluateInjections<T extends object>(service: Class<T>, injections: Injection[]): Injection[] {
        const constructorInjections = this.evaluateConstructorInjections<T>(service, injections);
        const propertyInjections = this.evaluatePropertyInjections<T>(service, injections);
        const methodInjections = this.evaluateMethodInjections<T>(service, injections);

        return [
            ...constructorInjections,
            ...propertyInjections,
            ...methodInjections,
        ];
    }

    private evaluateConstructorInjections<T extends object>(service: Class<T>, injections: Injection[]): ConstructorInjection[] {
        const target = service.prototype.constructor;

        const metadataInjections: ConstructorInjection[] = Reflect.hasOwnMetadata(Inject.CONSTRUCTOR, target) ? Reflect.getOwnMetadata(Inject.CONSTRUCTOR, target) : [];
        const higherInjections = injections.filter(isConstructorInjection);

        const constructorInjections: ConstructorInjection[] = [...metadataInjections];

        for (const higherInjection of higherInjections) {
            const index = constructorInjections.findIndex(injection => injection.parameterIndex === higherInjection.parameterIndex);

            if (index !== -1) {
                constructorInjections.splice(index, 1, higherInjection);
            } else {
                constructorInjections.push(higherInjection);
            }
        }

        return constructorInjections;
    }

    private evaluatePropertyInjections<T extends object>(service: Class<T>, injections: Injection[]): PropertyInjection<T>[] {
        const target = service.prototype.constructor;

        const metadataInjections: PropertyInjection<T>[] = Reflect.hasOwnMetadata(Inject.PROPERTY, target) ? Reflect.getOwnMetadata(Inject.PROPERTY, target) : [];
        const higherInjections = injections.filter<PropertyInjection<T>>(isPropertyInjection);

        const propertyInjections: PropertyInjection<T>[] = [...metadataInjections];

        for (const higherInjection of higherInjections) {
            const index = propertyInjections.findIndex(injection => injection.property === higherInjection.property);

            if (index !== -1) {
                propertyInjections.splice(index, 1, higherInjection);
            } else {
                propertyInjections.push(higherInjection);
            }
        }

        return propertyInjections;
    }

    private evaluateMethodInjections<T extends object>(service: Class<T>, injections: Injection[]): MethodInjection<T>[] {
        const target = service.prototype.constructor;

        const metadataInjections: MethodInjection<T>[] = Reflect.hasOwnMetadata(Inject.METHOD, target) ? Reflect.getOwnMetadata(Inject.METHOD, target) : [];
        const higherInjections = injections.filter<MethodInjection<T>>(isMethodInjection);

        const methodInjections: MethodInjection<T>[] = [...metadataInjections];

        for (const higherInjection of higherInjections) {
            const index = methodInjections.findIndex(injection => injection.method === higherInjection.method);

            if (index !== -1) {
                methodInjections.splice(index, 1, higherInjection);
            } else {
                methodInjections.push(higherInjection);
            }
        }

        return methodInjections;
    }
}
