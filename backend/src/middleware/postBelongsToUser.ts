import { Request, Response, NextFunction } from "express"
import { Post } from "../models/Post";

declare global {
    namespace Express {
        interface Request {
            post: Post
        }
    }
}

export const postBelongsToUser = async( req: Request, res: Response, next: NextFunction ) => {
    const { groupId, postId } = req.params;

    //Verificamos si el post pertenece al usuario que esta intentando eliminar la imagen
    const postBelongsToUser = await Post.findOne({ where: {
        id: postId, 
        user_id: req.user.id, 
        group_id: groupId
    } });

    if( !postBelongsToUser ) {
        const error = new Error("Publicacion no disponible");
        return res.status(401).json( { error: error.message } );
    }

    req.post = postBelongsToUser;
    next();
}