import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import db from "../config/db";

export class Disease extends Model<
    InferAttributes<Disease>,
    InferCreationAttributes<Disease>
> {
    declare id: CreationOptional<number>;
    declare code: string;
    declare name: string;
    declare embedding: number[] | null;
}

Disease.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    embedding: {
        type: "VECTOR(384)" as any,
        allowNull: true
    }
}, {
    sequelize: db,
    modelName: "Disease",
    tableName: "Diseases"
});