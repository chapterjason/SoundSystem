export class Exception extends Error {

    public readonly previous: Error | null;

    public constructor(message: string, previous: Error | null = null) {
        super(message);
        this.previous = previous;
    }
}
