import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/Comment";

declare global {
    namespace Express {
        interface Request {
            comment: Comment
        }
    }
}

export const commentBelongsToUser = async( req: Request, res: Response, next: NextFunction ) => {
    const { commentId, postId } = req.params;

    const commentExists = await Comment.findOne( { where: { id: commentId, user_id: req.user.id, post_id: postId } } );

    if( !commentExists ) {
        const error = new Error("Comentario no disponible");
        return res.status(404).json( { error: error.message } );
    }

    req.comment = commentExists;
    next();
}