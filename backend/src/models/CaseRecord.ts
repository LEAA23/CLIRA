import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class CaseRecord extends Model< InferAttributes<CaseRecord>, InferCreationAttributes<CaseRecord> > {
    declare id: CreationOptional<number>;
    declare type: string;
    declare content: string;
    declare patient_id: number;
}

CaseRecord.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Cases",
            key: "id"
        },
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "CaseRecord",
    tableName: "CaseRecord"
});