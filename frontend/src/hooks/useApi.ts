import { useEffect, useState } from "react";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
    public status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

async function apiFetch<T>(
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

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            errorData.message || errorData.error || `Error ${response.status}`,
            response.status
        );
    }

    const data = await response.json();
    return [data, response.status];
}

export type ApiStatus = 'loading' | 'error' | 'success';

export function useApi<T>(endpoint: string, options: RequestInit) {
    const [status, setStatus] = useState<ApiStatus>('loading');
    const [statusCode, setStatusCode] = useState<number>(0);
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
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
