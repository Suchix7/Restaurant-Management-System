import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkAuth, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", checkAuth);

router.post("/logout", protectRoute, logout);

router.get("/check", protectRoute, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

export default router;
