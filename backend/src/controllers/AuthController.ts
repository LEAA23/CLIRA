import { Request, Response } from "express"
import { User } from "../models/User";
import { hashPassword } from "../utils/hashPassword";

export class AuthController {

    static createAccount = async ( req: Request, res: Response ) => {
        const { email } = req.body;
        try {
            //Instanciamos el modelo de Usuario
            const user = User.build(req.body);

            //Verificamos que el usuario no exista ya previamente en la base de datos
            const userExists = await User.findOne( { where: {email} } );
            if(userExists) {
                const error = new Error("Ya existe un usuario con este correo");
                return res.status(409).json( {error : error.message } );
            }

            //Hasheamos el password
            user.password = await hashPassword(req.body.password);

            //Mandamos un email con las instrucciones para poder autenticar al usaurio
            
            
            //Guardamos el usuario en la base de datos
            await user.save();
            

        } catch (error) {
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }
}