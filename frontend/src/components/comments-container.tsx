import Comment from "@/components/comment";
import React from "react";
import {useSession} from "@/context/session-context";


export default function CommentsContainer() {
    const {user} = useSession();
    const [isInputFocused, setIsInputFocused] = React.useState(false);

    return (
        <div className={'flex flex-col items-start w-full h-96'}>
            <div className="flex flex-col gap-3 px-2 py-3 bg-muted rounded-md w-[60%] items-start">
                <h2><b>2 Comments</b></h2>

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
                        onFocus={(e) => setIsInputFocused(e.target === document.activeElement)}
                        className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400 border-b border-b-foreground-muted focus:border-b-foreground"
                    />
                </div>
                {isInputFocused ? (
                    <div className={'flex justify-end w-full gap-2 text-sm'}>
                        <button onClick={() => {
                            setIsInputFocused(false);
                            document.getElementById("comment-input")?.blur();
                        }} className={'hover:bg-foreground-muted px-2 py-1 rounded-2xl'}>Cancel</button>
                        <button className={'bg-primary hover:bg-primary-accent px-2 py-1 rounded-2xl text-md'}>Comment</button>
                    </div>
                ) : null}
            </div>

            <div className={'w-full'}>
                <Comment comment={{
                    id: 1,
                    createdAt: new Date(17000000),
                    content: "What tyhe flipper",
                    authorId: 2,
                    authorName: "Joerge",
                    authorImageUrl: "https://avatars1.githubusercontent.com/u/64?v=4",
                    updatedAt: new Date(17000000)
                }} initialLikes={2} initiallyLiked={false} />
                <Comment comment={{
                    id: 1,
                    createdAt: new Date(1900000000000),
                    content: "Im a timmy travel",
                    authorId: 2,
                    authorName: "Peter File",
                    authorImageUrl: "https://avatars1.githubusercontent.com/u/64?v=1",
                    updatedAt: new Date(1700000000)
                }} initialLikes={2} initiallyLiked={false} />
            </div>
        </div>
    )
}