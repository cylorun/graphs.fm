import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import clsx from "clsx";
import {DetailedComment as CommentType} from "@shared/types";

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
        <div className="flex gap-3 p-3  w-[25%]">
            <img src={comment.authorImageUrl} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center mb-1 gap-2">
                    <p className="text-sm font-medium">{comment.authorName}</p>
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
