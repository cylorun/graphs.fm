import {Router} from "express";
import {optionalAuth, requireAuth} from "../../middleware";
import {
    createComment,
    editComment,
    fetchComments, getLikesForComment,
    removeComment,
    toggleCommentLike
} from "../../controllers/api/commentApiController";

const router = Router();


/**
 * Create comment
 *
 * Body: {
    postId,
    postType: "track" | "album" | "artist",
    content
 * }
 */
router.post('/', requireAuth, createComment);

router.post('/:commentId/like', requireAuth, toggleCommentLike);

/**
 * Query: { postId, postType: "track" | "album" | "artist" }
 */
router.get('/', optionalAuth, fetchComments);

router.get('/:commentId', getLikesForComment);

router.patch('/:commentId', requireAuth, editComment);

router.delete('/:commentId', requireAuth, removeComment);



export default router;