import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class Filters extends Model< InferAttributes<Filters>, InferCreationAttributes<Filters> > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare category_id: number;
}

Filters.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            key: "id",
            model: "FilterCategories"
        }
    }
}, {
    sequelize: db,
    modelName: "Filter"
});