
import {
    Request,
    Response,
    NextFunction
} from "express";

import { User } from "../models/User";

export const isUserTeacher = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authenticatedUser = await User.findByPk(
            req.user.id,
            {
                attributes: ["id", "rol"]
            }
        );

        // Comprobar que el usuario autenticado exista.
        if (!authenticatedUser) {
            return res.status(401).json({
                error: "Usuario no autenticado."
            });
        }

        // Comprobar que tenga permisos de maestro/doctor.
        if (authenticatedUser.rol !== "teacher") {
            return res.status(403).json({
                error: "No tienes permisos para realizar esta acción. Solo los maestros pueden administrar casos clínicos."
            });
        }

        return next();

    } catch (error) {
        console.error(
            "Error al verificar los permisos del usuario:",
            error
        );

        return res.status(500).json({
            error: "No se pudieron verificar los permisos."
        });
    }
};