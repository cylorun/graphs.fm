'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { PublicUser } from '@shared/types';
import { useApi } from '@/hooks/useApi';

type Session = {
    user: PublicUser | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
};

const SessionContext = createContext<Session>({
    user: null,
    status: 'loading',
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, status } = useApi<PublicUser>('/users', {
        method: 'GET',
    });

    const sessionStatus: Session['status'] = useMemo(() => {
        if (status === 'loading') return 'loading';
        if (status === 'error' || !data) return 'unauthenticated';
        return 'authenticated';
    }, [status, data]);

    const sessionValue = useMemo<Session>(() => ({
        user: data ?? null,
        status: sessionStatus,
    }), [data, sessionStatus]);

    return (
        <SessionContext.Provider value={sessionValue}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
