import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class Post extends Model< InferAttributes<Post>, InferCreationAttributes<Post> > {
    declare id: CreationOptional<number>;
    declare title: string;
    declare content: string;
    declare likes: number;
    declare group_id: number;
    declare user_id: number;
}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    group_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Groups",
            key: "id"
        },
        allowNull: false
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
    modelName: "Post"
})