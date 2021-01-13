export class ServiceInstance<T = unknown> {
    private instance: T;

    public constructor(instance: T) {
        this.instance = instance;
    }

    public getInstance(): T {
        return this.instance;
    }
}
