import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";
import {DetailedComment as CommentType} from "@shared/types";
import api from "@/util/api";

export type CommentProps = {
    comment: CommentType;
    initialLikes?: number;
    initiallyLiked?: boolean;
};

export default function Comment({
                                    comment,
                                }: CommentProps) {
    const [likes, setLikes] = useState(comment.totalLikes);
    const [liked, setLiked] = useState(!!comment.likedByYou);

    const toggleLike = async () => {
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));

        try {
            const res = await api.post(`/comments/${comment.id}/like`)
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex gap-3 p-3  w-[25%]">
            <img src={comment.authorImageUrl || "/placeholder-profile.jpg"} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center mb-1 gap-2">
                    <a href={`/user/${comment.authorName}`} className="text-sm font-medium hover:text-foreground-accent">{comment.authorName}</a>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt || 0), {
                            addSuffix: true,
                        })}
                    </span>
                </div>

                <p className="text-sm text-left text-gray-300">{comment.content}</p>
                <button
                    onClick={toggleLike}
                    className={clsx(
                        "mt-2 flex items-center text-sm transition",
                        liked ? "text-blue-600 font-semibold" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {likes > 0 ? likes : "Like"}
                </button>
            </div>
        </div>
    );
}
