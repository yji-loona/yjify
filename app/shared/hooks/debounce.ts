import { useCallback } from "react";

function useDebounced(callback: () => void, delay: number) {
    const debouncedCallback = useCallback(() => {
        const handler = setTimeout(() => {
            callback();
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [callback, delay]);

    return debouncedCallback;
}

export default useDebounced;
