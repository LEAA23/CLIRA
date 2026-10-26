
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import db from "../config/db";

export class CaseCompletion extends Model<
  InferAttributes<CaseCompletion>,
  InferCreationAttributes<CaseCompletion>
> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare case_id: number;
  declare is_correct: CreationOptional<boolean | null>;
}

CaseCompletion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    case_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize: db,
    tableName: "case_completions",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "case_id"],
      },
    ],
  }
);
