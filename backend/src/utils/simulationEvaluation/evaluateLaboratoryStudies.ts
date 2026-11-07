
interface StudentLaboratoryStudy {
    id?: number;
    value: number | null;
}

interface ExpectedLaboratoryStudy {
    laboratoryStudy_id: number;
    name: string;
    value: number | null;
}

export const evaluateLaboratoryStudies = ({
    studentStudies,
    expectedStudies
}: {
    studentStudies: StudentLaboratoryStudy[];
    expectedStudies: ExpectedLaboratoryStudy[];
}) => {

    // Normalizar identificadores y evitar duplicados
    const submittedStudies = new Map(
        studentStudies.map(study => [
            Number(study.id ?? study.id),
            study
        ])
    );

    const expectedMap = new Map(
        expectedStudies.map(study => [
            Number(study.laboratoryStudy_id),
            study
        ])
    );

    // Evaluar reconocimiento
    const recognized = expectedStudies.filter(
        study => submittedStudies.has(Number(study.laboratoryStudy_id))
    );

    const falsePositives = [...submittedStudies.keys()].filter(
        id => !expectedMap.has(id)
    );

    const falseNegatives = expectedStudies.filter(
        study => !submittedStudies.has(Number(study.laboratoryStudy_id))
    );

    const truePositives = recognized.length;

    const precision = submittedStudies.size > 0
        ? truePositives / submittedStudies.size
        : 0;

    const recall = expectedStudies.length > 0
        ? truePositives / expectedStudies.length
        : 0;

    const f1 = precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;

    // Evaluar interpretación numérica
    const interpretedStudies = recognized.filter(study => {
        const submitted = submittedStudies.get(
            Number(study.laboratoryStudy_id)
        );

        return study.value !== null && submitted?.value !== null
            && submitted?.value !== undefined
            && Number.isFinite(Number(submitted.value));
    });

    const interpretationResults = interpretedStudies.map(study => {
        const submitted = submittedStudies.get(
            Number(study.laboratoryStudy_id)
        )!;

        const expectedValue = Number(study.value);
        const studentValue = Number(submitted.value);

        // Tolerancia técnica del 10%
        const tolerance = Math.abs(expectedValue) * 0.10;

        const difference = Math.abs(studentValue - expectedValue);

        return {
            id: study.laboratoryStudy_id,
            name: study.name,
            expectedValue,
            studentValue,
            difference: Number(difference.toFixed(2)),
            isCorrect: difference <= tolerance
        };
    });

    const correctInterpretations = interpretationResults.filter(
        result => result.isCorrect
    ).length;

    const interpretationScore = interpretationResults.length > 0
        ? correctInterpretations / interpretationResults.length
        : null;

    return {
        recognition: {
            totalExpected: expectedStudies.length,
            totalSelected: submittedStudies.size,
            correct: truePositives,
            incorrect: falsePositives.length,
            missing: falseNegatives.length,
            precision: Number(precision.toFixed(4)),
            recall: Number(recall.toFixed(4)),
            f1: Number(f1.toFixed(4))
        },

        interpretation: {
            totalEvaluated: interpretationResults.length,
            correct: correctInterpretations,
            incorrect: interpretationResults.length - correctInterpretations,
            score: interpretationScore !== null
                ? Number(interpretationScore.toFixed(4))
                : null,
            details: interpretationResults
        }
    };
};
