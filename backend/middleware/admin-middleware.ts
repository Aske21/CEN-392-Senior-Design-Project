import { Request, Response, NextFunction } from "express";
import { UserType } from "../enums/UserType";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (user.user_type !== UserType.ADMIN) {
      res.status(403).json({ error: "Forbidden: admins only" });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export default adminMiddleware;
