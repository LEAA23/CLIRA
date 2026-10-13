import { Request, Response, NextFunction } from "express";

export const isValidGLB = ( req: Request, res: Response, next: NextFunction ) => {
    const files = req.files as {
        [fieldname: string] : Express.Multer.File[]
    }

    //Validar la extension del archivo
    const extension = files.patientModel[0].originalname.split(".").pop()?.toLowerCase();
    if( extension !== "glb" ) {
        return res.status(400).send("Solamente validos archivos .glb");
    }

    //Validar la firma binario del archivo .glb
    if( files.patientModel[0].buffer.length < 12 ) {
        return res.status(400).send("Archivo .glb no valido");
    }

    next();
}