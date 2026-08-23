import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";


export class UserGroup extends Model< InferAttributes<UserGroup>, InferCreationAttributes<UserGroup> > {
    declare id: CreationOptional<number>;
    declare user_id: number;
    declare group_id: number;
}

UserGroup.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "User",
                key: "id"
            }
        },
        group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Group",
                key: "id"
            }
        }
    }, 
    {
        sequelize: db,
        modelName: "UserGroup"
    }
)