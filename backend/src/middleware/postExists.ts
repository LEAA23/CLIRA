import { Request, Response, NextFunction } from "express"
import { Post } from "../models/Post";

declare global {
    namespace Express {
        interface Request {
            post: Post
        }
    }
}

export const postExists = async( req: Request, res: Response, next: NextFunction ) => {
    const { groupId, postId } = req.params;

    const postExists = await Post.findOne({
        where: { id: postId, group_id: groupId }
    });

    if( !postExists ) {
        const error = new Error("La publicacion no esta disponible");
        return res.status( 404 ).json( { error: error.message } );
    }

    req.post = postExists;
    next();

}