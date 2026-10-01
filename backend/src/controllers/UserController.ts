import { Request, Response } from "express";
import { User } from "../models/User";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class UserController {

    static getUser = async( req: Request, res: Response ) => {
        const { email } = req.query;
        try {
            const userExists = await User.findOne({ 
                where: { email: String(email) },
                attributes: ["id", "name", "lastName", "email" , "rol", "confirm", "profileImage"]
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

    static getUserById = async( req: Request, res: Response ) => {
        const { id } = req.params;
        try {
            const userExists = await User.findOne({
                where: { id, confirm: true },
                attributes: [ "id", "name", "lastName", "email" , "rol", "profileImage" ]
            });
            if( !userExists ) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(404).json( { error: error.message } );
            }

            //Obtenemos la imagen de perfil del usuario del Bucket de AWS
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: userExists.profileImage
            });
            //Creamos la URL de forma segura para que nadie pueda acceder al bucket de AWS
            const url = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 * 24 } );
            userExists.profileImage = url;

            return res.status(200).json( { user: userExists } );
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateProfileImage = async( req: Request, res: Response ) => {
        const image = req.file;

        try {
            const userExists = await User.findOne({
                where: { id : req.user.id, confirm: true }
            });
            if( !userExists  || !userExists?.confirm ) {
                const error = new Error("El usuario no existe o accion no permitida");
                return res.status(404).json( { error: error.message } );
            }

            //Si el usuario subio una imagen de perfile entonces realizamos lo siguiente
            if(image) {
                //Comprimimos la imagen subida por el usuario
                const compresedImage = await compressImage( image!.buffer );

                //Creamos un allave unica para esa imagen de perfil y la almacenamos en la carpeta de users
                const key = `users/${ Date.now() }-${ image.originalname.split(".")[0] }.webp`;

                //Ejecutamos el comando de send() y guardamos la imagen del usuario en el Bucket de AWS 
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compresedImage,
                        ContentType: "image/webp"
                    })
                );

                //Si el usuario no tiene una imagen previa, entonces vamos a asignarle la imagen que acaba de enviar el usuario
                if( userExists.profileImage === null ) {
                    //Actualizamos el campo de profileImage del usuario en la BD
                    userExists.profileImage = key;
                    await userExists.save();
                    return res.status(200).send("Imagen subida correctamente");
                }

                //El usuario subio una imagen y ademas ya tiene una imagen de perfil previa
                const oldKey = userExists.profileImage;
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: oldKey
                    })
                );

                //Actualizamos el campo de profileImage del usuario en la BD
                userExists.profileImage = key;
                await userExists.save();
                return res.status(200).send("Imagen actualizada correctamente")
            }

            return res.status(400).send("Selecciona una imagen");


        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteProfileImage = async( req: Request, res: Response ) => {
        try {
            const userExists = await User.findOne({
                where: { id : req.user.id, confirm: true }
            });
            if( !userExists  || !userExists?.confirm ) {
                const error = new Error("El usuario no existe o accion no permitida");
                return res.status(404).json( { error: error.message } );
            }

            //Eliminamos la imagen almacenada en el Bucket de AWS
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: userExists.profileImage
                })
            );

            //Eliminamos la referencia a la imagen de la base de datos
            userExists.profileImage = "";
            await userExists.save();
            return res.status(200).send("Imagen eliminada correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}