import { Group } from "./Group";
import { User } from "./User";

//LAS ASOCIACIONES EN SEQUELIZE SON LAS RELACIONES ENTRE LAS BASES DE DATOS

//un grupo le pertenece a un solo usuario
Group.belongsTo(User, {
    foreignKey: "teacher",
    as: "teacherUser"
});

//Un usuario puede tener muchos grupos
User.hasMany(Group, {
    foreignKey: "teacher",
    as: "groups"
});