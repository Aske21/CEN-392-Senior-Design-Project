import express from "express";
import AuthController from "../controllers/auth-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/google", (req, res) =>
  authController.initiateGoogleAuth(req, res)
);
router.get("/google/callback", (req, res) =>
  authController.handleGoogleCallback(req, res)
);
router.post("/google/token", (req, res) => authController.googleAuth(req, res));
router.get("/verify", (req, res) => authController.verifyToken(req, res));

// Protected routes
router.get("/me", authMiddleware, (req, res) =>
  authController.getCurrentUser(req, res)
);

export default router;
