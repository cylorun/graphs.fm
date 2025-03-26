'use client'
import React, {useEffect, useState} from "react";
import Container from "@/components/container";
import UserNav, {UserNavSkeleton} from "@/components/user-nav";
import {PublicUser, UserNotFoundException} from "@shared/types";
import api from "@/util/api";
import {RecentUserTracksSkeleton} from "@/components/recent-user-tracks";

export type PageProps = {
    params: Promise<{ id: string }>
}

const PageSkeleton = () => {
    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNavSkeleton/>
        </Container>
    )
}


const Page = ({params}: PageProps) => {
    const [uid, setUid] = useState<string>(); // username or uid
    const [error, setError] = useState<Error>();
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<PublicUser | null>(null);


    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await params;
            setUid(unwrappedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!uid) return;
            setLoading(true);

            try {
                const res = await api.get(`/users/${uid}`, {
                    validateStatus: (status: number) => status === 200 || status === 304,
                });

                if (res.status === 200 || res.status === 304) {
                    setUser({
                        ...res.data,
                        createdAt: new Date(res.data.createdAt),
                        lastLogin: new Date(res.data.lastLogin)
                    });
                }
            } catch (e: any) {
                if (e.status === 404) {
                    setError(new UserNotFoundException("User not found"));
                    return;
                }
                setError(new Error("Failed to fetch user data: " + e.status));
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    if (error instanceof UserNotFoundException) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                User not found
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
                Something went wrong
            </Container>
        )
    }

    if (loading || !user) {
        return <PageSkeleton/>
    }

    return (
        <Container className="flex flex-col min-h-screen pb-0 pt-32 md:pt-40 px-5">
            <UserNav className={'border-b-gray-700'} user={user} tab={'top'} />
            <h2 className={'border-b border-b-gray-400 mt-8'}>Top</h2>
        </Container>
    );
}

export default Page;