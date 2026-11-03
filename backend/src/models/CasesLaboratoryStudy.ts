import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class CasesLaboratoryStudy extends Model< InferAttributes<CasesLaboratoryStudy>, InferCreationAttributes<CasesLaboratoryStudy> > {
    declare id: CreationOptional<number>;
    declare case_id: number;
    declare laboratoryStudy_id: number;
    declare value: number;
}

CasesLaboratoryStudy.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    case_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "Cases",
            key: "id"
        }
    },
    laboratoryStudy_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "LaboratoryStudy",
            key: "id"
        }
    },
    value: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: db,
    modelName: "CasesLaboratoryStudy",
    tableName: "CasesLaboratoryStudies"
});