import { Router } from "express";
import authenticate from "../middleware/auth";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { param, query } from "express-validator";
import { UserController } from "../controllers/UserController";
import { uploadFile } from "../middleware/uploadFile";

const router = Router();

router.get("/",
    authenticate,
    query("email").notEmpty().withMessage("El email del usuario es obligatorio"),
    handleInputErrors,
    UserController.getUser
);

router.get("/:id",
    authenticate,
    param("id").notEmpty().withMessage("El id del usuario es obligatorio"),
    handleInputErrors,
    UserController.getUserById
);

router.patch("/:id",
    authenticate,
    uploadFile.single("image"),
    param("id").notEmpty().withMessage("El id del usuario es obligatorio"),
    handleInputErrors,
    UserController.updateProfileImage
);

router.delete("/:id",
    authenticate,
    param("id").notEmpty().withMessage("El id del usuario es obligatorio"),
    handleInputErrors,
    UserController.deleteProfileImage
);

export default router;