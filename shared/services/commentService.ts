import { db } from "../db";
import {comments, commentLikes, users} from "../drizzle/schema";
import {eq, and, count, sql, desc} from "drizzle-orm";
import {Comment, DetailedComment, PostType} from "../types";

export async function createPostComment(postId: number, postType: PostType, content: string, authorId: number) {
    return (
        await db
            .insert(comments)
            .values({ postId, postType, content, authorId })
            .returning()
    )[0] || null;
}
export async function getPostComments(postId: number, postType: PostType, userId?: number): Promise<DetailedComment[]> {
    const rows = await db
        .select({
            id: comments.id,
            content: comments.content,
            postType: comments.postType,
            postId: comments.postId,
            totalLikes: sql<number>`COUNT(${commentLikes.userId})`.as('totalLikes'),
            likedByYou: userId
                ? sql<number>`SUM(CASE WHEN ${commentLikes.userId} = ${userId} THEN 1 ELSE 0 END)`.as('likedByYou')
                : sql<number>`0`.as('likedByYou'),
            authorId: comments.authorId,
            authorName: users.username,
            authorImageUrl: users.profileImage,
            createdAt: comments.createdAt,
            updatedAt: comments.updatedAt,
        })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .leftJoin(commentLikes, eq(comments.id, commentLikes.commentId))
        .where(and(eq(comments.postId, postId), eq(comments.postType, postType)))
        .groupBy(comments.id, users.id)
        .orderBy(desc(comments.createdAt));

    return rows.map(row => ({
        ...row,
        totalLikes: Number(row.totalLikes),
    }));
}

export async function updateComment(commentId: number, authorId: number, content: string) {
    const result = await db
        .update(comments)
        .set({ content, updatedAt: new Date() })
        .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)))
        .returning();

    return result[0] || null;
}

export async function deleteComment(commentId: number, authorId: number) {
    const result = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)))
        .returning();

    return result[0] || null;
}

export async function likeComment(commentId: number, userId: number) {
    await db.insert(commentLikes).values({ commentId, userId }).onConflictDoNothing();
}

export async function unlikeComment(commentId: number, userId: number) {
    await db.delete(commentLikes).where(and(
        eq(commentLikes.commentId, commentId),
        eq(commentLikes.userId, userId)
    ));
}

export async function getCommentLikes(commentId: number) {
    const result = await db
        .select({ count: count() })
        .from(commentLikes)
        .where(eq(commentLikes.commentId, commentId));

    return result[0].count;
}

export async function getUserPostLikes(commentId: number, userId: number) {
    const result = await db
        .select({count: count()})
        .from(commentLikes)
        .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));

    return result[0].count;
}

export async function hasUserLikedComment(commentId: number, userId: number) {
    const result = await db
        .select()
        .from(commentLikes)
        .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)))
        .limit(1);

    return result.length > 0;
}
