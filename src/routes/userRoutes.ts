import express from "express";
const router = express.Router();
import * as userController from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

router.get("/profile", verifyToken, userController.getUserProfile);
router.post("/preference", verifyToken, userController.addUserPreference);

export default router;
