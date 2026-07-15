import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/create-account",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("lastName").notEmpty().withMessage("Los apellidos son obligatorios"),
    body("rol").notEmpty().withMessage("El rol es obligatorio"),
    body("phoneNumber").notEmpty().withMessage("El numero de telefono es obligatorio"),
    body("email").notEmpty().withMessage("El email es obligatorio"),
    body("password").isLength({min: 8}).withMessage("El password debe contener minimo 8 caracteres"),
    body("repeatPassword").custom( (value, {req} ) => {
        if(value !== req.body.password) {
            throw new Error("Las contrasenas no coinciden")
        }
        return true;
    } ),
    handleInputErrors,
    AuthController.createAccount

);

export default router;