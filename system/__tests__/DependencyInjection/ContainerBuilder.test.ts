import { ContainerBuilder } from "../../src/DependencyInjection/ContainerBuilder";
import { ServiceClassDefinition } from "../../src/DependencyInjection/Service/ServiceClassDefinition";
import { ServiceFactoryDefinition } from "../../src/DependencyInjection/Service/ServiceFactoryDefinition";
import { Service } from "../../src/DependencyInjection/Decorator/ServiceDecorator";
import { Inject } from "../../src/DependencyInjection/Decorator/InjectDecorator";
import { FooServiceMock } from "./Mockup/FooServiceMock";
import { LockedException } from "../../src";
import { ServiceFactory } from "../../dist/DependencyInjection/ServiceFactory";

describe("ContainerBuilder", () => {

    describe("registerService", () => {
        it("should register a service class definition", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            // Act
            builder.registerService(Test, { name: "bar" });

            // Assert
            const actual = builder.get("bar") as ServiceClassDefinition;

            expect(actual).toBeInstanceOf(ServiceClassDefinition);
            expect(actual.getName()).toBe("bar");
            expect(actual.getConstructable()).toBe(Test);
        });

        it("should throw if is locked", () => {
            // Arrange
            const builder = new ContainerBuilder();
            builder.registerService(FooServiceMock, { name: "foo" });
            builder.lock();

            // Act
            const actual = () => {
                builder.registerService(FooServiceMock, {name: "bar"});
            };

            // Assert
            expect(actual).toThrow(LockedException);
        });
    });

    describe("registerFactory", () => {

        it("should register a service factory definition", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            const factory = async () => new Test();

            // Act
            builder.registerFactory(factory, Test, { name: "bar" });

            // Assert
            const actual = builder.get("bar") as ServiceFactoryDefinition;

            expect(actual).toBeInstanceOf(ServiceFactoryDefinition);
            expect(actual.getFactory()).toBe(factory);
        });

        it("should throw if is locked", () => {
            // Arrange
            const builder = new ContainerBuilder();
            const factory = async () => new FooServiceMock();
            builder.registerFactory(factory, FooServiceMock, { name: "foo" });
            builder.lock();

            // Act
            const actual = () => {
                builder.registerFactory(factory, FooServiceMock, {name: "bar"});
            };

            // Assert
            expect(actual).toThrow(LockedException);
        });

    });

    describe("get", () => {
        it("should return registered definition", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            builder.registerService(Test, { name: "bar" });

            // Act
            const actual = builder.get("bar") as ServiceClassDefinition;

            // Assert
            expect(actual.getName()).toBe("bar");
            expect(actual.getConstructable()).toBe(Test);
        });

        it("should throw if definition is not registered", () => {
            // Arrange
            const builder = new ContainerBuilder();

            // Act
            const actual = builder.get.bind(builder, "foo");

            // Assert
            expect(actual).toThrow("Service definition for service \"foo\" not found.");
        });
    });

    describe("getAll", () => {
        it("should return map of all definitions", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            builder.registerService(Test, { name: "foo" });
            builder.registerService(Test, { name: "bar" });

            // Act
            const actual = builder.getAll();

            // Assert
            expect(actual).toBeInstanceOf(Map);
            expect(actual.size).toBe(2);
        });
    });

    describe("has", () => {
        it("should return true if definition is registered", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            builder.registerService(Test, { name: "foo" });

            // Act
            const actual = builder.has("foo");

            // Assert
            expect(actual).toBeTruthy();
        });

        it("should return false if definition is not registered", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            builder.registerService(Test, { name: "foo" });

            // Act
            const actual = builder.has("bar");

            // Assert
            expect(actual).toBeFalsy();
        });
    });

    describe("getByTag", () => {
        it("should return all definitions which has given tag", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            builder.registerService(Test, { name: "foo", tags: ["foo", "bar"] });
            builder.registerService(Test, { name: "bar", tags: ["foo"] });

            // Act
            const actual = builder.getByTag("foo");
            const actual1 = builder.getByTag("bar");

            // Assert
            expect(actual.length).toBe(2);
            expect(actual1.length).toBe(1);
        });
    });

    describe("evaluateOptions", () => {
        it("should extract metadata", () => {
            // Arrange
            const builder = new ContainerBuilder();

            @Service("foo", { lazy: false })
            class Test {
            }

            // Act
            builder.registerService(Test);

            // Assert
            const actual = builder.get("foo") as ServiceClassDefinition;
            expect(actual.isLazy()).toBeFalsy();
        });

        it("should override options", () => {
            // Arrange
            const builder = new ContainerBuilder();

            @Service("foo", { lazy: false })
            class Test {
            }

            // Act
            builder.registerService(Test, { private: false });

            // Assert
            const actual = builder.get("foo") as ServiceClassDefinition;
            expect(actual.isLazy()).toBeFalsy();
            expect(actual.isPrivate()).toBeFalsy();
        });

        it("should throw if the service name is missing", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            // Act
            const actual = () => {
                builder.registerService(Test);
            };

            // Assert
            expect(actual).toThrow("Could not determine the service name");
        });

        it("should throw if the service name is reserved", () => {
            // Arrange
            const builder = new ContainerBuilder();

            class Test {
            }

            // Act
            const actual = () => {
                builder.registerService(Test, { name: "container" });
            };

            // Assert
            expect(actual).toThrow("Service name \"container\" is reserved.");
        });
    });

    describe("evaluateInjections", () => {

        describe("evaluateConstructorInjections", () => {
            it("should extract constructor injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    public bar: unknown;

                    public constructor(@Inject("@bar") bar: unknown) {
                        this.bar = bar;
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" });

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getConstructorInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].parameterIndex).toBe(0);
                expect(injections[0].serviceIdentifier).toBe("@bar");
            });

            it("should override given constructor injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    public bar: unknown;

                    public constructor(@Inject("@bar") bar: unknown) {
                        this.bar = bar;
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "@baz",
                    parameterIndex: 0,
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getConstructorInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].parameterIndex).toBe(0);
                expect(injections[0].serviceIdentifier).toBe("@baz");
            });

            it("should add given constructor injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    public bar: unknown;

                    public constructor(@Inject("@bar") bar: unknown) {
                        this.bar = bar;
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "@baz",
                    parameterIndex: 1,
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getConstructorInjections();
                expect(injections.length).toBe(2);
                expect(injections[0].parameterIndex).toBe(0);
                expect(injections[0].serviceIdentifier).toBe("@bar");
                expect(injections[1].parameterIndex).toBe(1);
                expect(injections[1].serviceIdentifier).toBe("@baz");
            });

        });

        describe("evaluatePropertyInjections", () => {

            it("should extract property injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("@bar")
                    public bar: unknown;
                }

                // Act
                builder.registerService(Test, { name: "foo" });

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getPropertyInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].property).toBe("bar");
                expect(injections[0].serviceIdentifier).toBe("@bar");
            });

            it("should override given property injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("@bar")
                    public bar: unknown;
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "@baz",
                    property: "bar",
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getPropertyInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].property).toBe("bar");
                expect(injections[0].serviceIdentifier).toBe("@baz");
            });

            it("should add given property injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("@bar")
                    public bar: unknown;
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "@baz",
                    property: "baz",
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getPropertyInjections();
                expect(injections.length).toBe(2);
                expect(injections[0].property).toBe("bar");
                expect(injections[0].serviceIdentifier).toBe("@bar");
                expect(injections[1].property).toBe("baz");
                expect(injections[1].serviceIdentifier).toBe("@baz");
            });

        });

        describe("evaluateMethodInjections", () => {

            it("should extract method injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("%bar%")
                    public setBar(bar: string) {
                        throw new Error(bar);
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" });

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getMethodInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].method).toBe("setBar");
                expect(injections[0].serviceIdentifier).toBe("%bar%");
            });

            it("should override given method injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("%bar%")
                    public setBar(bar: string) {
                        throw new Error(bar);
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "%baz%",
                    method: "setBar",
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getMethodInjections();
                expect(injections.length).toBe(1);
                expect(injections[0].method).toBe("setBar");
                expect(injections[0].serviceIdentifier).toBe("%baz%");
            });

            it("should add given method injections", () => {
                // Arrange
                const builder = new ContainerBuilder();

                class Test {
                    @Inject("%bar%")
                    public setBar(bar: string) {
                        throw new Error(bar);
                    }
                }

                // Act
                builder.registerService(Test, { name: "foo" }, [{
                    serviceIdentifier: "%baz%",
                    method: "setBaz",
                }]);

                // Assert
                const actual = builder.get("foo") as ServiceClassDefinition;
                const injections = actual.getMethodInjections();
                expect(injections.length).toBe(2);
                expect(injections[0].method).toBe("setBar");
                expect(injections[0].serviceIdentifier).toBe("%bar%");
                expect(injections[1].method).toBe("setBaz");
                expect(injections[1].serviceIdentifier).toBe("%baz%");
            });

        });

    });

    describe("lock", () => {

        it("should lock the builder", () => {
            // Arrange
            const builder = new ContainerBuilder();
            builder.registerService(FooServiceMock, { name: "foo" });

            // Act
            builder.lock();

            // Assert

            expect(() => {
                builder.registerService(FooServiceMock, {name: "bar"});
            }).toThrow(LockedException);
        });

    });

});
