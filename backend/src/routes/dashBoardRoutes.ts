import { Router } from "express";
import authenticate from "../middleware/auth";
import { DashBoardController } from "../controllers/DashBoardController";

const router =  Router();

router.get("/",
    authenticate,
    DashBoardController.getMetrics
);


export default router;