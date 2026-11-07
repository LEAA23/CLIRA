interface ClinicalRecord {
    id: number;
    type: string;
    content: string;
    distance?: number;
}

interface SymptomEvaluationInput {
    symptomsAndHistory: ClinicalRecord[];
    expectedSymptoms: string[];
}

export const evaluateSymptoms = ({
    symptomsAndHistory,
    expectedSymptoms
}: SymptomEvaluationInput) => {

    // Obtener exclusivamente los síntomas identificados
    const identifiedSymptoms = symptomsAndHistory
        .filter(item => item.type === "symptom");

    const expected = new Set(
        expectedSymptoms.map(normalize)
    );

    const identified = new Set(
        identifiedSymptoms.map(item => normalize(item.content))
    );

    // Síntomas que coinciden
    const recognizedSymptoms = [...identified]
        .filter(symptom => expected.has(symptom));

    // Síntomas que no identificó
    const missedSymptoms = [...expected]
        .filter(symptom => !identified.has(symptom));

    // Síntomas identificados que no están en la referencia
    const incorrectSymptoms = [...identified]
        .filter(symptom => !expected.has(symptom));

    const tp = recognizedSymptoms.length;
    const fp = incorrectSymptoms.length;
    const fn = missedSymptoms.length;

    const recall = expected.size > 0
        ? (tp / expected.size) * 100
        : 0;

    const precision = identified.size > 0
        ? (tp / identified.size) * 100
        : 0;

    const f1Score = precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;

    return {
        score: Number(recall.toFixed(2)),
        precision: Number(precision.toFixed(2)),
        recall: Number(recall.toFixed(2)),
        f1Score: Number(f1Score.toFixed(2)),

        expectedCount: expected.size,
        identifiedCount: identified.size,
        recognizedCount: tp,

        recognizedSymptoms,
        missedSymptoms,
        incorrectSymptoms
    };
};

interface ClinicalRecord {
    id: number;
    type: string;
    content: string;
    distance?: number;
}

interface ClinicalEvaluationInput {
    symptomsAndHistory: ClinicalRecord[];
    expectedRecords: ClinicalRecord[];
}

const normalize = (value: string): string =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[.,;:!?]/g, "");

const evaluateClinicalType = (
    identifiedRecords: ClinicalRecord[],
    expectedRecords: ClinicalRecord[],
    type: string
) => {

    const identified = new Set(
        identifiedRecords
            .filter(record => record.type === type)
            .map(record => normalize(record.content))
    );

    const expected = new Set(
        expectedRecords
            .filter(record => record.type === type)
            .map(record => normalize(record.content))
    );

    const recognized = [...identified]
        .filter(record => expected.has(record));

    const missed = [...expected]
        .filter(record => !identified.has(record));

    const incorrect = [...identified]
        .filter(record => !expected.has(record));

    const tp = recognized.length;
    const fp = incorrect.length;
    const fn = missed.length;

    const precision = tp + fp > 0
        ? tp / (tp + fp) * 100
        : 0;

    const recall = tp + fn > 0
        ? tp / (tp + fn) * 100
        : 0;

    const f1Score = precision + recall > 0
        ? 2 * precision * recall / (precision + recall)
        : 0;

    return {
        score: Number(recall.toFixed(2)),
        precision: Number(precision.toFixed(2)),
        recall: Number(recall.toFixed(2)),
        f1Score: Number(f1Score.toFixed(2)),

        expectedCount: expected.size,
        identifiedCount: identified.size,
        recognizedCount: tp,

        recognizedRecords: recognized,
        missedRecords: missed,
        incorrectRecords: incorrect
    };
};

// Evaluar antecedentes clínicos
export const evaluateHistory = ({
    symptomsAndHistory,
    expectedRecords
}: ClinicalEvaluationInput) => {

    return evaluateClinicalType(
        symptomsAndHistory,
        expectedRecords,
        "history"
    );
};

// Evaluar edad
export const evaluateAge = ({
    symptomsAndHistory,
    expectedRecords
}: ClinicalEvaluationInput) => {

    return evaluateClinicalType(
        symptomsAndHistory,
        expectedRecords,
        "age"
    );
};