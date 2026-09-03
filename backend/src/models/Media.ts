import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class Media extends Model< InferAttributes<Media>, InferCreationAttributes<Media> > {
    declare id: CreationOptional<number>;
    declare path: string;
    declare post_id: number;
}

Media.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Posts",
            key: "id"
        },
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "Media"
})