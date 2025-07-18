'use client';

import React, { ReactNode, useEffect, useMemo, useState } from "react";
import Container from "@/components/container";
import UserNav, { UserNavSkeleton } from "@/components/user-nav";
import { PublicUser, UserNotFoundException } from "@shared/types";
import { useApi, API_BASE_URL } from "@/hooks/useApi";

export type UserPageLayoutProps = {
    uid: string;
    tab: "overview" | "top" | "reccomended" | "friends";
    children: ReactNode;
};

export const UserPageLayoutSkeleton = () => (
    <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
        <UserNavSkeleton />
        {/* Let pages add their own skeletons below */}
    </Container>
);

const UserPageLayout = ({ uid, tab, children }: UserPageLayoutProps) => {
    const [error, setError] = useState<Error | null>(null);

    const {
        status: userStatus,
        statusCode,
        data: user
    } = useApi<PublicUser>(uid ? `/users/${uid}` : '', {
        method: 'GET'
    });

    // Set timezone on load
    useEffect(() => {
        const updateUserTimezone = async () => {
            if (!uid) return;
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                await fetch(`${API_BASE_URL}/users/set-timezone`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timezone: timeZone }),
                });
            } catch (e) {
                console.error("Failed to update timezone", e);
            }
        };
        updateUserTimezone();
    }, [uid]);

    useEffect(() => {
        if (userStatus === "error" && statusCode === 404) {
            setError(new UserNotFoundException("User not found"));
        } else if (userStatus === "error") {
            setError(new Error("Failed to fetch user"));
        }
    }, [userStatus, statusCode]);

    if (error instanceof UserNotFoundException) {
        return <Container>User not found</Container>;
    }

    if (error) {
        return <Container>Something went wrong</Container>;
    }

    if (userStatus === "loading" || !user) {
        return <UserPageLayoutSkeleton />;
    }

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNav className="border-b-gray-700" user={user} tab={tab} />
            {children}
        </Container>
    );
};

export default UserPageLayout;
