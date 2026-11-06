
interface ClinicalRecord {
    type: string;
    content: string | number;
}

interface MetricResult {
    expected: number | string;
    identified: number | string | null;
    difference: number;
    tolerance: number;
    score: number;
    isCorrect: boolean;
}

const evaluateMetric = (
    expected: number,
    identified: number | null,
    tolerance: number
): MetricResult => {

    if (identified === null) {
        return {
            expected,
            identified: null,
            difference: 0,
            tolerance,
            score: 0,
            isCorrect: false
        };
    }

    const difference = Math.abs(expected - identified);

    return {
        expected,
        identified,
        difference: Number(difference.toFixed(2)),
        tolerance,
        score: Math.max(
            0,
            100 * (1 - difference / (3 * tolerance))
        ),
        isCorrect: difference <= tolerance
    };
};

const getRecordValue = (
    records: ClinicalRecord[],
    types: string[]
): string | null => {

    const record = records.find(
        item => types.includes(item.type)
    );

    return record ? String(record.content) : null;
};

interface BodyMetrics {
    height: number | null;
    weight: number | null;
    bloodPressure: string | null;
}

export const evaluateBodyMetrics = ({
    studentRecords,
    expectedMetrics
}: {
    studentRecords: ClinicalRecord[];
    expectedMetrics: BodyMetrics;
}) => {

    // Obtener valores esperados desde Case
    const heightExpected = expectedMetrics.height;
    const weightExpected = expectedMetrics.weight;
    const expectedBP = expectedMetrics.bloodPressure;

    // Obtener valores identificados por el estudiante
    const studentHeight = getRecordValue(
        studentRecords, ["height"]
    );

    const studentWeight = getRecordValue(
        studentRecords, ["weight"]
    );

    const studentBP = getRecordValue(
        studentRecords, ["bloodPreassure", "bloodPressure"]
    );

    // Convertir cm a pulgadas y kg a libras
    // Ambos valores se comparan en cm y kg
    const heightStudent = studentHeight !== null
        ? Number(studentHeight)
        : null;

    const weightStudent = studentWeight !== null
        ? Number(studentWeight)
        : null;

    // Evaluar altura
const height = heightExpected !== null &&
    Number.isFinite(heightExpected)
    ? evaluateMetric(
        heightExpected,
        heightStudent !== null && Number.isFinite(heightStudent)
            ? heightStudent
            : null,
        2
    )
    : null;

    // Evaluar peso
const weight = weightExpected !== null &&
    Number.isFinite(weightExpected)
    ? evaluateMetric(
        weightExpected,
        weightStudent !== null && Number.isFinite(weightStudent)
            ? weightStudent
            : null,
        1
    )
    : null;

    // Separar presión sistólica y diastólica
    const parseBP = (value: string | null) => {
        if (!value) return null;

        const match = value.match(
            /^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/
        );

        if (!match) return null;

        return {
            systolic: Number(match[1]),
            diastolic: Number(match[2])
        };
    };

    const expectedPressure = parseBP(expectedBP);
    const studentPressure = parseBP(studentBP);

    let bloodPressure = null;

    if (expectedPressure) {

        const systolic = evaluateMetric(
            expectedPressure.systolic,
            studentPressure?.systolic ?? null,
            5
        );

        const diastolic = evaluateMetric(
            expectedPressure.diastolic,
            studentPressure?.diastolic ?? null,
            5
        );

        bloodPressure = {
            systolic,
            diastolic,
            score: Number(
                ((systolic.score + diastolic.score) / 2).toFixed(2)
            ),
            isCorrect: systolic.isCorrect && diastolic.isCorrect
        };
    }

    // Calcular calificación general
    const evaluations = [
        height,
        weight,
        bloodPressure
    ].filter(item => item !== null);

    const score = evaluations.length > 0
        ? evaluations.reduce(
            (total, item) => total + item.score, 0
        ) / evaluations.length
        : null;

    return {
        score: score !== null ? Number(score.toFixed(2)) : null,
        height,
        weight,
        bloodPressure
    };
};
