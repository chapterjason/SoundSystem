export class RuntimeException extends Error {

    private readonly previous?: Error;

    public constructor(message?: string, previous?: Error) {
        super(message);
        this.previous = previous;
    }

    public getPrevious() {
        return this.previous;
    }

}
