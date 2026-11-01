import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class CaseEmbedding extends Model< InferAttributes<CaseEmbedding>, InferCreationAttributes<CaseEmbedding> > {
    declare id: CreationOptional<number>;
    declare embedding: number[];
    declare model: string;
    declare case_record_id: number;
}

CaseEmbedding.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    embedding: {
        type: "VECTOR(384)",
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    case_record_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "CaseRecord",
            key: "id"
        },
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "CaseEmbedding"
});