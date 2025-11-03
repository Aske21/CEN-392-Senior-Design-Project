import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "Token is required" });
      return;
    }

    const authService = new AuthService();
    const user = await authService.verifyToken(token);

    // Attach user to request object
    (req as any).user = user;
    (req as any).userId = user.id;

    next();
  } catch (error: any) {
    res.status(401).json({ error: `Authentication failed: ${error.message}` });
  }
};

