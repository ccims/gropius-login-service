export enum DefaultReturnResult {
    SUCCESS = "success",
    FAILED = "failed",
}

/**
 * The default return type for requests that don't have a return value
 *
 * Includes the current time and the operation performed
 */
export class DefaultReturn {
    /**
     * A string representation of the operation performed
     * @example "self-register"
     */
    public readonly operation: string;

    /**
     * The result of the operation.
     * Defaults to "success"
     *
     * @example "success"
     */
    public readonly result: DefaultReturnResult = DefaultReturnResult.SUCCESS;

    /**
     * The time the operation was performed.
     * Defaults to the current date+time
     */
    public readonly time: Date = new Date();

    /**
     *
     * @param operation A string representation of the operation performed
     * @param result The result of the operation. Optional
     * @param time The time the operation was performed. Optional
     */
    constructor(operation: string, result = DefaultReturnResult.SUCCESS, time = new Date()) {
        this.operation = operation;
        this.result = result;
        this.time = time;
    }
}
