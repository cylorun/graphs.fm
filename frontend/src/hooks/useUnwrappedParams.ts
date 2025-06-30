'use client'
import { useEffect, useState } from "react";

export function useUnwrappedParams<T extends string>(
    param: Promise<Record<T, string>>,
    keys: T[]
): Partial<Record<T, string>> | null {
    const [values, setValues] = useState<Partial<Record<T, string>> | null>(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrapped = await param;
            const extracted = keys.reduce((acc, key) => {
                if (key in unwrapped) {
                    acc[key] = unwrapped[key];
                }
                return acc;
            }, {} as Partial<Record<T, string>>);
            setValues(extracted);
        };

        unwrapParams();
    }, [param, keys]);

    return values;
}
