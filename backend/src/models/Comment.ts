import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export class Comment extends Model< InferAttributes<Comment>, InferCreationAttributes<Comment> > {
    declare id: CreationOptional<number>
    declare content: string;
    declare post_id: number;
    declare user_id: number;
    declare createdAt?: string;
    declare updatedAt?: string;
}

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id"
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Users",
            key: "id"
        },
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "Comment"
});