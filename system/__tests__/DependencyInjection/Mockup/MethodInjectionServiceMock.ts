export class MethodInjectionServiceMock {

    public injection!: string;

    public setValue(value: string) {
        this.injection = value;
    }

}
