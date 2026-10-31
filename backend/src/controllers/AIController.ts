import axios from "axios";
import { Request, Response } from "express"

export class AIController {
    static askPatient = async( req: Request, res: Response ) => {
        try {
            const { paciente_id, pregunta } = req.body;

            const response = await axios.post(`${process.env.AI_SERVICE_URL}/embeddings/ask`, { paciente_id, pregunta });

            return res.json(response.data);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
            success: false,
            message: "Error al consultar el asistente clínico"
            });
        }
    }
}