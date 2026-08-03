export async function withErrorMessage<T>(action: () => Promise<T>, message?: string): Promise<T> {
    try {
        return await action();
    } catch (error) {
        // Unlike the main frontend there is no snackbar to push to here, so the message only ends
        // up in the console - it is still worth keeping next to the error.
        console.error(message ?? "Request failed", error);
        throw error;
    }
}
