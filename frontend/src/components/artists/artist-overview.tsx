import { Artist } from "@shared/types";
import Image from "next/image";

export type ArtistOverviewProps = {
    artist: Artist;
};

export function ArtistOverviewSkeleton() {
    return (
        <div className="flex items-center justify-between px-2 w-full">
            <div className="flex items-center gap-4">
                <div className="w-12 aspect-square rounded-full overflow-hidden">
                    <div
                        className="size-[48px] w-full h-full  bg-skeleton animate-pulse"
                    />
                </div>

                <div className="flex flex-col items-start gap-2">
                    <a className="h-6 w-48 rounded-lg bg-skeleton animate-pulse" ></a>
                    <div className="h-6 w-32 rounded-lg bg-skeleton animate-pulse"></div>
                </div>
            </div>

            {/*<button className="text-sm font-medium bg-primary text-black px-4 py-1 rounded-full hover:bg-primary-accent transition">*/}
            {/*    + Follow*/}
            {/*</button>*/}
        </div>
    );
}

export default function ArtistOverview({ artist }: ArtistOverviewProps) {
    return (
        <div className="flex items-center justify-between px-2 w-full">
            <div className="flex items-center gap-4">
                <div className="w-12 aspect-square rounded-full overflow-hidden border border-gray-400">
                    <Image
                        src={artist.imageUrl || "/placeholder-user.jpg"}
                        alt={artist.artistName}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="flex flex-col items-start">
                    <a className="font-medium leading-tight hover:text-foreground-accent hover:cursor-pointer" href={`/artist/${artist.id}`}>{artist.artistName}</a>
                    <p className="text-sm text-gray-500">1k monthly listeners</p>
                </div>
            </div>

            <button className="text-sm font-medium bg-primary text-black px-4 py-1 rounded-full hover:bg-primary-accent transition">
                + Follow
            </button>
        </div>
    );
}
