'use client'
import {useEffect, useState} from "react";


export function useIdParam(param: Promise<{id: string}>, defaultValue?: string) {
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await param;
            setValue(unwrappedParams.id);
        };
        unwrapParams();
    }, [param]);


    return value;

}
