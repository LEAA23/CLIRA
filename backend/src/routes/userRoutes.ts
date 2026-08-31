import { Router } from "express";
import authenticate from "../middleware/auth";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { query } from "express-validator";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/",
    authenticate,
    query("email").notEmpty().withMessage("El email del usuario es obligatorio"),
    handleInputErrors,
    UserController.getUser
);

export default router;