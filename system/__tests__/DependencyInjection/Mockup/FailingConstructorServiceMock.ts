export class FailingConstructorServiceMock {

    public constructor() {
        throw new Error("constructor error");
    }

}
