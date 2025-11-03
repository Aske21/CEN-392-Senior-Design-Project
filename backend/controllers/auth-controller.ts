import { Request, Response } from "express";
import { AuthService } from "../services/auth-service";

class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, dateOfBirth, firstName, lastName } = req.body;

      if (!email || !password || !username) {
        res.status(400).json({ error: "Email, password, and username are required" });
        return;
      }

      const result = await this.authService.register(
        email,
        password,
        username,
        dateOfBirth,
        firstName,
        lastName
      );

      const { password: _, ...userWithoutPassword } = result.user;

      res.status(201).json({
        user: userWithoutPassword,
        token: result.token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const result = await this.authService.login(email, password);

      const { password: _, ...userWithoutPassword } = result.user;

      res.json({
        user: userWithoutPassword,
        token: result.token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async initiateGoogleAuth(req: Request, res: Response): Promise<void> {
    try {
      const state = req.query.state as string || "";
      const authUrl = this.authService.getGoogleAuthUrl(state);
      res.redirect(authUrl);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;

      if (!code) {
        res.status(400).json({ error: "Authorization code is required" });
        return;
      }

      const result = await this.authService.handleGoogleCallback(code as string);

      const { password: _, ...userWithoutPassword } = result.user;

      const redirectUrl = new URL(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth/callback`);
      redirectUrl.searchParams.set("token", result.token);
      redirectUrl.searchParams.set("user", JSON.stringify(userWithoutPassword));

      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      const errorUrl = new URL(`${process.env.CLIENT_URL || "http://localhost:3000"}/login`);
      errorUrl.searchParams.set("error", error.message);
      res.redirect(errorUrl.toString());
    }
  }

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({ error: "Google ID token is required" });
        return;
      }

      const result = await this.authService.verifyGoogleToken(idToken);

      const { password: _, ...userWithoutPassword } = result.user;

      res.json({
        user: userWithoutPassword,
        token: result.token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({ error: "Token is required" });
        return;
      }

      const user = await this.authService.verifyToken(token);

      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;

