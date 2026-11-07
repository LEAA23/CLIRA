import axios from "axios";
import { Disease } from "../models/Disease";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const diseases = [
    { code: "9_78650", name: "Chest pain" },
    { code: "9_41401", name: "Coronary artery disease" },
    { code: "10_A419", name: "Sepsis, unspecified organism" },
    { code: "9_30500", name: "Alcohol abuse, uncomplicated" },
    { code: "9_78659", name: "Other chest pain" },
    { code: "9_486", name: "Pneumonia, unspecified organism" },
    { code: "10_F329", name: "Major depressive disorder, single episode, unspecified" },
    { code: "9_311", name: "Depressive disorder" },
    { code: "10_Z5111", name: "Encounter for antineoplastic chemotherapy" },
    { code: "10_I214", name: "Non-ST elevation myocardial infarction" }
];

export const seedDiseases = async () => {
    try {
        for (const item of diseases) {

            // Crear o recuperar enfermedad
            const [disease] = await Disease.findOrCreate({
                where: { code: item.code },
                defaults: item
            });

            // Evitar generar embeddings existentes
            if (disease.getDataValue("embedding")) {
                console.log(`Embedding existente: ${disease.name}`);
                continue;
            }

            // Solicitar embedding al AIService
            const response = await axios.post(
                `${AI_SERVICE_URL}/embeddings/generate`,
                {
                    text: disease.name
                }
            );

            const embedding = response.data.embedding;

            // Validar dimensiones
            if (!Array.isArray(embedding) || embedding.length !== 384) {
                throw new Error(
                    `Embedding inválido para ${disease.name}`
                );
            }

            // Guardar vector utilizando pgvector
            await Disease.sequelize!.query(
                `UPDATE "Diseases"
                 SET "embedding" = CAST(:embedding AS vector)
                 WHERE "id" = :id`,
                {
                    replacements: {
                        embedding: JSON.stringify(embedding),
                        id: disease.id
                    }
                }
            );

            console.log(`Embedding generado: ${disease.name}`);
        }

        console.log("Seeder de enfermedades completado.");

    } catch (error) {
        console.error("Error al ejecutar seedDiseases:", error);
        throw error;
    }
};