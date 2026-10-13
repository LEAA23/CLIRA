import { Router } from "express";
import authenticate from "../middleware/auth";
import { CaseController } from "../controllers/CaseController";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { body } from "express-validator";
import { uploadFile } from "../middleware/uploadFile";
import { isUserTeacher } from "../middleware/isUserTeacher";

const router =  Router();

router.post("/",
    authenticate,
    isUserTeacher,
    uploadFile.fields([
        { name: "caseImage", maxCount: 1 },
        { name: "patientModel", maxCount: 1 }
    ]),
    body("title").notEmpty().withMessage("El titulo es obligatorio"),
    body("description").notEmpty().withMessage("La descripcion del es obligatoria"),
    handleInputErrors,
    CaseController.createCase
);

export default router;