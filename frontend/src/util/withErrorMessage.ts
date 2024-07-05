import { Ref, ref } from "vue";

export async function withErrorMessage<T>(
    action: () => Promise<T>,
    message: string | ((error: unknown) => string)
): Promise<T> {
    try {
        return await action();
    } catch (error) {
        if (typeof message === "function") {
            //pushErrorMessage(message(error));
        } else {
            //pushErrorMessage(message);
        }
        console.error(error);
        throw error;
    }
}

export function useBlockingWithErrorMessage(): [typeof withErrorMessage, Ref<boolean>] {
    const blocking = ref(false);
    const blockingWithErrorMessage = async <T>(
        action: () => Promise<T>,
        message: string | ((error: unknown) => string)
    ) => {
        blocking.value = true;
        try {
            return await withErrorMessage(action, message);
        } finally {
            blocking.value = false;
        }
    };
    return [blockingWithErrorMessage, blocking];
}
