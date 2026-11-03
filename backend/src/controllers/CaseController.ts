import { Request, Response } from "express"
import { Case } from "../models/Case";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { CasesFilters } from "../models/CasesFilters";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Filters } from "../models/Filters";
import { CaseCompletion } from "../models/CaseCompletion";
import FilterCategories from "../models/FilterCategories";
import { User } from "../models/User";
import "../models/associations";
import { CaseRecord } from "../models/CaseRecord";
import { CaseEmbedding } from "../models/CaseEmbedding";
import axios from "axios";
import { formatEmbedding } from "../utils/formatEmbedding";
import db from "../config/db";
import { QueryTypes } from "sequelize";
import { LaboratoryStudy } from "../models/LaboratoryStudy";
import { CasesLaboratoryStudy } from "../models/CasesLaboratoryStudy";

export class CaseController {

    static createCase = async( req : Request, res: Response ) => {
        //Obtenemos los archivos subidos por el usuario, tanto la imagen como el modelo 3D
        const files = req.files as {
            [fieldname: string] : Express.Multer.File[]
        }
        const { title, description, height, weight, bloodPreassure } = req.body;

        try {
            const clinicalCase = Case.build({
                title,
                description,
                previewImage: "",
                simulationModel: "",
                height,
                weight,
                bloodPreassure,
                diagnosis: "",
                teacher_id: req.user.id,
                completed: false
            });

            
            const filters : number[] = JSON.parse( req.body.filters );

            type LaboratoryStudy = {
                id: number;
                value: number;
            };
            const laboratoryStudies : LaboratoryStudy[] = JSON.parse( req.body.laboratoryStudies );

            type CaseFeature = {
                type: string;
                content: string;
            };
            const symptomsAndHistory : CaseFeature[] = JSON.parse( req.body.symptomsAndHistory );

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
                            
            // Guardamos los filtros asociados al caso
            await Promise.all(
                filters.map(filter =>
                    CasesFilters.create({
                        case_id: clinicalCase.id,
                        filter_id: filter
                    })
                )
            );

            // Procesamos los sintomas y antecedentes
            for (const feature of symptomsAndHistory) {

                // Creamos el registro clínico
                const record = await CaseRecord.create({
                    type: feature.type,
                    content: feature.content.trim(),
                    patient_id: clinicalCase.id
                });

                // Solicitamos a Python la generación del embedding
                const response = await axios.post(`${process.env.AI_SERVICE_URL}/embeddings/generate`,{
                    text: feature.content
                });

                const embedding = response.data.embedding;

                // Validamos que el vector tenga las dimensiones esperadas
                if (!Array.isArray(embedding) || embedding.length !== 384) {
                    throw new Error("El embedding generado no tiene 384 dimensiones");
                }

                // Guardamos el embedding relacionado con el registro clínico
                await CaseEmbedding.create({
                    embedding: formatEmbedding( embedding ) as any,
                    model: "all-MiniLM-L6-v2",
                    case_record_id: record.id
                });
            }

            laboratoryStudies.forEach( async(laboratoryStudy) => {
                //Insertamos en la tabla pivote la informacion
                if(laboratoryStudy.id === 0) return;
                
                await CasesLaboratoryStudy.create({
                    case_id: clinicalCase.id,
                    laboratoryStudy_id: laboratoryStudy.id,
                    value: laboratoryStudy.value
                })
            } );
            
            return res.status(200).send( "El caso se creo correctamente" );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
    
   static getCases = async (req: Request, res: Response) => {
        try {
            const cases = await Case.findAll({
                include: [
                    { model: Filters, as: "filters", attributes: ["id", "name", "category_id"], through: { attributes: [] } },
                    { model: User, as: "creator", attributes: ["id", "name", "lastName", "email"] },
                    { model: CaseRecord, as: "symptomsAndHistory", attributes: ["type", "content"] }
                ]
            });

            const formattedCases = await Promise.all(
                cases.map(async (clinicalCase) => {
                    const caseData = clinicalCase.toJSON();

                    caseData.height = 0;
                    caseData.weight = 0;

                    if (caseData.previewImage !== "") {
                        const command = new GetObjectCommand({
                            Bucket: process.env.AWS_BUCKET,
                            Key: caseData.previewImage
                        });

                        caseData.previewImage = await getSignedUrl(
                            s3Client,
                            command,
                            { expiresIn: 60 * 60 * 24 }
                        );
                    }

                    return caseData;
                })
            );

            return res.status(200).json({ cases: formattedCases });

        } catch (error) {
            console.error("ERROR AL CONSULTAR LOS CASOS:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    };

    static getCase = async( req: Request, res: Response ) => {
        const { caseId } = req.params;
        try {
            const clinicalCase = await Case.findOne({
                where: { id: caseId },
                include: [ 
                    { model: Filters, as: "filters", attributes: [ "id", "name", "category_id" ], through: { attributes: [] } }, 
                    { model: User, as: "creator", attributes: [ "id", "name", 'lastName', 'email' ] }
                ]
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

            const caseData = clinicalCase.toJSON();
            caseData.symptomsAndHistory = [];
            caseData.height = 0;
            caseData.weight = 0;
            caseData.bloodPreassure = "";

            return res.status(200).json( { clinicalCase: caseData } );
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getLaboratorystudies = async( req: Request, res: Response ) => {
        try {
            const laboratoryStudies = await LaboratoryStudy.findAll({});
            return res.status(200).json({ laboratoryStudies })
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getPatientLaboratoryStudies = async (req: Request, res: Response) => {
        const { laboratoryStudies } = req.body;

        try {
            const laboratoryResults = await Promise.all(
                laboratoryStudies.map(async (labStudyId: number) => {
                    const labResult = await CasesLaboratoryStudy.findOne({
                        where: {
                            case_id: req.clinicalCase.id,
                            laboratoryStudy_id: labStudyId
                        },
                        attributes: ["value"]
                    });

                    return {
                        id: labStudyId,
                        value: labResult ? Number(labResult.value) : null
                    };
                })
            );

            return res.status(200).json({ laboratoryResults });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    };

    static askQuestion = async( req: Request, res: Response ) => {
        const { question } = req.body;
        const { caseId } = req.params;
        try {
            // Solicitamos a Python la generación del embedding
            const response = await axios.post(`${process.env.AI_SERVICE_URL}/embeddings/generate`,{
                text: question
            });

            const embedding = response.data.embedding;

            // 2. Buscar registros similares del caso seleccionado
            const embeddingString = `[${embedding.join(",")}]`;

            const records = await db.query(
                `
                SELECT
                    cr.id,
                    cr.type,
                    cr.content,
                    ce.embedding <=> $1::vector AS distance
                FROM "CaseRecords" cr
                INNER JOIN "CaseEmbeddings" ce
                    ON ce.case_record_id = cr.id
                WHERE cr.patient_id = $2
                AND ce.embedding <=> $1::vector < 0.80
                ORDER BY distance ASC
                LIMIT 5;
                `,
                {
                    bind: [embeddingString, caseId],
                    type: QueryTypes.SELECT
                }
            );

            //Si no hay coincidencias suficientemente similares respondemos con un mensaje prederetermindo
            if (records.length === 0) {
                return res.status(200).json({
                    success: true,
                    records: [
                        {
                            id: 0,
                            type: "unknow",
                            distance: 1,
                            content: "¿Podrias ser mas especifico?, porfavor."
                        }
                    ]
                });
            }

            return res.status(200).json({
                success: true,
                records
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getCorporalMetrics = async( req: Request, res: Response ) => {
        const { metricsSelected } = req.body;
        try {
            const metricValues = metricsSelected.map( (metric : string) => {
                if( metric === "height" ) {
                    return {
                        type: "height",
                        value: req.clinicalCase.height != null? +req.clinicalCase.height : 0
                    }
                }
                
                if( metric === "weight" ) {
                    return {
                        type: "weight",
                        value: req.clinicalCase.weight != null? +req.clinicalCase.weight : 0
                    }                
                }

                if( metric === "bloodPreassure" ) {
                    return {
                        type: "bloodPreassure",
                        value: req.clinicalCase.bloodPreassure !== null? req.clinicalCase.bloodPreassure: ""
                    }                  
                }

                return;
            });

            return res.status(200).json( { metrics: metricValues } );
        } catch (error) {
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
    static getFilterCategories = async (_req: Request, res: Response) => {
        try {
            const categories = await FilterCategories.findAll({
                attributes: ["id", "name"],
                include: [
                    {
                        model: Filters,
                        as: "filters",
                        attributes: ["id", "name", "category_id"],
                        required: false
                    }
                ],
                order: [["name", "ASC"]]
            });

            return res.status(200).json({ categories });
        } catch (error) {
        console.error("Error al consultar las categorías:", error);

            return res.status(500).json({
                error: "No se pudieron consultar las categorías de filtros"
            });
        }
    }

    static getPublicCases = async (_req: Request, res: Response) => {
        try {
            const cases = await Case.findAll({
                include: [
                    {
                        model: Filters,
                        as: "filters",
                        attributes: ["id", "name", "category_id"],
                        through: { attributes: [] }
                    },
                    {
                        model: CaseRecord,
                        as: "symptomsAndHistory",
                        attributes: ["type", "content"]
                    }
                ],
                order: [["createdAt", "DESC"]]
            });

            await Promise.all(
                cases.map(async (clinicalCase) => {
                    if (!clinicalCase.previewImage) return;

                    const command = new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: clinicalCase.previewImage
                    });

                    const imageUrl = await getSignedUrl(
                        s3Client,
                        command,
                        { expiresIn: 60 * 60 * 24 }
                    );

                    clinicalCase.previewImage = imageUrl;
                })
            );

            return res.status(200).json({ cases });
        } catch (error) {
            console.error("ERROR AL CONSULTAR EL CATÁLOGO PÚBLICO:", error);

            return res.status(500).json({
                error: "No se pudo cargar el catálogo de casos clínicos"
            });
        }
    };
};
