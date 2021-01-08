import { RuntimeException } from "./RuntimeException";

export class PlanAlreadyExecuted extends RuntimeException {
    public static new() {
        return new this("This plan was already marked as executed.");
    }
}
