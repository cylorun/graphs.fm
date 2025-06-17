import { Request, Response } from "express";
import {
    createPostComment,
    getPostComments,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
    getCommentLikes,
    hasUserLikedComment, getUserPostLikes,
} from "@/shared/services/commentService";
import { postTypes } from "@/shared/drizzle/schema";
import { PostType } from "@/shared/types";
import { reportError } from "../../util/exceptions";

function isValidPostType(value: any): value is PostType {
    return postTypes.includes(value);
}

export async function createComment(req: Request, res: Response) {
    try {
        const { postId, postType, content } = req.body;
        if (!postId || !postType || !content) {
            res.status(400).json({ error: "Missing body parameters" });
            return;
        }

        if (!req.user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }
        if (!isValidPostType(postType)) {
            res.status(400).json({error: "Invalid post type"});
            return;
        }

        const comment = await createPostComment(postId, postType, content, req.user.id);
        res.status(201).json(comment);
    } catch (e: any) {
        reportError("Error in createComment", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function fetchComments(req: Request, res: Response) {
    try {
        const { postId, postType } = req.query;
        if (!postId || !postType) {
            res.status(400).json({ error: "Missing body parameters" });
            return;
        }

        if (!isValidPostType(postType)) {
            res.status(400).json({error: "Invalid post type"});
            return;
        }

        const comments = await getPostComments(Number(postId), postType);
        if (comments === null) {
            res.status(404).json({ message: "Post not found." });
            return;
        }

        res.json(comments);
    } catch (e: any) {
        reportError("Error in fetchComments", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function editComment(req: Request, res: Response) {
    try {
        const { content } = req.body;
        const { commentId } = req.params;
        if (!content) {
            res.status(400).json({ error: "Missing body parameters" });
            return;
        }

        if (!req.user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const updated = await updateComment(Number(commentId), req.user.id, content);
        if (!updated) {
            res.status(403).json({error: "Not allowed"});
            return;
        }

        res.json(updated);
    } catch (e: any) {
        reportError("Error in editComment", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function removeComment(req: Request, res: Response) {
    try {
        const { commentId } = req.params;

        if (!req.user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const deleted = await deleteComment(Number(commentId), req.user.id);
        if (!deleted) {
            res.status(403).json({error: "Not allowed"});
            return;
        }

        res.json(deleted);
    } catch (e: any) {
        reportError("Error in removeComment", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function toggleCommentLike(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        if (!commentId) {
            res.status(400).json({ error: "Missing body parameters" });
            return;
        }

        if (!req.user) {
            res.status(401).json({error: "Unauthorized"});
            return;
        }

        const alreadyLiked = await hasUserLikedComment(Number(commentId), req.user.id);
        if (alreadyLiked) {
            await unlikeComment(Number(commentId), req.user.id);
        } else {
            await likeComment(Number(commentId), req.user.id);
        }

        res.json({ liked: !alreadyLiked });
    } catch (e: any) {
        reportError("Error in toggleCommentLike", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getLikesForComment(req: Request, res: Response) {
    try {
        const { commentId } = req.params;
        const count = await getCommentLikes(Number(commentId));
        res.json({ likes: count });
    } catch (e: any) {
        reportError("Error in getLikesForComment", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
