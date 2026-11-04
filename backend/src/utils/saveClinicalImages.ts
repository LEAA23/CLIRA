import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/services/s3";
import { compressImage } from "./compressImage";
import { ClinicalCaseImage } from "../models/ClinicalCaseImage";


export const saveClinicalImages = async( {caseId, images} : { caseId: number; images: Express.Multer.File[]} ) => {

    //Iteramos sobre cada imagen mandada por el usuario
    images.forEach( async(image) => {
        const compresedImage = await compressImage( image.buffer );
        
        //Creamos una llave unica para cada imagen
        const key = `cases/clinicalCasesImages/${ Date.now() }-${ image!.originalname.split(".")[0] }.webp`;
        
        await Promise.allSettled([
            //Ejecutamos una instruccion con el cliente de S3
            await s3Client.send(
                //Ejecutamos un comando de poner un objeto en el bucket
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: key,
                    Body: compresedImage,
                    ContentType: "image/webp"
                })
            ),
            //Guardamos el arhivo dentro de la tabla de Media
            await ClinicalCaseImage.create({
                path: key,
                case_id: caseId
            })

        ]);
    
    } );
}