import { ContainerBuilder } from "../../src/DependencyInjection/ContainerBuilder";
import { Container } from "../../src/DependencyInjection/Container";
import { FooServiceMock } from "./Mockup/FooServiceMock";
import { ConstructorInjectionServiceMock } from "./Mockup/ConstructorInjectionServiceMock";
import { ServiceDefinition } from "../../src/DependencyInjection/Service/ServiceDefinition";
import { SERVICE_DEFAULTS } from "../../src/DependencyInjection/Service/ServiceDefaults";
import { PropertyInjectionServiceMock } from "./Mockup/PropertyInjectionServiceMock";
import { MethodInjectionServiceMock } from "./Mockup/MethodInjectionServiceMock";
import { TaggedConstructorInjectionServiceMock } from "./Mockup/TaggedConstructorInjectionServiceMock";
import { MissingServiceForInjection } from "../../src/DependencyInjection/Exception/MissingServiceForInjection";
import { FailingConstructorServiceMock } from "./Mockup/FailingConstructorServiceMock";
import { FailingInjectionServiceMock } from "./Mockup/FailingInjectionServiceMock";
import { InjectionException } from "../../src/DependencyInjection/Exception/InjectionException";
import { FailingTaggedInjectionServiceMock } from "./Mockup/FailingTaggedInjectionServiceMock";
import { BarServiceMock } from "./Mockup/BarServiceMock";
import { BazServiceMock } from "./Mockup/BazServiceMock";
import { BozServiceMock } from "./Mockup/BozServiceMock";
import { InjectionRecursionException } from "../../src/DependencyInjection/Exception/InjectionRecursionException";
import { ServiceAMock } from "./Mockup/RecursionTestMocks/ServiceAMock";
import { ServiceBMock } from "./Mockup/RecursionTestMocks/ServiceBMock";
import { ServiceCMock } from "./Mockup/RecursionTestMocks/ServiceCMock";

describe("Container", () => {

    describe("setParameter", () => {

        it("should set the given parameter", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);

            // Act
            container.setParameter("foo", "bar");

            // Assert
            expect(container.getParameter("foo")).toBe("bar");
        });

        it("should override parameter", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.setParameter("foo", "foo");

            // Act
            container.setParameter("foo", "bar");

            // Assert
            expect(container.getParameter("foo")).toBe("bar");
        });

    });

    describe("hasParameter", () => {

        it("should return true if given parameter exists", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.setParameter("foo", "bar");

            // Act
            const actual = container.hasParameter("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should return false if given parameter does not exist", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.setParameter("foo", "bar");

            // Act
            const actual = container.hasParameter("bar");

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("getParameter", () => {

        it("should return the parameter value if given parameter exists", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.setParameter("foo", "bar");

            // Act
            const actual = container.getParameter("foo");

            // Assert
            expect(actual).toBe("bar");
        });

        it("should throw error if given parameter is not set", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.setParameter("foo", "bar");

            // Act
            const actual = () => {
                container.getParameter("bar");
            };

            // Assert
            expect(actual).toThrow("Parameter \"bar\" not found.");
        });

    });

    describe("set", () => {

        it("should set service", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            const instance = new FooServiceMock();

            // Act
            container.set("foo", instance);

            // Assert
            const actual = await container.get("foo");
            expect(actual).toBe(instance);
        });

        it("should throw if the service name is container", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            const instance = new FooServiceMock();

            // Act
            const actual = () => {
                container.set("container", instance);
            };

            // Assert
            expect(actual).toThrow("You cannot set service \"container\".");
        });

        describe("unset", () => {

            it("should throw error if unset private service", () => {
                // Arrange
                const builder = new ContainerBuilder();

                builder.registerService(FooServiceMock, { name: "bar", private: true });

                const container = new Container(builder);

                // Act
                const actual = () => {
                    container.set("bar");
                };

                // Assert
                expect(actual).toThrow("The \"bar\" service is private, you cannot unset it.");
            });

            it("should unset non private services with definition", async () => {
                // Arrange
                const builder = new ContainerBuilder();
                const instance = new FooServiceMock();

                builder.registerService(FooServiceMock, { name: "bar", private: false });

                const container = new Container(builder);

                container.set("bar", instance);

                // PreAssert
                const resolvedInstance = await container.get("bar");
                expect(resolvedInstance).toBe(instance);

                // Act
                container.set("bar");

                // Assert
                const actual = await container.get("bar");
                expect(actual).not.toBe(instance);
            });

            it("should unset non private services", async () => {
                // Arrange
                const builder = new ContainerBuilder();
                const container = new Container(builder);
                const instance = new FooServiceMock();

                container.set("bar", instance);

                // Act
                container.set("bar");

                // Assert
                await expect(container.get("bar")).rejects.toThrow("Service \"bar\" not found.");
            });

        });

        describe("override", () => {

            it("should throw if try to override private service", async () => {
                // Arrange
                const builder = new ContainerBuilder();
                const instance = new FooServiceMock();

                builder.registerService(FooServiceMock, { name: "foo", private: true });

                const container = new Container(builder);

                // Act
                const actual = () => {
                    container.set("foo", instance);
                };

                // Assert
                expect(actual).toThrow("The \"foo\" service is private, you cannot replace it.");
            });

            it("should override non initialized service", async () => {
                // Arrange
                const builder = new ContainerBuilder();
                const instance = new FooServiceMock();

                builder.registerService(FooServiceMock, { name: "foo", private: false });

                const container = new Container(builder);

                // Act
                container.set("foo", instance);

                // Assert
                const actual = await container.get("foo");
                expect(actual).toBe(instance);
            });

            it("should throw if service was already initialized", async () => {
                // Arrange
                const builder = new ContainerBuilder();
                const instance = new FooServiceMock();

                builder.registerService(FooServiceMock, { name: "foo", private: false });

                const container = new Container(builder);
                const resolved = await container.get("foo");

                expect(resolved).not.toBe(instance);

                // Act
                const actual = () => {
                    container.set("foo", instance);
                };

                // Assert
                expect(actual).toThrow("The \"foo\" service is already initialized, you cannot replace it.");
            });

        });

    });

    describe("has", () => {

        it("should return true if the service is already initialized", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            container.set("foo", new FooServiceMock());

            // Act
            const actual = container.has("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should return true if not initialized but has a definition for the service", () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo" });

            const container = new Container(builder);

            // Act
            const actual = container.has("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should return false if not initialized and not definition exist", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);

            // Act
            const actual = container.has("foo");

            // Assert
            expect(actual).toBeFalsy();
        });

    });

    describe("get", () => {

        it("should return itself if serviceName container is given", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);

            // Act
            const actual = await container.get("container");

            // Assert
            expect(actual).toBe(container);
        });

        it("should throw if definition is private", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { private: true, name: "foo" });

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get("foo");
            };

            // Assert
            await expect(actual).rejects.toThrow("Could not get service \"foo\". You should either make it public, or stop using the container directly and use dependency injection instead.");
        });

        it("should return service", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { private: false, name: "foo" });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBeInstanceOf(FooServiceMock);
        });

        it("should return the same service", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { private: false, name: "foo" });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");
            const actual1 = await container.get("foo");

            // Assert
            expect(actual).toBe(actual1);
        });

        it("should throw no definition or instance was found", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get("foo");
            };

            // Assert
            await expect(actual).rejects.toThrow("Service \"foo\" not found.");
        });

        it("should return instance without definition", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const container = new Container(builder);
            const instance = new FooServiceMock();
            container.set("foo", instance);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBe(instance);
        });

    });

    describe("resolveConstructor", () => {

        it("should resolve constructor injections", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(ConstructorInjectionServiceMock, { name: "foo", private: false }, [{
                serviceIdentifier: "%bar%",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            container.setParameter("bar", "baz");

            // Act
            const actual = await container.get<ConstructorInjectionServiceMock>("foo");

            // Assert
            expect(actual.injection).toBe("baz");
        });

    });

    describe("initiateService", () => {

        it("should initialize service from class", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo", private: false });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBeInstanceOf(FooServiceMock);
        });

        it("should initialize service from factory", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerFactory(async () => {
                return new FooServiceMock();
            }, FooServiceMock, { name: "foo", private: false });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBeInstanceOf(FooServiceMock);
        });

        it("should throw on unsupported service definition", async () => {
            // Arrange
            class CustomDefinition extends ServiceDefinition {
            }

            class CustomBuilder extends ContainerBuilder {

                public constructor() {
                    super();

                    this.definitions.set("foo", new CustomDefinition({
                        ...SERVICE_DEFAULTS,
                        name: "bar",
                        private: false,
                    }, []));
                }
            }

            const builder = new CustomBuilder();
            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get("foo");
            };

            // Assert
            await expect(actual).rejects.toThrow("Unsupported service definition.");
        });

    });

    describe("resolveServiceIdentifier", () => {

        it("should resolve service identifier", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const instance = new FooServiceMock();

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@foo",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            container.set("foo", instance);

            // Act
            const actual = await container.get<ConstructorInjectionServiceMock>("bar");

            // Assert
            expect(actual.injection).toBe(instance);
        });

        it("should throw if failed to inject", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const instance = new FooServiceMock();

            builder.registerService(FailingConstructorServiceMock, { name: "foo" });
            builder.registerService(FailingInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@foo",
                property: "injection",
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get<FailingInjectionServiceMock>("bar");
            };

            // Assert
            await expect(actual).rejects.toThrow(InjectionException);
        });

        it("should resolve tagged service identifier", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo1", tags: ["foo"] });
            builder.registerService(FooServiceMock, { name: "foo2", tags: ["foo"] });

            builder.registerService(TaggedConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "!foo",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            // Act
            const actual = await container.get<TaggedConstructorInjectionServiceMock>("bar");

            // Assert
            expect(actual.injection.length).toBe(2);
            expect(actual.injection[0]).toBeInstanceOf(FooServiceMock);
            expect(actual.injection[1]).toBeInstanceOf(FooServiceMock);
            expect(actual.injection[1]).not.toBe(actual.injection[0]);
        });

        it("should throw if resolve tagged service identifier fails", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FailingConstructorServiceMock, { name: "foo1", tags: ["foo"] });

            builder.registerService(FailingTaggedInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "!foo",
                property: "injection",
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get<FailingTaggedInjectionServiceMock>("bar");
            };

            // Assert
            await expect(actual).rejects.toThrow(InjectionException);
        });

        it("should throw if resolve tagged service identifier fails cause of missing service", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(PropertyInjectionServiceMock, { name: "foo1", tags: ["foo"] }, [{
                serviceIdentifier: "@baz",
                property: "injection",
            }]);

            builder.registerService(FailingTaggedInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "!foo",
                property: "injection",
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get<FailingTaggedInjectionServiceMock>("bar");
            };

            // Assert
            await expect(actual).rejects.toThrow(MissingServiceForInjection);
        });

        it("should resolve parameter identifier", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "%foo%",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            container.setParameter("foo", "baz");

            // Act
            const actual = await container.get<ConstructorInjectionServiceMock>("bar");

            // Assert
            expect(actual.injection).toBe("baz");
        });

        it("should throw on invalid service identifier", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "invalid" as any,
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get<ConstructorInjectionServiceMock>("bar");
            };

            // Assert
            await expect(actual).rejects.toThrow("ServiceIdentifier \"invalid\" is invalid.");
        });

    });

    describe("resolveService", () => {

        it("should resolve instance", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const instance = new FooServiceMock();

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@foo",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            container.set("foo", instance);

            // Act
            const actual = await container.get<ConstructorInjectionServiceMock>("bar");

            // Assert
            expect(actual.injection).toBe(instance);
        });

        it("should initialize on definition", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo" });

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@foo",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            // Act
            const actual = await container.get<ConstructorInjectionServiceMock>("bar");

            // Assert
            expect(actual.injection).toBeInstanceOf(FooServiceMock);
        });

        it("should throw if service not found", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(ConstructorInjectionServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@foo",
                parameterIndex: 0,
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get<ConstructorInjectionServiceMock>("bar");
            };

            // Assert
            await expect(actual).rejects.toThrow(MissingServiceForInjection);
        });

    });

    describe("resolveDefinition", () => {

        it("should create new service if it is not shared", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo", shared: false, private: false });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");
            const actual1 = await container.get("foo");

            // Assert
            expect(actual).not.toBe(actual1);
        });

        it("should return initialized service", async () => {
            // Arrange
            const builder = new ContainerBuilder();
            const instance = new FooServiceMock();

            builder.registerService(FooServiceMock, { name: "foo", private: false });

            const container = new Container(builder);

            container.set("foo", instance);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBe(instance);
        });

        it("should initialize service", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(FooServiceMock, { name: "foo", private: false });

            const container = new Container(builder);

            // Act
            const actual = await container.get("foo");

            // Assert
            expect(actual).toBeInstanceOf(FooServiceMock);
        });

    });

    describe("injectProperties", () => {

        it("should inject properties", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(PropertyInjectionServiceMock, { name: "foo", private: false }, [{
                serviceIdentifier: "%bar%",
                property: "injection",
            }]);

            const container = new Container(builder);

            container.setParameter("bar", "baz");

            // Act
            const actual = await container.get<PropertyInjectionServiceMock>("foo");

            // Assert
            expect(actual.injection).toBe("baz");
        });

    });

    describe("injectMethods", () => {

        it("should inject via method", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(MethodInjectionServiceMock, { name: "foo", private: false }, [{
                serviceIdentifier: "%bar%",
                method: "setValue",
            }]);

            const container = new Container(builder);

            container.setParameter("bar", "baz");

            // Act
            const actual = await container.get<PropertyInjectionServiceMock>("foo");

            // Assert
            expect(actual.injection).toBe("baz");
        });

    });

    describe("recursion", () => {
        it("should throw if a recursion was detected", async () => {
            expect.assertions(4);

            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(BarServiceMock, { name: "bar", private: false }, [{
                serviceIdentifier: "@baz",
                property: "baz",
            }]);

            builder.registerService(BazServiceMock, { name: "baz", private: false }, [{
                serviceIdentifier: "@boz",
                property: "boz",
            }]);

            builder.registerService(BozServiceMock, { name: "boz", private: false }, [{
                serviceIdentifier: "@bar",
                property: "bar",
            }]);

            const container = new Container(builder);

            // Act
            const actual = async () => {
                return await container.get("bar");
            };

            // Assert
            try {
                await actual();
            } catch (error) {
                expect(error).toBeInstanceOf(InjectionException);
                expect(error.previous).toBeInstanceOf(InjectionException);
                expect(error.previous.previous).toBeInstanceOf(InjectionException);
                expect(error.previous.previous.previous).toBeInstanceOf(InjectionRecursionException);
            }
        });

        it("should not throw", async () => {
            // Arrange
            const builder = new ContainerBuilder();

            builder.registerService(ServiceAMock, { name: "a", private: false });

            builder.registerService(ServiceBMock, { name: "b", private: false }, [{
                serviceIdentifier: "@a",
                parameterIndex: 0,
            }]);

            builder.registerService(ServiceCMock, { name: "c", private: false }, [{
                serviceIdentifier: "@a",
                parameterIndex: 0,
            }, {
                serviceIdentifier: "@b",
                parameterIndex: 1,
            }]);

            const container = new Container(builder);

            // Act
            const actual =  await container.get("c");

            // Assert
            expect(actual).toBeInstanceOf(ServiceCMock);
        });
    });

});
