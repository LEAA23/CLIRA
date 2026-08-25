import { Request, Response } from "express";
import { Group } from "../models/Group";
import "../models/associations";
import { User } from "../models/User";
import { s3Client } from "../config/services/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { compressImage } from "../utils/compressImage";
import { UserGroup } from "../models/UserGroup";


export class GroupsControlller {
    static createGroup = async (req: Request, res: Response) => {
        //Extraemos el nombre del grupo que escribio el usuario
        const {name} = req.body;
        const bgImage = req.file;
        try {
            //Comprimimos la imagen con esta funcion
            const compresedImage = await compressImage( bgImage!.buffer );

            //Creamos una llave unica en la carpeta de groups para cada imagen de fondo que suban los usuarios
            const key = `groups/${ Date.now() }-${bgImage!.originalname.split(".")[0]}.webp`;
            
            //Ejecutamos una operacion como cliente mediante el metodo de .send() de AWS
            await s3Client.send(
                //Decimos que queremos ejecutar una instruccion de poner un objeto en el bucket seleccionado, con la llave definida y el contenido de la misma
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: key,
                    Body: compresedImage,
                    ContentType: "image/webp"
                })
            );

            //Creamos y guardamos el grupo con los datos en la base de datos
            const group = await Group.create({
                name,
                bgImage : key,
                teacher: req.user.id
            });

            return res.status(200).send("Grupo creado correctamente");

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    static getGroups = async( req: Request, res: Response ) => {
        try {
            //Extraemos el id del maestro
            const teacher = req.user.id;

            //Econtramos todos los grupos que pertencen al maetsro mediante el id del mismo, ademas mediante la asociacion teahcerUser obtenemos el nombre del maestro
            const groups = await Group.findAll( { 
                where: { teacher }, 
                include: [ { model: User, as: "teacherUser", attributes: ["id", "name"] } ]
            } );
            return res.status(200).json({ groups });
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateGroup = async( req: Request, res: Response ) => {
        const { name } = req.body;
        const bgImage = req.file;
        try {
            const groupExists = req.group;
            //Actualizamos el nombre por el que mando el usuario
            groupExists.name = name;

            //Si el usuario decidio cambiar la imagen entonces realizamos el cambio
            if(bgImage) {
                //Almacenamos la key antigua para eliminar el recurso de AWS
                const oldKey = groupExists.bgImage;

                //Comprimimos la imagen
                const compresedImage = await compressImage( bgImage!.buffer );

                //Creamos una nueva llave unica que identifique a la imagen
                const key = `groups/${ Date.now() }-${bgImage!.originalname.split(".")[0]}.webp`;

                //El grupo existe y ademas lo esta modificando el usuario con permisos
                groupExists.bgImage = key;

                //Guardamos la nueva imagen en AWS mediante nuestro cliente de s3
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compresedImage,
                        ContentType: "image/webp"
                    })
                )

                //Eliminamos la antigua imagen en AWS medinate el comando de DeleteObjectCommand
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: oldKey
                    })
                );
        }

            //Guardamos los cambios en la BD
            await groupExists.save();
            return res.status(200).send("El grupo se modifico correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteGroup = async( req: Request, res: Response ) => {
        try {
            const groupExists = req.group;
            const { bgImage } = groupExists;

            //Eliminanos la imagen almacenada en AWS mediante el cliente s3
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: bgImage
                })
            );

            //El usuario tiene permisos y el grupo si existe
            await groupExists.destroy();
            return res.status(200).send("Grupo eliminado correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getGroup = async( req: Request, res: Response ) => {
        const { groupId } = req.params;

        try {
            //Verificamos si realmente existe un grupo con el id que se esta mandando
            const groupExists = await Group.findOne( { 
                where: { id: groupId },
                include: [ 
                    //Hacemos un join con la tabla de User y nos traemos el id del usuario que en este caso es un teacher
                    { model: User, 
                        as: "teacherUser", 
                        attributes: ["id", "name"]
                    },
                    //Hacemos otro join y nos taremos los miembros de ese grupo 
                    { 
                        model: User, 
                        as: "users", 
                        attributes: ["id", "name", "lastName", "email"], 
                        through: { attributes: [] } 
                    } 
                ]  
            } );
            
            if(!groupExists) {
                const error = new Error("El grupo no existe");
                return res.status(404).json( { error: error.message } );
            }

            //obtener la imagen de fondo desde AWS y reescribir bgImage
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: groupExists!.bgImage
            });
            //Creamos la url para poder acceder a la imagen de forma segura sin exponer el bucket de AWS
            const url = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 *24 } );
            groupExists.bgImage = url;
            
            //FALTA VERIFICAR QUE EL USUARIO QUE ENTRA ESTE EN DICHO GRUPO
            return res.status(200).json( { group: groupExists } );

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static setMembertoGroup = async( req: Request, res: Response ) => {
        const { groupId } = req.params;
        const { email } = req.body;
        try {
            const groupExists = await Group.findOne( { where: { id: groupId } } );
            const user = await User.findOne( { where: { email } } );

            if(!groupExists) {
                const error = new Error("El grupo no existe");
                return res.status(404).json( { error: error.message } );
            }
            //Si el usuario que mando el admin no existe en la base de datos mandamos un error
            if(!user) {
                const error = new Error("El usuario no existe");
                return res.status(404).json( { error: error.message } );
            }
            if(user.id === req.user.id) {
                const error = new Error("Eres el dueño del grupo");
                return res.status(404).json( { error: error.message } );
            }

            //Buscamos si el usuario ya esta registrado en ese grupo.
            const alreadyExists = await UserGroup.findOne( { where: { user_id: user.id, group_id: groupId }  } );
            if(alreadyExists) {
                const error = new Error("El usuario ya es miembro del grupo");
                return res.status(409).json( { error: error.message } );
            }

            //Si el usuario no existe en ese grupo entonces lo agregamos
            await UserGroup.create({
                user_id: user.id,
                group_id: Number( groupId )
            });
            return res.status(200).send("El usuario fue agregado correctamente");

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getGroupMembers = async( req: Request, res: Response ) => {
        const { groupId } = req.params;
        try {

            const groupExists = await Group.findOne( { where: { id: groupId } } );

            if(!groupExists) {
                const error = new Error("El grupo no existe");
                return res.status(404).json( { error: error.message } );
            }

            
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}