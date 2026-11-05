import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export class LaboratoryStudy extends Model< InferAttributes<LaboratoryStudy>, InferCreationAttributes<LaboratoryStudy> > {
    declare id: CreationOptional<number>;
    declare name: string;
}

LaboratoryStudy.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "LaboratoryStudy",
    tableName: "LaboratoryStudies"
});