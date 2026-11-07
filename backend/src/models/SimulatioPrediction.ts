import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/db";

export class SimulationPrediction extends Model< InferAttributes<SimulationPrediction>, InferCreationAttributes<SimulationPrediction> > {
    declare id: CreationOptional<number>;
    declare simulation_result_id: number;
    declare disease_id: number;
    declare position: number;
    declare score: number;
}

SimulationPrediction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    simulation_result_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "SimulationResults",
            key: "id"
        }
    },
    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Diseases",
            key: "id"
        }
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: "SimulationPrediction"
});