import { useEffect, useState } from "react";


export function useLocalStorage<T>(key: string, fallbackValue: T) {

    const [value, setValue] = useState<T>(fallbackValue);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        console.log("ok", stored)
        if (!stored) localStorage.setItem(key, JSON.stringify(fallbackValue));
        setValue(stored ? JSON.parse(stored) : fallbackValue);
    }, [key, fallbackValue]);


    useEffect(() => {
        if (fallbackValue !== value) {
            console.log("from value changed: ", value)
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [fallbackValue, key, value]);

    function cleanStorage() {
        localStorage.clear()
    }

    return [value, setValue, cleanStorage] as const;
}