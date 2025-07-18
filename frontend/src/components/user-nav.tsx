import { PublicUser } from "@shared/types";
import Link from "next/link";
import {useEffect} from "react";

export type UserNavProps = {
    user: PublicUser;
    className?: string;
    tab: "overview" | "top" | "reccomended" | "friends";
};

export const UserNavSkeleton = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
                <div className="size-48 rounded-full bg-gray-700 animate-pulse"></div>
                <div className="flex flex-col gap-3">
                    <div className="bg-gray-700 w-36 h-8 rounded-lg animate-pulse"></div>
                    <div className="bg-gray-700 w-24 h-4 rounded-lg animate-pulse"></div>
                    <div className="bg-gray-700 w-24 h-4 rounded-lg animate-pulse"></div>
                </div>
            </div>
            <ul className="flex gap-4">
                {["Overview", "Top", "Recs", "Friends"].map((tab) => (
                    <li key={tab} className="usr-nav-item bg-gray-800 h-10 w-24 rounded-lg animate-pulse"></li>
                ))}
            </ul>
        </div>
    );
};

const UserNav = ({ user, tab, className }: UserNavProps) => {
    return (
        <div className={`flex flex-col gap-6 ${className || ""}`}>
            {/* user info */}
            <div className="flex gap-6 items-center">
                <img
                    src={user.profileImage || "/placeholder-user.jpg"}
                    alt="Profile"
                    className="size-48 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                    <h2 className="text-3xl font-semibold text-white">{user.username}</h2>
                    <p className="text-foreground-muted  text-sm">Joined {user.createdAt.toLocaleDateString()}</p>
                    <p className="text-foreground-muted  text-sm">0 friends</p>
                </div>
            </div>

            {/* nav tabs */}
            <ul className="flex gap-4 flex-wrap">
                {[
                    { name: "Overview", path: `/user/${user.id}/`, key: "overview" },
                    { name: "Top", path: `/user/${user.id}/top`, key: "top" },
                    { name: "Recs", path: `/user/${user.id}/recs`, key: "reccomended" },
                    { name: "Friends", path: `/user/${user.id}/friends`, key: "friends" }
                ].map(({ name, path, key }) => (
                    <a // Making this a Link breaks everything, so don't (infinite re-renders)
                        key={key}
                        href={path}
                        className={`usr-nav-item px-6 py-2 rounded-lg text-sm font-semibold transition-colors
                            ${
                            tab === key
                                ? "bg-primary text-gray-950 shadow-lg"
                                : "bg-card-background text-gray-300 hover:bg-active-card-background hover:text-white"
                        }`}
                    >
                        {name}
                    </a>
                ))}
            </ul>
        </div>
    );
};

export default UserNav;
