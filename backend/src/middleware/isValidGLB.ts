
import { Request, Response, NextFunction } from "express";

export const isValidGLB = ( req: Request, res: Response, next: NextFunction ) => {
    const files = req.files as | { [fieldname: string]: Express.Multer.File[] } | undefined;
    console.log(files)

    const patientModel = files?.patientModel?.[0];

    // Si no se adjuntó un modelo, continuar
    if (!patientModel) {
        return next();
    }

    // Validar la extensión
    const extension = patientModel.originalname
        .split(".")
        .pop()
        ?.toLowerCase();

    if (extension !== "glb") {
        return res.status(400).send(
            "Solamente se permiten archivos .glb"
        );
    }

    // Validar el tamaño mínimo de la cabecera
    if (!patientModel.buffer || patientModel.buffer.length < 12) {
        return res.status(400).send("Archivo GLB no válido");
    }

    // Validar la firma binaria
    const signature = patientModel.buffer.toString("ascii", 0, 4);

    if (signature !== "glTF") {
        return res.status(400).send(
            "El contenido del archivo no corresponde a un GLB válido"
        );
    }

    // Validar versión GLB 2
    const version = patientModel.buffer.readUInt32LE(4);

    if (version !== 2) {
        return res.status(400).send(
            "El modelo debe utilizar el formato GLB versión 2"
        );
    }

    // Validar longitud declarada
    const declaredLength = patientModel.buffer.readUInt32LE(8);

    if (declaredLength !== patientModel.buffer.length) {
        return res.status(400).send(
            "El tamaño declarado del archivo GLB no coincide"
        );
    }

    next();
};
