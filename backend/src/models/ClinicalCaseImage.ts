import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export class ClinicalCaseImage extends Model< InferAttributes<ClinicalCaseImage>, InferCreationAttributes<ClinicalCaseImage> > {
    declare id: CreationOptional<number>;
    declare path: string;
    declare case_id: number;
}

ClinicalCaseImage.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
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
    modelName: "ClinicalCaseImage"
});