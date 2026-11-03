import { Router } from "express";
import authenticate from "../middleware/auth";
import { CaseController } from "../controllers/CaseController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { body, param } from "express-validator";
import { uploadFile } from "../middleware/uploadFile";
import { isUserTeacher } from "../middleware/isUserTeacher";
import { isValidGLB } from "../middleware/isValidGLB";
import { caseExists } from "../middleware/caseExists";

const router =  Router();

router.post("/",
    authenticate,
    isUserTeacher,
    uploadFile.fields([
        { name: "previewImage", maxCount: 1 },
        { name: "simulationModel", maxCount: 1 }
    ]),
    isValidGLB,
    body("title").notEmpty().withMessage("El titulo es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion del es obligatoria"),
    body("symptomsAndHistory"),
    body("height"),
    body("weight"),
    body("bloodPreassure"),
    body("laboratoryStudies"),
    body("filters").isLength({ min: 1 }).withMessage("Selecciona al menos un filtro"),
    handleInputErrors,
    CaseController.createCase
);

router.get("/",
    authenticate,
    handleInputErrors,
    CaseController.getCases
);

router.get(
    "/progress/completed",
    authenticate,
    CaseController.getCompletedCases
);

router.get(
    "/public",
    CaseController.getPublicCases
);

router.post(
    "/:caseId/complete",
    authenticate,
    param("caseId").isInt({ min: 1 })
        .withMessage("El ID del caso no es válido"),
    handleInputErrors,
    CaseController.completeCase
);

router.get(
    "/filters/categories",
    authenticate,
    CaseController.getFilterCategories
);

router.get("/laboratoryStudies",
    authenticate,
    handleInputErrors,
    CaseController.getLaboratorystudies
);

router.get("/:caseId",
    authenticate,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    handleInputErrors,
    CaseController.getCase
);

router.post("/:caseId/askQuestion",
    authenticate,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    body( "question" ).notEmpty().withMessage("La pregunta es obligatoria"),
    handleInputErrors,
    CaseController.askQuestion
);

router.post("/:caseId/corporalMetrics",
    authenticate,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    body("metricsSelected.*").isIn(["height", "weight", "bloodPreassure"]).withMessage("Una de las métricas seleccionadas no es válida"),
    body( "metricsSelected" ).isArray().withMessage("Debes seleccionar al menos una metrica"),
    handleInputErrors,
    CaseController.getCorporalMetrics
);

router.post("/:caseId/laboratoryStudies",
    authenticate,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    body( "laboratoryStudies" ).isArray().withMessage("Debes seleccionar al menos un estudio"),
    handleInputErrors,
    CaseController.getPatientLaboratoryStudies
);

router.patch("/:caseId",
    authenticate,
    isUserTeacher,
    uploadFile.fields([
        { name: "previewImage", maxCount: 1 },
        { name: "simulationModel", maxCount: 1 }
    ]),
    isValidGLB,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    body("title").notEmpty().withMessage("El titulo es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion del es obligatoria"),
    body("filters").isLength({ min: 1 }).withMessage("Selecciona al menos un filtro"),
    handleInputErrors,
    CaseController.updateCase
);

router.patch("/:caseId/deleteCaseImage",
    authenticate,
    isUserTeacher,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    handleInputErrors,
    CaseController.deleteCaseImage
);

router.patch("/:caseId/deleteCaseModel",
    authenticate,
    isUserTeacher,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    handleInputErrors,
    CaseController.deleteCaseModel
);

router.delete("/:caseId",
    authenticate,
    isUserTeacher,
    caseExists,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    handleInputErrors,
    CaseController.deleteCase
);

export default router;