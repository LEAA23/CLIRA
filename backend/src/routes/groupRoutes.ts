import { Router } from "express";
import { GroupsControlller } from "../controllers/GroupsController";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../middleware/handleInputErrors";
import authenticate from "../middleware/auth";
import groupAuthorization from "../middleware/groupAuthorization";
import { uploadFile } from "../middleware/uploadFile";
import { groupExists } from "../middleware/groupExists";
import { isGroupMember } from "../middleware/isGroupMember";

const router = Router();

router.post("/",
    authenticate,
    uploadFile.single("bgImage"),
    body("name").notEmpty().withMessage("El nombre del grupo es obligatorio"),
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
    uploadFile.single("bgImage"),
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    body("name").notEmpty().withMessage("El nombre del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.updateGroup
);

router.delete("/:groupId",
    authenticate,
    groupAuthorization,
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.deleteGroup
);

router.get("/:groupId", 
    authenticate,
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.getGroup
);

/**
 * MEMBERS' ENDPOINTS
*/
router.post("/:groupId/members", 
    authenticate,
    groupAuthorization,
    param("groupId").isInt( { min: 1 } ).withMessage("El id del grupo es obligatorio"),
    body("email").notEmpty().withMessage("El email del miembro es obligatorio"),
    handleInputErrors, 
    GroupsControlller.setMembertoGroup
);

router.get("/:groupId/members",
    authenticate,
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    query("email").notEmpty().withMessage("El email del usuario es obligatorio"),
    handleInputErrors,
    GroupsControlller.searchMemberInGroup
);

router.delete("/:groupId/members",
    authenticate,
    groupAuthorization,
    param("groupId").isInt( { min: 1 } ).withMessage("El id del grupo es obligatorio"),
    query("email").notEmpty().withMessage("El email del miembro es obligatorio"),
    handleInputErrors,
    GroupsControlller.removeMemberFromGroup
);

/**
 * POST'S ENDPOINTS
 */
router.post("/:groupId/posts",
    authenticate,
    groupExists,
    uploadFile.array("media"),
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    body("title").notEmpty().withMessage("El titulo es obligatorio"),
    body("content").notEmpty().withMessage("El contenido es obligatorio"),
    handleInputErrors,
    GroupsControlller.createPost
);

router.get("/:groupId/posts",
    authenticate,
    groupExists,
    isGroupMember,
    param("groupId").notEmpty().withMessage("El id del grupo es obligatorio"),
    handleInputErrors,
    GroupsControlller.getPosts
);



export default router;
