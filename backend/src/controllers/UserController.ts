import { Request, Response } from "express";
import { User } from "../models/User";

export class UserController {

     static getUser = async( req: Request, res: Response ) => {
        const { email } = req.query;
        try {
            
            if( typeof email !== "string" ) {
                const error = new Error("El correo es obliatorio");
                return res.status(400).json( { error: error.message } );
            }
            
            const userExists = await User.findOne({ 
                where: { email },
                attributes: ["id", "name", "lastName", "confirm"]
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