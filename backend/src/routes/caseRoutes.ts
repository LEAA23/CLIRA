import { Router } from "express";
import authenticate from "../middleware/auth";
import { CaseController } from "../controllers/CaseController";

const router =  Router();

router.post("/", 
    authenticate,
    
    CaseController.createCase
);

export default router;