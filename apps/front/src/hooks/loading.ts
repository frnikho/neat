import {useState} from "react";

export const useLoading = () => {
    const [loading, setLoading] = useState(false);

    const startLoading = () => {
        setLoading(true);
    };

    const stopLoading = () => {
        setLoading(false);
    };

    const execute = async <T = void, Z = any>(promise: Promise<T>, success: (params: T) => void, error: (error: Z) => void) => {
        startLoading();
        promise
            .then(success)
            .catch(error)
            .finally(() => {
                stopLoading();
            }
        );
    }

    return {
        loading,
        startLoading,
        stopLoading,
        execute
    };
}