import express from "express";
const router = express.Router();
import * as prefController from "../controllers/preferenceController";
import { verifyToken } from "../middlewares/authMiddleware";

router.get("/", verifyToken, prefController.getPreference);
router.post("/createPreference", verifyToken, prefController.createPreference);

export default router;
