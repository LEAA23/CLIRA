import { Request, Response } from "express";
import { User } from "../models/User";
import { compressImage } from "../utils/compressImage";
import { s3Client } from "../config/services/s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Post } from "../models/Post";
import { Like } from "../models/Like";
import { Sequelize } from "sequelize";
import { CaseCompletion } from "../models/CaseCompletion";

export class UserController {

    static getUser = async( req: Request, res: Response ) => {
        const { email } = req.query;
        try {
            const userExists = await User.findOne({ 
                where: { email: String(email) },
                attributes: ["id", "name", "lastName", "email" , "rol", "confirm", "profileImage"]
            });

            if( !userExists || !userExists.confirm ) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(404).json( { error: error.message } );
            }


            //Nos traemos la imagen del usuario si es que tiene
            if ( userExists.profileImage ) {

                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: userExists.profileImage
                });

                const key = await getSignedUrl(
                    s3Client,
                    command,
                    { expiresIn: 60 * 60 * 24 }
                );

                userExists.profileImage = key
            }

            const { confirm, ...user } = userExists.toJSON();
            return res.status(200).json( { user } );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getRanking = async (_req: Request, res: Response) => {
        try {
            // Obtener los estudiantes confirmados, incluida su foto.
            const users = await User.findAll({
                where: {
                    confirm: true,
                    rol: "student"
                },
                attributes: [
                    "id",
                    "name",
                    "lastName",
                    "email",
                    "profileImage"
                ]
            });
            // Contar los casos completados por usuario.
            const completedRows = await CaseCompletion.findAll({
                attributes: [
                    "user_id",
                    [
                        Sequelize.fn("COUNT", Sequelize.col("case_id")),
                        "completedCount"
                    ]
                ],
                group: ["user_id"],
                raw: true
            });
            type CompletedCountRow = {
                user_id: number;
                completedCount: number | string;
            };
            const counts = new Map<number, number>(
                (completedRows as unknown as CompletedCountRow[]).map(
                    (row) => [
                        Number(row.user_id),
                        Number(row.completedCount)
                    ]
                )
            );
            // Asignar 100 puntos por caso completado.
            const ranking = users
                .map((user) => {
                    const completedCount = counts.get(user.id) ?? 0;
                    return {
                        id: user.id,
                        name: user.name,
                        lastName: user.lastName,
                        email: user.email,
                        profileImage: user.profileImage || "",
                        completedCount,
                        points: completedCount * 100
                    };
                })
                .sort(
                    (a, b) =>
                        b.points - a.points ||
                        a.name.localeCompare(b.name) ||
                        a.lastName.localeCompare(b.lastName)
                )
                .map((user, index) => ({
                    ...user,
                    position: index + 1
                }));
            // Convertir la clave de S3 en una URL temporal para mostrar la foto.
            const rankingWithImages = await Promise.all(
                ranking.map(async (entry) => {
                    if (!entry.profileImage) {
                        return {
                            ...entry,
                            profileImage: null
                        };
                    }
                try {
                    const command = new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: entry.profileImage
                    });
                    const imageUrl = await getSignedUrl(
                        s3Client,
                        command,
                        { expiresIn: 60 * 60 }
                    );
                    return {
                        ...entry,
                        profileImage: imageUrl
                    };
                } catch (imageError) {
                    console.error(
                        `No se pudo obtener la foto del usuario ${entry.id}:`,
                        imageError
                    );
                    return {
                        ...entry,
                        profileImage: null
                    };
                }
            })
        );

        return res.status(200).json({
            ranking: rankingWithImages
        });
        } catch (error) {
        console.error("Error al consultar el ranking:", error);

        return res.status(500).json({
            error: "No se pudo consultar el ranking"
        });
        }
    };


    static getUserById = async( req: Request, res: Response ) => {
        const { id } = req.params;
        try {
            const userExists = await User.findOne({
                where: { id, confirm: true },
                attributes: [
                    "id",
                    "name",
                    "lastName",
                    "email",
                    "rol",
                    "profileImage",
                    [
                        Sequelize.fn(
                            "COUNT",
                            Sequelize.fn(
                                "DISTINCT",
                                Sequelize.col("posts.id")
                            )
                        ),
                        "postsCount"
                    ],

                    [
                        Sequelize.fn(
                            "COUNT",
                            Sequelize.fn(
                                "DISTINCT",
                                Sequelize.col("likes.id")
                            )
                        ),
                        "likesCount"
                    ]
                ],
                include: [
                    {
                        model: Post,
                        as: "posts",
                        attributes: [],
                        required: false
                    },
                    {
                        model: Like,
                        as: "likes",
                        attributes: [],
                        required: false
                    }
                ],
                group: ["User.id"]
            });
            
            if( !userExists ) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(404).json( { error: error.message } );
            }
            
            //Comprobamos si el usuario tiene una imagen de perfil para poder generar una URL
            if(userExists.profileImage) {
                //Obtenemos la imagen de perfil del usuario del Bucket de AWS
                const command = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: userExists.profileImage
                });
                //Creamos la URL de forma segura para que nadie pueda acceder al bucket de AWS
                const url = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 * 24 } );
                userExists.profileImage = url;
                
            }

            //Convertimos la cuenta de likes y de posts en numeros
            const user = userExists?.toJSON();
            user!.postsCount = Number( user.postsCount );
            user!.likesCount = Number( user.likesCount );
            
            return res.status(200).json( { user } );
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateProfileImage = async( req: Request, res: Response ) => {
        const image = req.file;

        try {
            const userExists = await User.findOne({
                where: { id : req.user.id, confirm: true }
            });
            if( !userExists ) {
                const error = new Error("El usuario no existe");
                return res.status(404).json( { error: error.message } );
            }

            //Si el usuario subio una imagen de perfile entonces realizamos lo siguiente
            if(image) {
                //Comprimimos la imagen subida por el usuario
                const compresedImage = await compressImage( image!.buffer );

                //Creamos un allave unica para esa imagen de perfil y la almacenamos en la carpeta de users
                const key = `users/${ Date.now() }-${ image.originalname.split(".")[0] }.webp`;

                //Ejecutamos el comando de send() y guardamos la imagen del usuario en el Bucket de AWS 
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compresedImage,
                        ContentType: "image/webp"
                    })
                );

                //Si el usuario no tiene una imagen previa, entonces vamos a asignarle la imagen que acaba de enviar el usuario
                if( !userExists.profileImage ) {
                    //Actualizamos el campo de profileImage del usuario en la BD
                    userExists.profileImage = key;
                    await userExists.save();
                    return res.status(200).send("Imagen subida correctamente");
                }

                //El usuario subio una imagen y ademas ya tiene una imagen de perfil previa
                const oldKey = userExists.profileImage;
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: oldKey
                    })
                );

                //Actualizamos el campo de profileImage del usuario en la BD
                userExists.profileImage = key;
                await userExists.save();
                return res.status(200).send("Imagen actualizada correctamente")
            }

            return res.status(400).send("Selecciona una imagen");

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteProfileImage = async( req: Request, res: Response ) => {
        try {
            const userExists = await User.findOne({
                where: { id : req.user.id, confirm: true }
            });
            if( !userExists ) {
                const error = new Error("El usuario no existe");
                return res.status(404).json( { error: error.message } );
            }

            if( !userExists.profileImage ) {
                const error = new Error("No tienes una imagen de perfil aun");
                return res.status(400).json( { error: error.message } );
            }

            //Eliminamos la imagen almacenada en el Bucket de AWS
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: userExists.profileImage
                })
            );

            //Eliminamos la referencia a la imagen de la base de datos
            userExists.profileImage = "";
            await userExists.save();
            return res.status(200).send("Imagen eliminada correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}