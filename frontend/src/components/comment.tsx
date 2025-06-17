import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";
import {Comment as CommentType} from "@shared/types";

export type CommentProps = {
    comment: CommentType;
    initialLikes?: number;
    initiallyLiked?: boolean;
};

export default function Comment({
                                    comment,
                                    initialLikes = 0,
                                    initiallyLiked = false,
                                }: CommentProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initiallyLiked);

    const toggleLike = () => {
        setLiked((prev) => !prev);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
        // TODO: APIify
    };

    return (
        <div className="flex gap-3 p-3 border-b border-muted">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">User #{comment.authorId}</p>
                    <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.createdAt || 0), {
                addSuffix: true,
            })}
          </span>
                </div>
                <p className="text-sm text-gray-900">{comment.content}</p>
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
