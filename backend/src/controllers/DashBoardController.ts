import { Request, Response } from "express"
import { SimulationResult } from "../models/SimulationResult"

export class DashBoardController {
    static getMetrics = async( req: Request, res: Response) => {
        const metrics = await SimulationResult.findAll({ where: { user_id: req.user.id }, 
            attributes: ["id", "case_id", "diagnosis_accuracy", "successes", "errors", "resources_eficienty", "performance"] 
        });

// Tasa de errores por simulación
        const errorHistory = metrics.map((simulation, index) => {
            const successes = Number(simulation.successes) || 0;
            const errors = Number(simulation.errors) || 0;

            const total = successes + errors;

            const errorRate = total > 0
                ? (errors / total) * 100
                : 0;

            return {
                simulation: index + 1,
                case_id: simulation.case_id,
                date: simulation.createdAt,
                errors,
                successes,
                error_rate: errorRate
            };
        });

        // Tomar la primera simulación como referencia
        const initialErrorRate = errorHistory[0]?.error_rate ?? 0;

        // Calcular reducción respecto a la primera simulación
        const errorReduction = errorHistory.map(simulation => ({
            ...simulation,
            reduction: initialErrorRate > 0
                ? ((initialErrorRate - simulation.error_rate) /
                    initialErrorRate) * 100
                : 0
        }));

        return res.json({
            diagnosis_accuracy: metrics.reduce( (total, simulation) => total + simulation.diagnosis_accuracy , 0 ) / (metrics.length || 1),
            last_simulations: metrics.sort( (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime() ).slice(0, 5),
            error_reduction: {
                current: errorReduction.at(-1)?.reduction ?? 0,
                history: errorReduction
            },
            resources_eficienty: metrics.map(metric =>({
                case_id: metric.case_id,
                resources_eficienty: metric.resources_eficienty
            }) ),
            performance: metrics.map(metric => ({
                case_id: metric.case_id,
                performance: metric.performance
            }))
        })
        
    }
}