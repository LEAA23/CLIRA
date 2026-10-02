import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export class Case extends Model< InferAttributes<Case>, InferCreationAttributes<Case> > {
    declare id: CreationOptional<number>;
    declare title: string;
    declare description: string;
    declare previewImage: string;
    declare simulationModel: string;
    declare diagnosis: string;
    declare weight: number;
    declare height: number;
    declare bloodPressure: number;
    declare heartRate: number;
    declare bodyTemperature: number;
    declare oxygenSaturation: number;
    declare bloodGlusose: number;
    declare completed: boolean;
}

Case.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    previewImage: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    simulationModel: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    diagnosis: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false
    },
    weight: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    height: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    bloodPressure: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    heartRate: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    bodyTemperature: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    oxygenSaturation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bloodGlusose: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {
    sequelize: db,
    modelName: "Case"
});