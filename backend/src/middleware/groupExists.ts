import { Request, Response, NextFunction } from "express";
import { Group } from "../models/Group";

declare global {
    namespace Express {
        interface Request {
            group: Group
        }
    }
}

export const groupExists = async( req: Request, res: Response, next: NextFunction ) => {
    const { groupId } = req.params;

    const groupExists = await Group.findOne( { where: { id: groupId } } );

    if( !groupExists ) {
        const error = new Error("El grupo no existe");
        return res.status(404).json( { error: error.message } );
    }
    
    req.group = groupExists;

    next();

}