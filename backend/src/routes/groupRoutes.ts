import { Router } from "express";
import { GroupsControlller } from "../controllers/GroupsController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/",
    authenticate,
    body("name").notEmpty().withMessage("El nombre del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.createGroup
);

router.get("/",
    authenticate,
    GroupsControlller.getGroups
);


export default router;
