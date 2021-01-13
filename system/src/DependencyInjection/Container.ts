import { ContainerBuilder } from "./ContainerBuilder";
import { ServiceInstance } from "./Service/ServiceInstance";
import { ServiceDefinition } from "./Service/ServiceDefinition";
import { ServiceFactoryDefinition } from "./Service/ServiceFactoryDefinition";
import { isSingleServiceIdentifier } from "./Service/IsSingleServiceIdentifier";
import { isTaggedServiceIdentifier } from "./Service/IsTaggedServiceIdentifier";
import { isParameterServiceIdentifier } from "./Service/IsParameterServiceIdentifier";
import { DefinedServiceInstance } from "./Service/DefinedServiceInstance";
import { InvalidServiceIdentifier } from "./Exception/InvalidServiceIdentifier";
import { ServiceClassDefinition } from "./Service/ServiceClassDefinition";
import { isPrimitive, Primitive } from "utility-types";
import { MissingService } from "./Exception/MissingService";
import { MissingServiceForInjection } from "./Exception/MissingServiceForInjection";
import { Injection } from "./Injection/Injection";
import { MissingParameter } from "./Exception/MissingParameter";
import { InjectionException } from "./Exception/InjectionException";
import { InjectionRecursionException } from "./Exception/InjectionRecursionException";

export class Container {

    private builder: ContainerBuilder;

    private instances: Map<string, ServiceInstance> = new Map<string, ServiceInstance>();

    private parameters: Map<string, unknown> = new Map<string, unknown>();

    private loading: string[] = [];

    public constructor(builder: ContainerBuilder) {
        this.builder = builder;

        this.builder.lock();
    }

    public setParameter(key: string, value: Primitive) {
        if (!isPrimitive(value)) {
            throw new Error("Parameters can only be primitive values.");
        }

        this.parameters.set(key, value);
    }

    public hasParameter(key: string) {
        return this.parameters.has(key);
    }

    public getParameter<T extends Primitive>(key: string): T {
        if (!this.hasParameter(key)) {
            throw new MissingParameter(key);
        }

        return this.parameters.get(key) as T;
    }

    public set<T extends object>(serviceName: string, service: T | null = null) {
        if (serviceName === "container") {
            throw new Error(`You cannot set service "container".`);
        }

        // resolve alias?

        if (this.builder.has(serviceName)) {
            const definition = this.builder.get(serviceName);

            if (service === null) {
                if (definition.isPrivate()) {
                    throw new Error(`The "${serviceName}" service is private, you cannot unset it.`);
                } else {
                    this.instances.delete(serviceName);
                }

                return this;
            }

            if (definition.isPrivate()) {
                throw new Error(`The "${serviceName}" service is private, you cannot replace it.`);
            }

            if (this.instances.has(serviceName)) {
                throw new Error(`The "${serviceName}" service is already initialized, you cannot replace it.`);
            }
        }

        if (service === null) {
            this.instances.delete(serviceName);

            return this;
        }

        const instance = new ServiceInstance<T>(service);

        // remove all aliases on replacement

        this.instances.set(serviceName, instance);

        return this;
    }

    public has(serviceName: string): boolean {
        if (this.instances.has(serviceName)) {
            return true;
        }

        return this.builder.has(serviceName);
    }

    public async get<T = Container>(serviceName: "container"): Promise<Container>;
    public async get<T extends object>(serviceName: string): Promise<T>;
    public async get<T extends object>(serviceName: string): Promise<T> {
        if (serviceName === "container") {
            return this as any as T;
        }

        if (this.builder.has(serviceName)) {
            const definition = this.builder.get(serviceName);

            if (definition.isPrivate()) {
                throw new Error(`Could not get service "${serviceName}". You should either make it public, or stop using the container directly and use dependency injection instead.`);
            }

            return this.resolveDefinition<T>(serviceName, definition);
        }

        if (this.instances.has(serviceName)) {
            const serviceInstance = this.instances.get(serviceName) as ServiceInstance<T>;

            return serviceInstance.getInstance();
        }

        throw new MissingService(serviceName);
    }

    public boot() {
        // prepare non-lazy
    }

    protected async resolveConstructor(definition: ServiceDefinition): Promise<(object|Primitive)[]> {
        const injections = definition.getConstructorInjections().sort((a, b) => a.parameterIndex - b.parameterIndex);
        const resolved = [];

        for await (const injection of injections) {
            const result = await this.resolveServiceIdentifier(definition, injection);

            resolved.push(result);
        }

        return resolved;
    }

    private async initiateService<T extends object>(definition: ServiceDefinition): Promise<T> {
        const name = definition.getName();

        if (this.loading.includes(name)) {
            throw new InjectionRecursionException(definition);
        }

        const index = this.loading.push(name) - 1;

        const args = await this.resolveConstructor(definition);

        if (definition instanceof ServiceFactoryDefinition) {
            const factory = definition.getFactory();

            const instance = await factory(...args);

            await this.injectProperties(definition, instance);
            await this.injectMethods(definition, instance);

            this.loading.splice(index, 1);

            return instance;
        } else if (definition instanceof ServiceClassDefinition) {
            const constructor = definition.getConstructable();

            const instance = new constructor(...args);

            await this.injectProperties(definition, instance);
            await this.injectMethods(definition, instance);

            this.loading.splice(index, 1);

            return instance;
        }

        throw new Error("Unsupported service definition.");
    }

    private async resolveServiceIdentifier<T extends object>(definition: ServiceDefinition, injection: Injection): Promise<T | T[]>;
    private async resolveServiceIdentifier<T extends Primitive>(definition: ServiceDefinition, injection: Injection): Promise<T>;
    private async resolveServiceIdentifier<T extends object & Primitive>(definition: ServiceDefinition, injection: Injection): Promise<T | T[]> {
        const serviceIdentifier = injection.serviceIdentifier;

        if (isSingleServiceIdentifier(serviceIdentifier)) {
            const serviceName = serviceIdentifier.slice(1);

            try {
                const service = await this.resolveService<T>(serviceName);

                return service;
            } catch (error) {
                if (error instanceof MissingService || error instanceof MissingServiceForInjection) {
                    throw new MissingServiceForInjection(definition, injection, error);
                }

                throw new InjectionException(definition, injection, error);
            }
        } else if (isTaggedServiceIdentifier(serviceIdentifier)) {
            const tag = serviceIdentifier.slice(1);
            const definitions = this.builder.getByTag(tag);
            const resolved: T[] = [];

            for await (const subDefinition of definitions) {
                try {
                    const result = await this.resolveDefinition<T>(subDefinition.getName(), subDefinition);

                    resolved.push(result);
                } catch (error) {
                    if (error instanceof MissingService || error instanceof MissingServiceForInjection) {
                        throw new MissingServiceForInjection(definition, injection, error);
                    }

                    throw new InjectionException(definition, injection, error);

                }
            }

            return resolved;
        } else if (isParameterServiceIdentifier(serviceIdentifier)) {
            const parameterName = serviceIdentifier.slice(1, -1);

            try {
                return this.getParameter<T>(parameterName);
            } catch (error) {
                if (error instanceof MissingParameter) {
                    throw new MissingServiceForInjection(definition, injection, error);
                }

                throw new InjectionException(definition, injection, error);
            }
        }

        throw new InvalidServiceIdentifier(serviceIdentifier);
    }

    private async resolveService<T extends object>(serviceName: string): Promise<T> {
        if (this.instances.has(serviceName)) {
            const instance = this.instances.get(serviceName) as ServiceInstance<T>;

            return instance.getInstance();
        }

        if (this.builder.has(serviceName)) {
            const definition = this.builder.get(serviceName);

            return await this.resolveDefinition<T>(serviceName, definition);
        }

        throw new MissingService(serviceName);
    }

    private async resolveDefinition<T extends object>(serviceName: string, definition: ServiceDefinition): Promise<T> {
        if (!definition.isShared()) {
            return await this.initiateService<T>(definition);
        }

        if (this.instances.has(serviceName)) {
            const serviceInstance = this.instances.get(serviceName) as ServiceInstance<T>;

            return serviceInstance.getInstance();
        }

        const service = await this.initiateService<T>(definition);

        const serviceInstance = new DefinedServiceInstance<T>(service, definition);

        this.instances.set(serviceName, serviceInstance);

        return service;
    }

    private async injectProperties<T extends object>(definition: ServiceDefinition, instance: T): Promise<void> {
        const injections = definition.getPropertyInjections();

        for await (const injection of injections) {
            const property = injection.property;
            const value = await this.resolveServiceIdentifier<T>(definition, injection);

            // Type-Hack
            (instance as Record<string, unknown>)[property] = value;
        }
    }

    private async injectMethods<T extends object>(definition: ServiceDefinition, instance: T): Promise<void> {
        const injections = definition.getMethodInjections();

        for await (const injection of injections) {
            const method = injection.method;
            const value = await this.resolveServiceIdentifier<T>(definition, injection);

            // Type-Hack
            (instance as unknown as Record<string, (value: unknown) => void>)[method](value);
        }
    }
}
