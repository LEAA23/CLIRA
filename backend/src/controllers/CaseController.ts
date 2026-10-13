import { Request, Response } from "express"

export class CaseController {

    static createCase = ( req : Request, res: Response ) => {
        //Obtenemos los archivos subidos por el usuario, tanto la imagen como el modelo 3D
        const files = req.files as {
            [fieldname: string] : Express.Multer.File[]
        }
        const { title, description } = req.body;

        try {
            console.log(files)
            console.log(title)
            console.log(description)
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}