import { Request, Response, NextFunction } from "express";
import { Group } from "../models/Group";

declare global {
    namespace Express {
        interface Request {
            group: Group
        }
    }
}


const groupAuthorization = async( req: Request, res: Response, next: NextFunction ) => {
    //Extraemos el id del grupo
    const { groupId } = req.params;

    //Verificamos si realmente existe un grupo con el id que se esta mandando
    const groupExists = await Group.findOne( { where: { id: groupId } } );
    if(!groupExists) {
        const error = new Error("El grupo no existe");
        return res.status(404).json( { error: error.message } );
    }

    //Verificamos que el usuario tenga permisos para mutar el grupo
    if( req.user.id !== groupExists.teacher ) {
        const error = new Error("No tienes permisos para modificar este grupo");
        return res.status(403).json( { error: error.message } );
    }

    //Reescribimos la interfaz de Request con el grupo para tener acceso a el en los controladores
    req.group = groupExists
    next();
}

export default groupAuthorization;