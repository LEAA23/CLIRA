import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export default class FilterCategories extends Model< InferAttributes<FilterCategories>, InferCreationAttributes<FilterCategories> > {
    declare id: CreationOptional<number>;
    declare name: string;
}

FilterCategories.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize: db,
    modelName: "FilterCategorie"
})