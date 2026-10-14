import { Router } from "express";
import authenticate from "../middleware/auth";
import { CaseController } from "../controllers/CaseController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { body } from "express-validator";
import { uploadFile } from "../middleware/uploadFile";
import { isUserTeacher } from "../middleware/isUserTeacher";
import { isValidGLB } from "../middleware/isValidGLB";

const router =  Router();

router.post("/",
    authenticate,
    isUserTeacher,
    uploadFile.fields([
        { name: "caseImage", maxCount: 1 },
        { name: "patientModel", maxCount: 1 }
    ]),
    isValidGLB,
    body("title").notEmpty().withMessage("El titulo es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion del es obligatoria"),
    body("filters").isLength({ min: 1 }).withMessage("Selecciona al menos un filtro"),
    handleInputErrors,
    CaseController.createCase
);

export default router;