import { Group } from "./Group";
import { Post } from "./Post";
import { User } from "./User";
import { Media } from "./Media"
import { UserGroup } from "./UserGroup";
import { Like } from "./Like";
import { Comment } from "./Comment";
import { Case } from "./Case";
import { Filters } from "./Filters";
import { CasesFilters } from "./CasesFilters";
import FilterCategories from "./FilterCategories";

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
// Post.hasMany(Media, {
//     foreignKey: "post_id",
//     as: "files"
// });

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
    as: "images",
    onDelete: "CASCADE"
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
    as: "likes",
    onDelete: "CASCADE"
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
    as: "comments",
    onDelete: "CASCADE"
});
Comment.belongsTo(Post, {
    foreignKey: "post_id",
    as: "post"
});


/**
 * ASSOCIATIONS PARA LOS FILTROS DE LOS CASOS CLINICOS
 */

//Relaciones de n:m, donde un caso tiene muchos filtros y un filtro esta en muchos casos
Case.belongsToMany(Filters, {
    through: CasesFilters,
    foreignKey: "case_id",
    otherKey: "filter_id",
    as: "filters"
});

Filters.belongsToMany(Case, {
    through: CasesFilters,
    foreignKey: "filter_id",
    otherKey: "case_id",
    as: "Cases"
});

//Relacion de 1:1, donde un filtro pertenece a una categoria y una categoria 
Filters.belongsTo(FilterCategories, {
    foreignKey: "category_id",
    as: "category"
});

FilterCategories.hasMany(Filters, {
    foreignKey: "category_id",
    as: "filters"
});