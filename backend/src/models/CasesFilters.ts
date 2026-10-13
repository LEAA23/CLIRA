import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class CasesFilters extends Model< InferAttributes<CasesFilters>, InferCreationAttributes<CasesFilters> > {
    declare id: CreationOptional<number>;
    declare case_id: number;
    declare filter_id: number;
}

CasesFilters.init({
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
    filter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: "Filters",
            key: "id"
        }
    }
}, {
    sequelize: db,
    modelName: "CaseFilter"
})