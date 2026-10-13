import { Request, Response } from "express"
import { Case } from "../models/Case";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export class CaseController {

    static createCase = async( req : Request, res: Response ) => {
        //Obtenemos los archivos subidos por el usuario, tanto la imagen como el modelo 3D
        const files = req.files as {
            [fieldname: string] : Express.Multer.File[]
        }
        const { title, description } = req.body;

        try {
            const clinicalCase = Case.build({
                title,
                description,
                previewImage: "",
                simulationModel: "",
                diagnosis: "",
                completed: false
            });

            //Si el usuario mando una imagen del caso entonces la guardamos en el bucket de AWS
            if( files.caseImage ) {
                const compressedImage = await compressImage( files.caseImage[0].buffer );
                const key = `cases/images/${ Date.now() }-${ files.caseImage[0].originalname.split(".")[0] }.webp`;

                //Ejecutamos un comando para guardar la imagen en el bucket de AWS
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compressedImage,
                        ContentType: "image/webp"
                    })
                );

                //Guardamos la referencia de la imagen en a base de datos
                clinicalCase.previewImage = key;
            }

            //Si el usuario subio un modelo entonces lo guardamos en el bucket de AWS
            if( files.patientModel ) {
                const key = `cases/models/${ Date.now() }-${ files.patientModel[0].originalname }`;

                //Ejecutamos un comando para guardar la imagen en el bucket de AWS
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: files.patientModel[0].buffer,
                        ContentType: "model/gltf-binary"
                    })
                );

                //guardamos la referencia al modelo en la instancia de la base de datos
                clinicalCase.simulationModel = key;
            }

            await clinicalCase.save();
            return res.status(200).send( "El caso se creo correctamente" );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}