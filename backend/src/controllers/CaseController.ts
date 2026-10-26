import { Request, Response } from "express"
import { Case } from "../models/Case";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { CasesFilters } from "../models/CasesFilters";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Filters } from "../models/Filters";
import { CaseCompletion } from "../models/CaseCompletion";

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
                teacher_id: req.user.id,
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

            await clinicalCase.save();
                
            filters.forEach( async(filter) => 
                await CasesFilters.create({ case_id: clinicalCase.id, filter_id: filter }) 
            )
            
            return res.status(200).send( "El caso se creo correctamente" );
            
        } catch (error) {
            console.log(error)
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

                    if(clinicalCase.previewImage === "") return;

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

    static getCase = async( req: Request, res: Response ) => {
        const { caseId } = req.params;
        try {
            const clinicalCase = await Case.findOne({
                where: { id: caseId },
                include: [ { model: Filters, as: "filters", attributes: [ "id", "name", "category_id" ], through: { attributes: [] } } ]
            });

            if(!clinicalCase) {
                const error = new Error("El caso no existe");
                return res.status(404).json( { error: error.message } );
            }

            if( clinicalCase.simulationModel ) {
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: clinicalCase.simulationModel
                })

                const key = await getSignedUrl( s3Client, command, {  expiresIn: 60 * 60 * 24 } );
                clinicalCase.simulationModel = key;
            }

            return res.status(200).json( { clinicalCase } );
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateCase = async( req: Request, res: Response ) => {
        //Obtenemos los archivos subidos por el usuario, tanto la imagen como el modelo 3D
        const files = req.files as {
            [fieldname: string] : Express.Multer.File[]
        }
        const { title, description, filters } = req.body;

        try {
            //Actualizamos la imagen del caso clinico
            if( files.previewImage ) {
                const oldKey = req.clinicalCase.previewImage;

                //Comprimimos la nueva imagen
                const compresedImage = await compressImage( files.previewImage[0].buffer ); 

                //Creamos una nueva llave unica
                const key = `cases/images/${ Date.now() }-${ files.previewImage[0].originalname.split(".")[0] }.webp`;

                //Guardamos la referencia de la imagen en la base de datos
                req.clinicalCase.previewImage = key;

                //Guardamos la imagen en el bucket de AWS
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compresedImage,
                        ContentType: "image/webp"
                    })
                );

                //Eliminamos la imagen vieja del bucket
                if( oldKey && oldKey !== key ) {
                    await s3Client.send(
                        new DeleteObjectCommand({
                            Bucket: process.env.AWS_BUCKET,
                            Key: oldKey
                        })
                    );

                }

            }

            //Actualizamos el modelo 3d si es que el usuario escogio uno nuevo
            if( files.simulationModel ) {
                const oldKey = req.clinicalCase.simulationModel;
                
                //Creamos una nueva llave para el modelo
                const key = `cases/models/${ Date.now() }-${ files.simulationModel[0].originalname.split(".")[0] }`;

                //Guardamos la neuva referencia al modelo
                req.clinicalCase.simulationModel = key;

                //Guardamos el nuevo modelo 3d en el bucket de aws
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: files.simulationModel[0].buffer,
                        ContentType: "model/gltf-binary"
                    })
                );

                //Eliminamos el antiguo modelo 3d del bucket
                if( oldKey && oldKey !== key ) {
                    await s3Client.send(
                        new DeleteObjectCommand({
                            Bucket: process.env.AWS_BUCKET,
                            Key: oldKey
                        })
                    );
                }   
            }

            //actualizamos los filtros
            const caseFilters = await CasesFilters.findAll({ where: { case_id: req.clinicalCase.id } });
            const newFilters : number[] = JSON.parse( filters );

            // IDs de los filtros que ya tiene el caso
            const currentFilterIds = caseFilters.map( filterObj => filterObj.filter_id);

            // Filtros que debemos eliminar
            const filtersToDelete = currentFilterIds.filter( id => !newFilters.includes(id) );

            // Filtros que debemos agregar
            const filtersToAdd = newFilters.filter( id => !currentFilterIds.includes(id) );
            // Eliminar filtros antiguos
            if (filtersToDelete.length > 0) {
                await CasesFilters.destroy({
                    where: {
                        case_id: req.clinicalCase.id,
                        filter_id: filtersToDelete
                    }
                });
            }

            // Agregar filtros nuevos
            if (filtersToAdd.length > 0) {
                await CasesFilters.bulkCreate(
                    filtersToAdd.map(filterId => ({
                        case_id: req.clinicalCase.id,
                        filter_id: filterId
                    }))
                );
            }

            //Finalmente ctualizamdo el demas contenido del caso
            req.clinicalCase.title = title;
            req.clinicalCase.description = description;
            await req.clinicalCase.save();

            return res.status(200).send("El caso se actualizo correctamente");

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteCaseImage = async( req: Request, res: Response ) => {
        try {
            const clinicalCase = req.clinicalCase;
            //Si el caso tiene una imagen entonces la vamos a eliminar del bucket de aws
            if( clinicalCase.previewImage ) {
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.previewImage
                    })
                );

            }

            //Eliminamos la referencia de la imagen en la base de datos
            clinicalCase.previewImage = "";
            await clinicalCase.save();
            return res.status(200).send( "Imagen del caso eliminada correctamente" )
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteCaseModel = async( req: Request, res: Response ) => {
        try {
            const clinicalCase = req.clinicalCase;

            //Si el caso tiene un modelo 3d entonces lo vamos a elimianr del bucket de aws
            if( clinicalCase.simulationModel ) {
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.simulationModel
                    })
                );
            }

            //Eliminamos la referencia del modelo de la base de datos
            clinicalCase.simulationModel = "";
            await clinicalCase.save();
            return res.status(200).send("Modelo eliminado correctamente");
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteCase = async( req: Request, res: Response ) => {
        try {
            const clinicalCase = req.clinicalCase;

            //Si el caso tiene una imagen entonces la vamos a eliminar del bucket de aws
            if( clinicalCase.previewImage ) {
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.previewImage
                    })
                );
            }

            //Si el caso tiene un modelo entonces lo vamos a eliminar tambien del bucket de AWS
            if( clinicalCase.simulationModel ) {
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.simulationModel
                    })
                );
            }

            //Eliminamos los filtros y el caso de la base de datos
            const filters = await CasesFilters.findAll( { where: { case_id: clinicalCase.id } } );
            await Promise.allSettled([ filters.forEach( filter => filter.destroy() ), clinicalCase.destroy() ]);
            return res.status(200).send("Caso eliminado correctamente");
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
    static completeCase = async (req: Request, res: Response) => {
        const caseId = Number(req.params.caseId);
        const userId = req.user.id;

        if (!Number.isInteger(caseId) || caseId <= 0) {
            return res.status(400).json({
                error: "El ID del caso no es válido"
            });
        }

        try {
            const clinicalCase = await Case.findByPk(caseId);

            if (!clinicalCase) {
                return res.status(404).json({
                    error: "El caso no existe"
                });
            }

            await CaseCompletion.findOrCreate({
                where: {
                    user_id: userId,
                    case_id: caseId
                },
                defaults: {
                    user_id: userId,
                    case_id: caseId,
                    is_correct: null
                }
            });

        const completedCount = await CaseCompletion.count({
            where: { user_id: userId }
        });

        return res.status(200).json({
            message: "Caso registrado como completado",
            completedCount
        });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "No se pudo registrar la finalización del caso"
            });
        }
    };

    static getCompletedCases = async (req: Request, res: Response) => {
        try {
            const completedCount = await CaseCompletion.count({
                where: { user_id: req.user.id }
            });

            return res.status(200).json({ completedCount });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "No se pudieron consultar los casos completados"
            });
        }
    }
};