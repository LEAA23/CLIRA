import { Router } from "express";
import authenticate from "../middleware/auth";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { param } from "express-validator";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/:id",
    authenticate,
    param("id").notEmpty().withMessage("El id del usuario es obligatorio"),
    handleInputErrors,
    UserController.getUser
);

export default router;