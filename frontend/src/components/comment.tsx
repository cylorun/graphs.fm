import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";
import {DetailedComment as CommentType} from "@shared/types";
import {apiFetch} from "@/hooks/useApi";

export type CommentProps = {
    comment: CommentType;
    loggedIn: boolean;
};

export default function Comment({
                                    comment, loggedIn,
                                }: CommentProps) {
    const [likes, setLikes] = useState(comment.totalLikes);
    const [liked, setLiked] = useState(!!comment.likedByYou);

    const toggleLike = async () => {
        if (!loggedIn) return;
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));

        try {
            const [resData, status] = await apiFetch(`/comments/${comment.id}/like`, {method: "POST"});
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex gap-3 p-3 w-full">
            <img
                src={comment.authorImageUrl || "/placeholder-profile.jpg"}
                className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 break-words">
                <div className="flex md:flex-row flex-col items-start mb-1 md:gap-2">
                    <a href={`/user/${comment.authorName}`} className="text-sm font-medium hover:text-foreground-accent">{comment.authorName}</a>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt || 0), { addSuffix: true })}
                    </span>
                </div>

                <p className="text-sm text-left text-gray-300">{comment.content}</p>

                <button
                    onClick={toggleLike}
                    disabled={!loggedIn}
                    className={clsx(
                        "mt-2 flex items-center text-sm transition",
                        liked ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700",
                        loggedIn ? "" : "hover:!text-gray-500 !cursor-no-drop"
                    )}
                >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {likes > 0 ? likes : "Like"}
                </button>
            </div>
        </div>
    );
}
