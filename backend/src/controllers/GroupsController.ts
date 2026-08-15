import { Request, Response } from "express";
import { Group } from "../models/Group";

export class GroupsControlller {
    static createGroup = async (req: Request, res: Response) => {
        //Extraemos el nombre del grupo que escribio el usuario
        const {name, bgImage} = req.body;
        try {
            //Creamos y guardamos el grupo con los datos en la base de datos
            const group = await Group.create({
                name,
                bgImage,
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

            //Econtramos todos los grupos que pertencen al maetsro mediante el id del mismo
            const groups = await Group.findAll( { where: { teacher} } );
            return res.status(200).json({ groups });
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateGroup = async( req: Request, res: Response ) => {
        const { name, bgImage } = req.body;

        try {
            const groupExists = req.group;

            //El grupo existe y ademas lo esta modificando el usuario con permisos
            groupExists.name = name;
            groupExists.bgImage = bgImage;

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

            //El usuario tiene permisos y el grupo si existe
            await groupExists.destroy();
            return res.status(200).send("Grupo eliminado correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}