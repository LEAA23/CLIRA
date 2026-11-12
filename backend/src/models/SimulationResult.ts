import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model
} from "sequelize";
import db from "../config/db";

export class SimulationResult extends Model< InferAttributes<SimulationResult>, InferCreationAttributes<SimulationResult> > {
    declare id: CreationOptional<number>;
    declare case_id: number;
    declare user_id: number;
    declare diagnosis: string;
    declare diagnosis_embedding: number[] | null;
    declare diagnosis_accuracy: number;
    declare successes: number;
    declare errors: number;
    declare resources_eficienty: number;
    declare performance: number;
    declare is_correct: CreationOptional<boolean | null>;

    declare createdAt? : Date;
}

SimulationResult.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    case_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "Cases",
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
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false
    },
    diagnosis_embedding: {
        type:  "VECTOR(384)" as any,
        allowNull: true
    },
    diagnosis_accuracy: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    successes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    errors: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    resources_eficienty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    performance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: db,
    modelName: "SimulationResult"
});