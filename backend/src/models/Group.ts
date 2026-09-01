import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";
import { User } from "./User";

//Creamos el modelo de Group el cual va a tener la estructura de la tabla en la base de datos
export class Group extends Model< InferAttributes<Group>, InferCreationAttributes<Group> > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare bgImage: string;
    declare teacher: number;
    declare users? : User[];
}

//Definimos las caracteristicas especiales de cada tributo
Group.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bgImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teacher: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "Group"
});