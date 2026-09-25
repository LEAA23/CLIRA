import { Request, Response } from "express";
import { Group } from "../models/Group";
import "../models/associations";
import { User } from "../models/User";
import { s3Client } from "../config/services/s3";
import { Bucket$, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { compressImage } from "../utils/compressImage";
import { UserGroup } from "../models/UserGroup";
import { Post } from "../models/Post";
import { Media } from "../models/Media";
import { Like } from "../models/Like";
import { literal  } from "sequelize";
import { Comment } from "../models/Comment";
import { dateFormater } from "../utils/dateFormater";
import { saveImages } from "../utils/saveImages";


export class GroupsControlller {
    static createGroup = async (req: Request, res: Response) => {
        //Extraemos el nombre del grupo que escribio el usuario
        const {name} = req.body;
        const bgImage = req.file;
        try {
            //Comprimimos la imagen con esta funcion
            const compresedImage = await compressImage( bgImage!.buffer );

            //Creamos una llave unica en la carpeta de groups para cada imagen de fondo que suban los usuarios
            const key = `groups/${ Date.now() }-${bgImage!.originalname.split(".")[0]}.webp`;
            
            //Ejecutamos una operacion como cliente mediante el metodo de .send() de AWS
            await s3Client.send(
                //Decimos que queremos ejecutar una instruccion de poner un objeto en el bucket seleccionado, con la llave definida y el contenido de la misma
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: key,
                    Body: compresedImage,
                    ContentType: "image/webp"
                })
            );

            //Creamos y guardamos el grupo con los datos en la base de datos
            const group = await Group.create({
                name,
                bgImage : key,
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
            const rol = req.user.rol;
            
            if(rol === "teacher") {
                //Econtramos todos los grupos que pertencen al maetsro mediante el id del mismo, ademas mediante la asociacion teahcerUser obtenemos el nombre del maestro
                const groups = await Group.findAll( { 
                    where: { teacher }, 
                    include: [ { model: User, as: "teacherUser", attributes: ["id", "name"] } ]
                } );
                return res.status(200).json({ groups });
            }

            //El rol es de un estudiante, entonces consulatmos los grupos en donde esta dicho estudiante
            const student = await User.findOne({
                where: { id: req.user.id },
                attributes:[],
                include: [ 
                    { model: Group, as: "groups", include: [ { model: User, as: "teacherUser", attributes: ["id", "name"] } ] }
                ]
            }) as (User & { groups: Group[] }) | null;

            return res.status(200).json({ groups: student!.groups  });
            
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateGroup = async( req: Request, res: Response ) => {
        const { name } = req.body;
        const bgImage = req.file;
        try {
            const groupExists = req.group;
            //Actualizamos el nombre por el que mando el usuario
            groupExists.name = name;

            //Si el usuario decidio cambiar la imagen entonces realizamos el cambio
            if(bgImage) {
                //Almacenamos la key antigua para eliminar el recurso de AWS
                const oldKey = groupExists.bgImage;

                //Comprimimos la imagen
                const compresedImage = await compressImage( bgImage!.buffer );

                //Creamos una nueva llave unica que identifique a la imagen
                const key = `groups/${ Date.now() }-${bgImage!.originalname.split(".")[0]}.webp`;

                //El grupo existe y ademas lo esta modificando el usuario con permisos
                groupExists.bgImage = key;

                //Guardamos la nueva imagen en AWS mediante nuestro cliente de s3
                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: key,
                        Body: compresedImage,
                        ContentType: "image/webp"
                    })
                )

                //Eliminamos la antigua imagen en AWS medinate el comando de DeleteObjectCommand
                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: oldKey
                    })
                );
        }

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
            const { bgImage } = groupExists;

            //Eliminanos la imagen almacenada en AWS mediante el cliente s3
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET,
                    Key: bgImage
                })
            );

            //El usuario tiene permisos y el grupo si existe
            await groupExists.destroy();
            return res.status(200).send("Grupo eliminado correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getGroup = async( req: Request, res: Response ) => {
        const { groupId } = req.params;

        try {
            //Verificamos si realmente existe un grupo con el id que se esta mandando
            const groupExists = await Group.findOne( { 
                where: { id: groupId },
                include: [ 
                    //Hacemos un join con la tabla de User y nos traemos el id del usuario que en este caso es un teacher
                    { model: User, 
                        as: "teacherUser", 
                        attributes: ["id", "name"]
                    },
                    //Hacemos otro join y nos taremos los miembros de ese grupo 
                    { 
                        model: User, 
                        as: "users", 
                        attributes: ["id", "name", "lastName", "email"], 
                        through: { attributes: [] } 
                    } 
                ]  
            } );
            
            if(!groupExists) {
                const error = new Error("El grupo no existe");
                return res.status(404).json( { error: error.message } );
            }

            //obtener la imagen de fondo desde AWS y reescribir bgImage
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: groupExists!.bgImage
            });
            //Creamos la url para poder acceder a la imagen de forma segura sin exponer el bucket de AWS
            const url = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 *24 } );
            groupExists.bgImage = url;
            
            //FALTA VERIFICAR QUE EL USUARIO QUE ENTRA ESTE EN DICHO GRUPO
            return res.status(200).json( { group: groupExists } );

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static setMembertoGroup = async( req: Request, res: Response ) => {
        const { groupId } = req.params;
        const { email } = req.body;
        try {
            const groupExists = await Group.findOne( { where: { id: groupId } } );
            const user = await User.findOne( { where: { email } } );

            if(!groupExists) {
                const error = new Error("El grupo no existe");
                return res.status(404).json( { error: error.message } );
            }
            //Si el usuario que mando el admin no existe en la base de datos mandamos un error
            if(!user) {
                const error = new Error("El usuario no existe");
                return res.status(404).json( { error: error.message } );
            }
            if(user.id === req.user.id) {
                const error = new Error("Eres el dueño del grupo");
                return res.status(404).json( { error: error.message } );
            }

            //Buscamos si el usuario ya esta registrado en ese grupo.
            const alreadyExists = await UserGroup.findOne( { where: { user_id: user.id, group_id: groupId }  } );
            if(alreadyExists) {
                const error = new Error("El usuario ya es miembro del grupo");
                return res.status(409).json( { error: error.message } );
            }

            //Si el usuario no existe en ese grupo entonces lo agregamos
            await UserGroup.create({
                user_id: user.id,
                group_id: Number( groupId )
            });
            return res.status(200).send("El usuario fue agregado correctamente");

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static searchMemberInGroup = async( req: Request, res: Response ) => {
        const { groupId } = req.params;
        const { email } = req.query;

        try {
            if( typeof email !== "string" ) {
                const error = new Error("El correo es obligatorio");
                return res.status(400).json( { error: error.message } );
            }  
            
            const group = await Group.findOne({
                where: {id: groupId},
                include: [ {model: User, as: "users", where: {email} ,attributes: ["id", "name", "lastName", "email"]} ]
            });
            const usersInGroup = group?.users;
            const userExistsInGroup = usersInGroup?.find( user => user.email === email );
            if(!userExistsInGroup) {
                const error = new Error("El usuario no es miembro del grupo");
                return res.status(404).json( { error: error.message } );
            }
             
            return res.status(200).json({ user: userExistsInGroup });

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static removeMemberFromGroup = async( req: Request, res: Response ) => {
        const {groupId} = req.params;
        const { email } = req.query;
        try {

            if( typeof email !== "string" ) {
                const error = new Error("El correo es obliatorio");
                return res.status(400).json( { error: error.message } );
            }
            
            const userExists = await User.findOne( { where: { email } } );

            if(!userExists || !userExists.confirm) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(400).json( { error: error.message } );
            }

            const userIsMember = await UserGroup.findOne( { where: { user_id: userExists.id, group_id: groupId } } );
            if(!userIsMember) {
                const error = new Error("El usuario no es miembro de este grupo");
                return res.status(400).json( { error: error.message } );
            }

            await UserGroup.destroy( { where: { user_id: userIsMember.user_id, group_id: userIsMember.group_id } } );
            return res.status(200).send(`${userExists.name} fue eliminado del grupo correctamente`);
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getUser = async( req: Request, res: Response ) => {
        const { email } = req.query;
        try {
            
            if( typeof email !== "string" ) {
                const error = new Error("El correo es obliatorio");
                return res.status(400).json( { error: error.message } );
            }
            
            const userExists = await User.findOne({ 
                where: { email },
                attributes: ["id", "email", "name", "lastName", "confirm"]
            });

            if( !userExists || !userExists.confirm ) {
                const error = new Error("El usuario no existe o no esta confirmado");
                return res.status(404).json( { error: error.message } );
            }

            const { confirm, ...user } = userExists.toJSON();

            return res.status(200).json( { user } );
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static createPost = async( req: Request, res: Response ) => {
        const groupId = +req.params.groupId;
        const { title, content } = req.body;
        const images = req.files as Express.Multer.File[];

        try {
            //Creamos la publicacion con los datos enviados por el usuario
            const post = await Post.create({
                title,
                content,
                group_id: groupId,
                user_id: req.user.id
            });

            //Guardamos las imagenes en el bucket de AWS y las referencias en la BD
            await saveImages( { postId: post.id, images } );
            
            return res.status(200).send("Publicacion realizada correctamente");
            
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getPostImages = async( req: Request, res: Response ) => {
        const { groupId } = req.params;

        try {
            const images = await Media.findAll({
                where: { post_id: req.post.id },
                attributes: [ "id", "path"]
            })

            await Promise.all( 
                images.map( async( image ) => {

                    if( !image.path ) return;

                    const command = new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: image.path
                    });
                    const key = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 * 24 } );
                    image.path = key;
                })
            );

            return res.status(200).json( { images } );
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }

    }

    static getPosts = async( req: Request, res: Response ) => {
        const { groupId } = req.params;

        try {
            const posts = await Post.findAll({ 
                where: { group_id: groupId },

                attributes: {
                    include: [
                        [
                            literal(`CAST(COUNT("likes"."id") AS INTEGER)`),
                            "likesCount"
                        ],
                        [
                            literal(`
                                CASE 
                                    WHEN COUNT(CASE WHEN likes.user_id = ${req.user.id} THEN 1 END) > 0
                                    THEN true
                                    ELSE false
                                END
                            `),
                            "likedByMe"
                        ]
                    ]
                },

                include: [ 
                    { model: User, as: "user", attributes: ["name", "lastName"] },
                    { model: Media, as: "images", attributes: ["id", "path"], limit: 1 },
                    { model: Like, as: "likes", attributes: [] }
                ],
                group: [
                    "Post.id",
                    "user.id"
                ]
            });

            const postsWithImages = await Promise.all( 
                posts.map( async( post ) => {
                    const image = post.images?.[0];

                    if( !image?.path ) return post;

                    const command = new GetObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: image.path
                    });
                    const key = await getSignedUrl( s3Client, command, { expiresIn: 60 * 60 * 24 } );
                    image.path = key;
                    return post;
                })
            );

            return res.status(200).json( { posts : postsWithImages } );
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updatePost = async( req: Request, res: Response ) => {
        const { title, content } = req.body;
        const images = req.files as Express.Multer.File[];

        try {
            //El usuario si es propietario del post, entonces actualizamos la informacion
            req.post.title = title;
            req.post.content = content;

            //Verificamos si el usuario ha decido agregar nuevas imagenes al post
            if( images.length ) {
                //El usuario ha agregado mas imagenes, entonces las guardamos en el bucket de AWS y las referencias en la BD
                await saveImages( { postId: req.post.id, images } );
            }
            await req.post.save();
            
            return res.status(200).send("Publicacion actualizada correctamente");
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deletePost = async( req: Request, res: Response ) => {
        try {
            //Verificamos si el post pertenece al usuario que esta intentando eliminar la imagen
            const [postBelongsToUser, images] = await Promise.all([
                Post.findOne( { where: { id: req.post.id, user_id: req.user.id } } ),
                Media.findAll( { where: { post_id: req.post.id }, attributes: [ "path" ] } )
            ]);

            if( !postBelongsToUser ) {
                const error = new Error("Publicacion no disponible");
                return res.status(404).json( { error: error.message } );
            }

            //Si el post tiene imagenes entonces vamos a borrar cada imagen del post almacenada en el Bucket de AWS
            if( images.length ) {

                await Promise.all([
                    images.forEach( (image) => {
    
                        s3Client.send(
                            new DeleteObjectCommand({
                                Bucket: process.env.AWS_BUCKET,
                                Key: image.path
                            })
                        )
                    })

                ]);
            }

            await postBelongsToUser.destroy();
            return res.status(200).send("Publicacion eliminada correctamente");

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteImage = async( req: Request, res: Response ) => {
        const { imageId } = req.params;

        try {
            //Buscamos si la imagen existe en la base de datos
            const image = await Media.findOne( { where: { id: imageId, post_id: req.post.id } } );
            if( !image ) {
                const error = new Error("Imagen no disponible");
                return res.status(401).json( { error: error.message } );
            }

            //Eliminamos la imagen del bucket de AWS
            await Promise.allSettled([
                s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET,
                        Key: image?.path
                    })
                ),
                image?.destroy()
            ])
            return res.status(200).send("Imagen eliminada correctamente");

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static likePost = async( req: Request, res: Response ) => {

        try {
            const alreadyLiked = await Like.findOne({
                where: { post_id: req.post.id, user_id: req.user.id }
            });

            if(!alreadyLiked) {
                //El usuario no le ha dado aun like a la publicacion
                await Like.create({
                    user_id: req.user.id,
                    post_id: req.post.id
                });
            } else {
                await alreadyLiked.destroy();
            }

            const likesCount = await Like.count({
                where: { post_id: req.post.id }
            });

            const likedByMe = !alreadyLiked;
            return res.status(200).json( { id: req.post.id, likesCount, likedByMe } );

        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static createComment = async( req: Request, res: Response ) => {
        const { content } = req.body;
        try {
            if( content ) {
                await Comment.create({
                    content,
                    post_id: req.post.id,
                    user_id: req.user.id
                });

                return res.status(200).send("Comentario publicado correctamente");    
            }
            return res.status(400).json( { error: "El contenido del comentario es obligatorio" } );
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static getComments = async( req: Request, res: Response ) => {
        try {
            const comments = await Comment.findAll({
                where: { post_id: req.post.id },
                attributes: ["id", "content", "post_id", "createdAt", "updatedAt"],
                include: [ { model: User, as: "user" ,attributes: [ "id", "name", "lastName" ] } ]
            });
            const formatedComments= comments.map(comment => {
                const commentData = comment.toJSON();
                return {
                    ...commentData,
                    createdAt: dateFormater( new Date(commentData.createdAt!) ),
                    updatedAt: dateFormater( new Date( commentData.updatedAt! ) )
                }
            })
            return res.status(200).json( { comments: formatedComments } );
        } catch (error) {
            console.log(error)
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static updateComment = async( req: Request, res: Response ) => {
        const { content } = req.body;
        try {
            if( content ) {
                req.comment.content = content;
                await req.comment.save();
                return res.status(200).send("El comentario se actualizo correctamente");
            }
            return res.status(400).json( { error: "El contenido del comentario es obligatorio" } );

        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }

    static deleteComment = async( req: Request, res: Response ) => {
        try {
            await req.comment.destroy();
            return res.status(200).send("Comentario eliminado correctamente");     
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}