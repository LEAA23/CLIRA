import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";


//Accedemos a la interaz de Request para reescribir dentro de ella los datos del usuario autenticado y asi poder tener acceso a ellos
//en los controladores
declare global {
    namespace Express {
        interface Request {
            user: User["dataValues"]
        }
    }
}

const authenticate = async ( req: Request, res: Response, next: NextFunction ) => {
    //Obtenemos el token que mandamos en cada peticion en los headers mediate el interceptor de nuestro cliente de axios
    const bearer = req.headers.authorization;

    //Si no existe un token al enviar una peticion entonces respondemos con un error
    if(!bearer) {
        const error = new Error("No Autorizado");
        return res.status(401).json( {error: error.message} );
    }

    //Separamos el token para quedarnos solo con el puro token
    const token = bearer.split(" ")[1];

    try {
        //decodificamos el token medinate .verity() pasamos el token y la private key con la que firmamos el token
        const decodedData = jwt.verify(token, String (process.env.JWT_PRIVATEKEY) );

        //Verificamos que la infromacion decodificada tenga la estructura planteada
        if( typeof decodedData === "object" && decodedData.id ) {
            //Buscamos al usuario en la DB y extrameos los attributos necesarios
            const user = await User.findOne( { 
                where: { id : decodedData.id }, 
                attributes : ["id", "name", "email"]
            } );

            //Verificamos is el usuario exite en la BD
            if(user) {
                //Si existe reescribimos la interaz de req con la instancia del user para poder tener acceso en los controladores
                req.user = user.dataValues
            } else {
                return res.status(500).json({ error: "Token no valido" })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Token no valido" })
    }

    //Pasamos el control al siguiente middleware
    next();
}

export default authenticate;