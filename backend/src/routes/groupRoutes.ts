import { Router } from "express";
import { GroupsControlller } from "../controllers/GroupsController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import groupAuthorization from "../middleware/groupAuthorization";

const router = Router();

router.post("/",
    authenticate,
    body("name").notEmpty().withMessage("El nombre del grupo es obligatorio"),
    body("bgImage").notEmpty().withMessage("La imagen de fondo es obligatoria"),
    handleInputErrors,
    GroupsControlller.createGroup
);

router.get("/",
    authenticate,
    GroupsControlller.getGroups
);

router.patch("/:groupId",
    authenticate,
    groupAuthorization,
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    body("name").notEmpty().withMessage("El nombre del grupo es obligatorio"),
    body("bgImage").notEmpty().withMessage("La Imagen de fondo es obligatoria"),
    handleInputErrors,
    GroupsControlller.updateGroup
);

router.delete("/:groupId",
    authenticate,
    groupAuthorization,
    param("groupId").notEmpty().withMessage("El ud del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.deleteGroup
);


export default router;
