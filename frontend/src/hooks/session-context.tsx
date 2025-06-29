"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import {PublicUser} from "@shared/types";
import api from "@/util/api";

type Session = {
    user: PublicUser | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
};

const SessionContext = createContext<Session>({
    user: null,
    status: 'loading',
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [status, setStatus] = useState<Session['status']>('loading');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/users');
                return res.data;
            } catch (e) {
                console.error(e);
                return null;
            }
        };
        fetchUser()
            .then((data: any) => {
                if (data) {
                    setUser(data);
                    setStatus('authenticated');
                } else {
                    setStatus('unauthenticated');
                }
            })
            .catch(() => setStatus('unauthenticated'));
    }, []);

    return (
        <SessionContext.Provider value={{ user, status }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
