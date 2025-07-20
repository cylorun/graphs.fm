import { useEffect, useState } from "react";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
    public status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

function parseJSONWithDates<T>(json: string): T {
    return JSON.parse(json, (_key, value) => {
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
            return new Date(value);
        }
        return value;
    });
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<[T, number]> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    const rawText = await response.text();

    if (!response.ok) {
        let errorData = {};
        try {
            errorData = parseJSONWithDates(rawText);
        } catch (_) {}
        throw new ApiError((errorData as any).message || `Error ${response.status}`, response.status);
    }

    const data: T = parseJSONWithDates(rawText);
    return [data, response.status];
}

export type ApiStatus = 'loading' | 'error' | 'success';

export function useApi<T>(endpoint: string | null, options: RequestInit = {}, defaultValue?: T) {
    if (endpoint && !endpoint?.startsWith("/")) {
        throw new Error("Endpoints should always start with a trailing slash");
    }

    const [status, setStatus] = useState<ApiStatus>('loading');
    const [statusCode, setStatusCode] = useState<number>(0);
    const [data, setData] = useState<T | undefined>(defaultValue);

    useEffect(() => {
        if (!endpoint) {
            console.log("goon")
            return
        };

        let isMounted = true;
        setStatus('loading');

        apiFetch<T>(endpoint, options)
            .then(([data, code]) => {
                if (!isMounted) return;
                setData(data);
                setStatusCode(code);
                setStatus('success');
            })
            .catch((e) => {
                if (!isMounted) return;
                setStatus('error');
                setStatusCode(e.status || 0);
            });

        return () => {
            isMounted = false;
        };
    }, [endpoint, JSON.stringify(options)]);


    return { status, statusCode, data };
}
