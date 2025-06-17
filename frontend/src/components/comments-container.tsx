import React, {useEffect, useState} from "react";
import {useSession} from "@/context/session-context";
import {DetailedComment, NewComment, PostType} from "@shared/types";
import api from "@/util/api";
import Comment from "@/components/comment";


export type CommentContainerProps = {
    postType: PostType;
    postId: number;
}

export default function CommentsContainer({postType, postId}: CommentContainerProps) {
    const {user} = useSession();
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [comments, setComments] = useState<DetailedComment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments?postId=${postId}&postType=${postType}`);
                setComments(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchComments();
    }, [postId, postType]);


    const onCancelButtonClick = () => {
        setIsInputFocused(false);
        document.getElementById("comment-input")?.blur();
        setInputValue("")
    }

    const onCommentSubmit = async () => {
        if (!user) return;
        onCancelButtonClick();

        const comment: Omit<NewComment, "authorId"> = {
            content: inputValue,
            postId: postId,
            postType: postType,
        }

        try {
            const res = await api.post('/comments', {...comment});
            setComments(prev => [{...res.data, authorName: user.username, authorImageUrl: user.profileImage, totalLikes: 0, postId: res.data.id}, ...prev])
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={'flex flex-col items-start w-full h-fit'}>
            <div className="flex flex-col gap-3 px-2 py-3 bg-muted rounded-md w-[60%] items-start">
                <h2><b>{comments.length} Comments</b></h2>

                <div className={'flex gap-2 w-full'}>
                    <img
                        src={user?.profileImage || "/placeholder-profile.jpg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        id={'comment-input'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={(e) => setIsInputFocused(e.target === document.activeElement)}
                        onKeyDown={(e) => e.key === 'Enter' ? onCommentSubmit() : null}
                        className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400 border-b border-b-foreground-muted focus:border-b-foreground"
                    />
                </div>
                {isInputFocused ? (
                    <div className={'flex justify-end w-full gap-2 text-sm'}>
                        <button onClick={onCancelButtonClick} className={'hover:bg-foreground-muted px-2 py-1 rounded-2xl'}>Cancel</button>
                        <button onClick={onCommentSubmit} className={'bg-primary hover:bg-primary-accent px-2 py-1 rounded-2xl text-md'}>Comment</button>
                    </div>
                ) : null}
            </div>

            <div className={'w-full'}>
                {comments.length ? comments.map((comment, index) => (
                    <Comment comment={comment} key={index} />
                )) : null}
            </div>
        </div>
    )
}