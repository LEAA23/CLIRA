import { Group } from "./Group";
import { Post } from "./Post";
import { User } from "./User";
import { Media } from "./Media"
import { UserGroup } from "./UserGroup";
import { Like } from "./Like";
import { Comment } from "./Comment";

//LAS ASOCIACIONES EN SEQUELIZE SON LAS RELACIONES ENTRE LAS BASES DE DATOS

//un grupo le pertenece a un solo usuario
Group.belongsTo(User, {
    foreignKey: "teacher",
    as: "teacherUser"
});

//Un usuario puede tener muchos grupos
User.hasMany(Group, {
    foreignKey: "teacher",
    as: "taughtGroups"
});

/**
 * RELACION DE MUCHOS A MUCHOS ( M:N ) ENTRE USUARIOS Y GRUPOS, DE FORMA QUE COMO ES UNA RELACION DE MUCHOS A MUCHOS SE CREA UNA'
 * TABLA PIVOTE CON LOS IDS DE CADA LOG DE USUARIO Y DE GRUPO. 
 */
//Mediante belongsToMany() debemos proporcionar el nombre del modelo con el que esta relacionado N:M, con through especificamos la
//tabla pivote que se creara, debemos hacer lo mismo pero de forma inversa con los modelos para lograr la relacion de N:M
User.belongsToMany(Group, {
    through: UserGroup,
    foreignKey: "user_id",
    otherKey: "group_id",
    as: "groups"
});

Group.belongsToMany(User, {
    through: UserGroup,
    foreignKey: "group_id",
    otherKey: "user_id",
    as: "users"
});

/**
 * Association para obtener todas las imagenes de un post
 */
Post.hasMany(Media, {
    foreignKey: "post_id",
    as: "files"
});

/**
 * Associations para traer los datos de los usuarios en relacion a su post
 */
User.hasMany(Post, {
    foreignKey: "user_id",
    as: "posts"
});

Post.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

/**
 * Association para traer las imagenes de un post
 */
Post.hasMany(Media, {
    foreignKey: "post_id",
    as: "images"
});
Media.belongsTo(Post, {
    foreignKey: "post_id",
    as: "post"
})

/**
 * Association para traer los likes de un post
 */
Post.hasMany(Like, {
    foreignKey: "post_id",
    as: "likes"
});
Like.belongsTo(Post, {
    foreignKey: "post_id",
    as: "post"
});

User.hasMany(Like, {
    foreignKey: "user_id",
    as: "likes"
});
Like.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

//Associations para traer los comentarios de un post
User.hasMany(Comment, {
    foreignKey: "user_id",
    as: "comments"
});
Comment.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Post.hasMany(Comment, {
    foreignKey: "post_id",
    as: "comments"
});
Comment.belongsTo(Post, {
    foreignKey: "post_id",
    as: "post"
});