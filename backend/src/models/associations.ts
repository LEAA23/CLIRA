import { Group } from "./Group";
import { User } from "./User";
import { UserGroup } from "./UserGroup";

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