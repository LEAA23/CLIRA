import { Request, Response } from "express"
import { Case } from "../models/Case";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { CasesFilters } from "../models/CasesFilters";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Filters } from "../models/Filters";

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

            const filters : number[] = JSON.parse( req.body.filters )

            //Si el usuario mando una imagen del caso entonces la guardamos en el bucket de AWS
            if( files.previewImage ) {
                const compressedImage = await compressImage( files.previewImage[0].buffer );
                const key = `cases/images/${ Date.now() }-${ files.previewImage[0].originalname.split(".")[0] }.webp`;

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
            if( files.simulationModel ) {
                const key = `cases/models/${ Date.now() }-${ files.simulationModel[0].originalname }`;

                //Ejecutamos un comando para guardar la imagen en el bucket de AWS
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: files.simulationModel[0].buffer,
                        ContentType: "model/gltf-binary"
                    })
                );

                //guardamos la referencia al modelo en la instancia de la base de datos
                clinicalCase.simulationModel = key;
            }

            await clinicalCase.save(), 
                
            filters.forEach( async(filter) => 
                await CasesFilters.create({ case_id: clinicalCase.id, filter_id: filter }) 
            )
            
            return res.status(200).send( "El caso se creo correctamente" );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
    
    static getCases = async( req: Request, res: Response ) => {
        try {
            const cases = await Case.findAll({
                include: [ { model: Filters, as: "filters", attributes: [ "id", "name", "category_id" ], through: { attributes: [] } } ]
            });

            await Promise.all(
                cases.map(async (clinicalCase) => {

                    if(clinicalCase.previewImage === null) return;

                    const command = new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.previewImage
                    });

                    const key = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 * 24 } );
                    clinicalCase.previewImage = key;
                    
                    
                })
            )
            return res.status(200).json( { cases } );
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}