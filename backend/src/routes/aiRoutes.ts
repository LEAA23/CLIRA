import { Router } from "express";
import { AIController } from "../controllers/AIController";

const router = Router();

router.post("/ask",
    AIController.askPatient
);

export default router;