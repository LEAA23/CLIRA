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

router.post(
    "/:caseId/complete",
    authenticate,
    param("caseId").isInt({ min: 1 })
        .withMessage("El ID del caso no es válido"),
    handleInputErrors,
    CaseController.completeCase
);

router.get("/:caseId",
    authenticate,
    param( "caseId" ).notEmpty().withMessage("El id del caso es obligatorio"),
    handleInputErrors,
    CaseController.getCase
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