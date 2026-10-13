import { Request, Response, NextFunction } from "express"
import { User } from "../models/User"

export const isUserTeacher = async( req: Request, res: Response, next: NextFunction ) => {
    const userIsTeacher = await User.findOne( { where: { id: req.user.id } } );

    if(!userIsTeacher) {
        const error = new Error("Accion no autorizada");
        return res.status(401).json( { error: error.message } );
    }

    next();
}