import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

//Creamos el modelo de User el cual va a crear la tabla si no existe.
export class User extends Model< InferAttributes<User>, InferCreationAttributes<User> > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare lastName: string;
    declare rol: string;
    declare phoneNumber: string;
    declare email: string;
    declare password: string;
    declare token: string | null;
    declare tokenExpiresAt: Date | null;
    declare confirm: boolean;
}

//Definimos el tipo de los atributos asi como sus caracteristicas especiales
User.init( 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        rol: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },    
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tokenExpiresAt: {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true
        },
        confirm: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "User"
    }
);