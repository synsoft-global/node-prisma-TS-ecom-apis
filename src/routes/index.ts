import express from "express";
import auth from "./authRoutes";
import user from "./userRoutes";
import preference from "./preferenceRoutes";

const router = express.Router();
router.use("/auth", auth);
router.use("/user", user);
router.use("/preference", preference);

export default router;
