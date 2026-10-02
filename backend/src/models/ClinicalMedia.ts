import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class ClinicalMedia extends Model< InferAttributes<ClinicalMedia>, InferCreationAttributes<ClinicalMedia> > {
    declare id: CreationOptional<number>;
    declare path: string;
    declare case_id: number;
}


ClinicalMedia.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    case_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Cases",
            key: "id"
        },
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "ClinicalMedia"
});