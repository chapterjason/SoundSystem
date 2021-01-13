import { FooServiceMock } from "./FooServiceMock";

export class TaggedConstructorInjectionServiceMock {

    public injection: FooServiceMock[];

    public constructor(injection: FooServiceMock[]) {
        this.injection = injection;
    }

}
