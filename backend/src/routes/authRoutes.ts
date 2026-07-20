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
    body("email").notEmpty().withMessage("El e-mail es obligatorio"),
    body("password").isLength( {min: 8} ).withMessage("La contraseña debe contener minimo 8 caracteres"),
    body("repeatPassword").custom( (value, {req} ) => {
        if(value !== req.body.password) {
            throw new Error("Las contraseñas son diferentes");
        }
        return true;
    } ),
    handleInputErrors,
    AuthController.createAccount
);

router.post("/confirm-account", 
    body("token").notEmpty().withMessage("El token es obligatorio"),
    handleInputErrors,
    AuthController.confirmAccount
);

router.post("/login",
    body("email").notEmpty().withMessage("El e-mail es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatorio"),
    handleInputErrors,
    AuthController.login
);

router.post("/forgot-password", 
    body("email").notEmpty().withMessage("El e-mail es obligatorio"),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post("/update-password/:token",
    param("token").notEmpty().withMessage("El token es obligatorio"),
    body("password").isLength({min: 8}).withMessage("El nuevo password debe tener minimo 8 caracteres"),
    body("password-confirmation").custom(( value, {req} ) => {
        if( value !== req.body.password ) {
            throw new Error("Las contraseñas son diferentes")
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePassword
);

export default router;