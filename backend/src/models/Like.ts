import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class Like extends Model< InferAttributes<Like>, InferCreationAttributes<Like> > {
    declare id: CreationOptional<number>;
    declare user_id: number;
    declare post_id: number;
}

Like.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Users",
            key: "id"
        },
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
},
    {
        sequelize: db,
        modelName: "Like"
    }
)