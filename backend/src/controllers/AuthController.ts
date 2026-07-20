import { Request, Response } from "express"
import { User } from "../models/User";
import { checkPassword, cleanTokenFields, confirmUser, hashPassword, saveNewPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {

    static createAccount = async ( req: Request, res: Response ) => {
        const { email, name } = req.body;
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

            //Generamos un token para poder confirmar el correo del usuario y fijamos un tiempo para que el token expire
            const { token, tokenExpiresDate } = generateToken();
            user.token = token
            user.tokenExpiresAt = tokenExpiresDate;

            //Mandamos un email con las instrucciones para poder autenticar al usaurio
            await AuthEmail.sendConfirmationEmail({
                email,
                name,
                token: user.token
            });
            
            //Guardamos el usuario en la base de datos
            await user.save();
            res.send("Usuario creado correctamente, revisa tu e-mail");

        } catch (error) {
            return res.status(500).json({error: "Error interno del servidor"});
        }
    }

    static confirmAccount = async ( req: Request, res: Response ) => {
        //Extraemos el token que ha mandado el usuario
        const { token } = req.body;
        try {
            //Consultamos si existe en la base de datos un usuario con el token que ha enviado el usuario
            const user = await User.findOne( { where: { token } } );

            //Si existe un usuario entonces validamos si el token es valido aun
            if(user) {
                const tokenExpiresAt = user.tokenExpiresAt;

                //Si no existe un token o ya expiro entonces limpiamos el campo de token, la fecha de expiracion y guardamos en la bd
                if( !tokenExpiresAt || tokenExpiresAt < new Date() ) {
                    // user.token = null;
                    // user.tokenExpiresAt = null;
                    // await user.save();
                    await cleanTokenFields( user );

                    const error = new Error("El token ha expirado");
                    return res.status(400).json( { error: error.message } );
                }

                //Si existe, entonces limpiamos ambos campos y confirmamos la cuenta del usuario y guardamos en la bd
                // user.token = null;
                // user.tokenExpiresAt = null;
                // user.confirm = true;
                // await user.save();
                await confirmUser( user );
                return res.send("El usuario ha sido confirmado correctamente");
                
            }

            //El usuario con ese token no ha sido encontrado o ya expiro
            return res.status(400).json( { error: "El token invalido o ha expirado" } );
            
        } catch (error) {
            res.status(500).json({error: "Error interno del servidor"});
        }
    }

    static login = async ( req: Request, res: Response ) => {
        const { email, password } = req.body;

        try {
            const userExists = await User.findOne( { where: { email } } );

            //Combrobamos si el usuario existe en la base de datos
            if(!userExists) {
                const error = new Error("El usuario no existe");
                return res.status(409).json( { error : error.message } );
            }

            //Si existe entonces verificamos si su cuenta ya ha sido confirmada
            if(!userExists.confirm) {

                //Mandamos instrucciones si el usuario no esta confirmado
                const { token, tokenExpiresDate } = generateToken();
                userExists.token = token;
                userExists.tokenExpiresAt = tokenExpiresDate;
                await userExists.save();

                //Mandamos un email con las instrucciones para poder autenticar al usaurio
                await AuthEmail.sendConfirmationEmail({
                    email : userExists.email,
                    name : userExists.name,
                    token: userExists.token
                });

                const error = new Error("El usuario no esta confirmado aun, se ha enviado un correo con instrucciones");
                return res.status(409).json( { error : error.message } );
            }

            //Si el usuario existe en la bd y esta confirmado entonces validamos si el password es correcto
            const isPasswordCorrect = await checkPassword( password, userExists.password );
            if(!isPasswordCorrect) {
                const error = new Error("La contraseña no es correcta");
                return res.status(409).json( { error: error.message } );
            }

            //Generear un token de autenticacion con JWT
        } catch (error) {
            res.status(500).json({error: "Error interno del servidor"});
        }

    }

    static forgotPassword = async ( req: Request, res: Response ) => {
        const { email } = req.body;

        try {
            const userExists = await User.findOne( { where: { email } } );

            if(!userExists) {
                const error = new Error("El usuario no existe");
                return res.status(409).json( { error: error.message } );
            }

            //Si existe el usuario entonces generamos un token y lo almacenamos en la bd
            const { token, tokenExpiresDate } = generateToken();
            userExists.token = token;
            userExists.tokenExpiresAt = tokenExpiresDate;
            userExists.save();

            //Mandamos el email con el token para que el usuario pueda reestablecer su acceso
            await AuthEmail.sendResetPasswordEmail({
                email: userExists.email,
                name: userExists.name,
                token: userExists.token
            });
            return res.status(200).send("Se ha enviado un token de recuperacion a tu e-mail");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updatePassword = async( req: Request, res: Response ) => {
        const { token } = req.params;
        const { password } = req.body;

        try {
            //Verificamos si existe un usuario con el token enviado via params que haya hecho una solicitud para actualizar su password
            const isUserExistsWithToken = await User.findOne( { where: { token } } );

            if( !isUserExistsWithToken ||  isUserExistsWithToken.tokenExpiresAt! < new Date() ) {
                const error = new Error("El token no es valido");
                return res.status(409).json( { error: error.message } );
            }

            //Si el token existe entonces reescribimos el password con el valor enviado y lo guardamos en la bd
            // isUserExistsWithToken.password = await hashPassword( password );
            // isUserExistsWithToken.token = null;
            // isUserExistsWithToken.tokenExpiresAt = null;
            // await isUserExistsWithToken.save();
            await saveNewPassword( isUserExistsWithToken, password );
            
            res.send("La contraseña ha sido actualizada correctamente");
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}