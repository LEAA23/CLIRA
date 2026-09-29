import { Request, Response } from "express";
import { User } from "../models/User";

export class UserController {

    static getUser = async( req: Request, res: Response ) => {
        const { id } = req.params;
        try {
            const userExists = await User.findOne({ 
                where: { id: String(id) },
                attributes: ["id", "name", "lastName", "email" , "rol", "confirm", "email", "profileImage"]
            });

            if( !userExists || !userExists.confirm ) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(404).json( { error: error.message } );
            }

            const { confirm, ...user } = userExists.toJSON();
            return res.status(200).json( { user } );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}