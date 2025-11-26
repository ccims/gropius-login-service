export async function withErrorMessage<T>(
    action: () => Promise<T>
): Promise<T> {
    try {
        return await action();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
