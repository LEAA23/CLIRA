import z from "zod";

/**
 * AUTH SCHEMAS
 */
export const AuthSchema = z.object({
    name: z.string(),
    lastName: z.string(),
    rol: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    password: z.string(),
    repeatPassword: z.string(),
    token: z.string()
});

/**
 * USER SCHEMA
 */
export const UserSchema = AuthSchema.pick({
    name: true,
    lastName: true,
    email: true,
    rol: true
}).extend({
    id: z.number()
});

export const UserSearchSchema = UserSchema.pick({
    id: true,
    name: true,
    lastName: true,
    email: true
}).extend({
    profileImage: z.string().or(z.null())
});

/**
 * Groups SCHEMAS'
 */
export const GroupShcema = z.object({
    id: z.number(),
    name: z.string(),
    bgImage: z.array( z.file() ),
    teacher: z.number(),
    teacherUser: z.object({
        name: z.string()
    })
});

export const GroupResponse = GroupShcema.pick({
    id: true,
    name: true,
    teacher: true,
    teacherUser: true
}).extend({
    bgImage: z.string(),
    users: z.array(
        AuthSchema.pick({
            name: true,
            lastName: true,
            email: true
        }).extend({
            id: z.number(),
            profileImage: z.string().or( z.null() )
        })
    )
});

export const GroupsSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        teacherUser: z.object({
            id: z.number().optional(),
            name: z.string()
        }),
        bgImage: z.string(),
        memberCount: z.number()
    })
);

/**
 * POST'S SQUEMAS
 */
export const PostSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    images: z.array(
        z.object({
            id: z.number(),
            path: z.string()
        })
    ),
    user: z.object({
        name: z.string(),
        lastName: z.string(),
        profileImage: z.string().or( z.null() )
    }),
    likesCount: z.number(),
    likedByMe: z.boolean(),
    group_id: z.number(),
    user_id: z.number()
});

export const PostsSchema = z.array(
    PostSchema
);

export const PostImageSchema = z.object({
    id: z.number(),
    path: z.string()
})

export const PostImagesSchema = z.array(
    PostImageSchema
);

export const likePostSquema = z.object({
    id: z.number(),
    likesCount: z.number(),
    likedByMe: z.boolean()
});

export const CommentSquema = z.object({
    id: z.number(),
    content: z.string(),
    post_id: z.number(),
    user: z.object({
        id: z.number(),
        name: z.string(),
        lastName: z.string(),
        profileImage: z.string().or( z.null() )
    }),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const CommentsSchema = z.array(
    CommentSquema
);

/**
 * USER SQUEMAS
 */
export const UserProfileSchema = UserSearchSchema.extend({
    rol: z.string(),
    postsCount: z.number(),
    likesCount: z.number()
});

/**
 *  CHART CONTAINER SCHEMA
 */
export const ChartOptionSchema = z.object({
    id: z.string(),
    label: z.string()
});

/**
 * MEMBERS CONTAINER SCHEMA
 */
export const MembersOptionSchema = z.object({
    id: z.string(),
    label: z.string()
});

/**
 * FILTERS SCEHMA
 */
export const FilterSchema = z.object({
    id: z.number(),
    name: z.string(),
    category_id: z.number()
});

/**
 * CASES SQUEMA
 */
export const CaseSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    symptomsAndHistory: z.array(
        z.object({
            id: z.number(),
            type: z.string(),
            content: z.string()
        })
    ),
    laboratoryStudyResults: z.array(
        z.object({
            id: z.number(),
            value: z.number().or( z.null() )
        })
    ),
    height: z.number(),
    weight: z.number(),
    bloodPreassure: z.string(),
    images: z.array(
        z.object({
            id: z.number(),
            path: z.string()
        })
    ),
    previewImage: z.file().or(z.null()).or(z.string()),
    simulationModel: z.file().or(z.null()).or(z.string()),
    teacher_id: z.number(),

    creator: z.object({
        id: z.number(),
        name: z.string(),
        lastName: z.string(),
        email: z.string()
    }).nullable().optional(),

    filters: z.array(FilterSchema)
});

export const CasesSquema = z.array( CaseSchema );

// Esquema reducido para seleccionar casos clínicos desde el tablón de grupos
export const PublicCaseSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    previewImage: z.string().default(""),
    filters: z.array(FilterSchema).default([])
});

export const PublicCasesSchema = z.array(PublicCaseSchema);

//Symptoms Squema
export const SymptomSquema = z.string();

export const askQuestionResponse = z.object({
    success: z.boolean(),
    records: z.array(
        z.object({
            id: z.number(),
            type: z.string(),
            content: z.string(),
            distance: z.number()
        })
    )
});

export const MetricsSquema = z.array(
    z.object({
        type: z.string(),
        value: z.number().or( z.string() )
    })
)

export const LaboratoryStudySquema = z.object({
    id: z.number(),
    name: z.string()
});

export const LaboratoryStudyResultSquema = z.object({
    id: z.number(),
    value: z.number().or( z.null() )
});

export const laboratoryStudiesSchema = z.array(
    LaboratoryStudySquema
);

export const laboratoryStudyResultsSchema = z.array(
    LaboratoryStudyResultSquema
)

export const DiagnosisSchema = z.object({
    diagnosis: z.string()
});

export const DiagnoseDataSchema = z.object({
    diagnosis: z.string(),

    symptomsAndHistory: z.array(
        z.object({
            id: z.number(),
            type: z.string(),
            content: z.string(),
            distance: z.number().optional()
        })
    ),

    bodyMetrics: z.array(
        z.object({
            type: z.string(),
            content: z.union([
                z.string(),
                z.number()
            ])
        })
    ),

    laboratoryStudies: z.array(
        z.object({
            id: z.number(),
            value: z.number().nullable()
        })
    ),

    features: z.record(
        z.string(),
        z.number().nullable()
    )
});

//SQUEMA DIAGNOSIS RESPONSE

export const PredictionSquema = z.object({
    posicion: z.number(),
    diagnostico: z.string(),
    puntuacion: z.number()
});

export const DetailSquema = z.object({
    id: z.number(),
    name: z.string(),
    expectedValue: z.number(),
    studentValue: z.number(),
    difference: z.number(),
    isCorrect: z.boolean()
});

export const DiagnosisResultsSquema = z.object({
    simulationResult: z.object({
        diagnosis: z.string(),
        is_correct: z.boolean()
    }),
    anamnesisEvaluation: z.object({
        symptoms: z.object({
            score: z.number(),
            precision: z.number(),
            recall: z.number(),
            f1Score: z.number(),
            expectedCount: z.number(),
            identifiedCount: z.number(),
            recognizedCount: z.number(),
            recognizedSymptoms: z.array( z.string() ),
            missedSymptoms: z.array( z.string() ),
            incorrectSymptoms: z.array( z.string() )
        }),
        history: z.object({
            score: z.number(),
            precision: z.number(),
            recall: z.number(),
            f1Score: z.number(),
            expectedCount: z.number(),
            identifiedCount: z.number(),
            recognizedCount: z.number(),
            recognizedRecords: z.array( z.string() ),
            missedRecords: z.array( z.string() ),
            incorrectRecords: z.array( z.string() )
        }),
        age: z.object({
            score: z.number(),
            precision: z.number(),
            recall: z.number(),
            f1Score: z.number(),
            expectedCount: z.number(),
            identifiedCount: z.number(),
            recognizedCount: z.number(),
            recognizedRecords: z.array( z.string().or( z.null() ) ),
            missedRecords: z.array( z.string().or( z.null() ) ),
            incorrectRecords: z.array( z.string().or( z.null() ) )
        })
    }),
    bodyEvaluation: z.object({
        score: z.number(),
        height: z.object({
            expected: z.number(),
            identified: z.number().or( z.null() ),
            difference: z.number(),
            tolerance: z.number(),
            score: z.number(),
            isCorrect: z.boolean()
        }),
        weight: z.object({
            expected: z.number(),
            identified: z.number().or( z.null() ),
            difference: z.number(),
            tolerance: z.number(),
            score: z.number(),
            isCorrect: z.boolean()
        }),
        bloodPressure: z.object({
            systolic: z.object({
                expected: z.number(),
                identified: z.number().or( z.null() ),
                difference: z.number(),
                tolerance: z.number(),
                score: z.number(),
                isCorrect: z.boolean()
            }),
            diastolic: z.object({
                expected: z.number(),
                identified: z.number().or( z.null() ),
                difference: z.number(),
                tolerance: z.number(),
                score: z.number(),
                isCorrect: z.boolean()
            }),
            score: z.number(),
            isCorrect: z.boolean()
        })
    }),
    laboratoryEvaluation: z.object({
        recognition: z.object({
            totalExpected: z.number(),
            totalSelected: z.number(),
            correct: z.number(),
            incorrect: z.number(),
            missing: z.number(),
            precision: z.number(),
            recall: z.number(),
            f1: z.number()
        }),
        interpretation: z.object({
            totalEvaluated: z.number(),
            correct: z.number(),
            incorrect: z.number(),
            score: z.number().or( z.null() ),
            details: z.array(
                DetailSquema.or( z.null() )
            )
        })
    }),
    predicciones: z.array(
        PredictionSquema.or( z.null() )
    ),
    mejorCoincidencia: z.object({
        disease_id: z.number(),
        code: z.string(),
        name: z.string(),
        position: z.number(),
        score: z.number(),
        similarity: z.number()
    }).or( z.null() ),
    hasMatch: z.boolean()
})