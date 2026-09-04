import { Request, Response, NextFunction } from "express"
import { UserGroup } from "../models/UserGroup";

export const isGroupMember = async( req: Request, res: Response, next: NextFunction ) => {
    const { groupId } = req.params;

    const isMember = await UserGroup.findOne( { where: { user_id: req.user.id, group_id: groupId } } );
    
    if( !isMember && req.user.id !== req.group.teacher ) {
        const error = new Error("El usuario no pertenece al grupo");
        return res.status(403).json( { error: error.message } );
    }

    next();
}