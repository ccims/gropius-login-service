export async function withErrorMessage<T>(action: () => Promise<T>, message?: string): Promise<T> {
    try {
        return await action();
    } catch (error) {
        console.error(message ?? "Request failed", error);
        throw error;
    }
}
