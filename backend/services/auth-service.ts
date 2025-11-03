import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Users } from "../core/db/entity/user";
import { appDataSource } from "../core/data-source";
import { UserType } from "../enums/UserType";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";

export class AuthService {
  private userRepository = appDataSource.getRepository(Users);
  private googleClient =
    GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? new OAuth2Client(
          GOOGLE_CLIENT_ID,
          GOOGLE_CLIENT_SECRET,
          `${SERVER_URL}/auth/google/callback`
        )
      : null;

  async register(
    email: string,
    password: string,
    username: string,
    dateOfBirth?: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ user: Users; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData: Partial<Users> = {
      email,
      password: hashedPassword,
      username,
      user_type: UserType.CUSTOMER,
    };

    if (dateOfBirth) {
      userData.date_of_birth = new Date(dateOfBirth);
    }

    if (firstName) {
      userData.first_name = firstName;
    }

    if (lastName) {
      userData.last_name = lastName;
    }

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Users; token: string }> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.password) {
      throw new Error("Please sign in with Google");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  getGoogleAuthUrl(state?: string): string {
    if (!this.googleClient) {
      throw new Error("Google OAuth not configured");
    }

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    return this.googleClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: state || "",
      prompt: "consent",
    });
  }

  async handleGoogleCallback(
    code: string
  ): Promise<{ user: Users; token: string }> {
    if (!this.googleClient) {
      throw new Error("Google OAuth not configured");
    }

    try {
      const { tokens } = await this.googleClient.getToken(code);
      this.googleClient.setCredentials(tokens);

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user info from Google");
      }

      const googleUser = await userInfoResponse.json();
      const { id: googleId, email, name } = googleUser;

      if (!email) {
        throw new Error("Email not provided by Google");
      }

      let user = await this.userRepository.findOne({
        where: [{ email }, { google_id: googleId }],
      });

      if (user) {
        if (!user.google_id) {
          user.google_id = googleId;
          await this.userRepository.save(user);
        }
      } else {
        const nameParts = name ? name.split(" ") : [];
        const firstName = nameParts[0] || email.split("@")[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        user = this.userRepository.create({
          google_id: googleId,
          email,
          username: name || email.split("@")[0],
          first_name: firstName,
          last_name: lastName,
          user_type: UserType.CUSTOMER,
        });
        user = await this.userRepository.save(user);
      }

      const token = this.generateToken(user);

      return { user, token };
    } catch (error: any) {
      throw new Error(`Google OAuth failed: ${error.message}`);
    }
  }

  async verifyGoogleToken(
    idToken: string
  ): Promise<{ user: Users; token: string }> {
    if (!this.googleClient) {
      throw new Error("Google OAuth not configured");
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("Invalid Google token");
      }

      const { sub: googleId, email, name } = payload;

      if (!email) {
        throw new Error("Email not provided by Google");
      }

      let user = await this.userRepository.findOne({
        where: [{ email }, { google_id: googleId }],
      });

      if (user) {
        if (!user.google_id) {
          user.google_id = googleId;
          await this.userRepository.save(user);
        }
      } else {
        const nameParts = name ? name.split(" ") : [];
        const firstName = nameParts[0] || email.split("@")[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        user = this.userRepository.create({
          google_id: googleId,
          email,
          username: name || email.split("@")[0],
          first_name: firstName,
          last_name: lastName,
          user_type: UserType.CUSTOMER,
        });
        user = await this.userRepository.save(user);
      }

      const token = this.generateToken(user);

      return { user, token };
    } catch (error: any) {
      throw new Error(`Google authentication failed: ${error.message}`);
    }
  }

  async getUserById(userId: number): Promise<Users | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ["orders"],
    });
  }

  async verifyToken(token: string): Promise<Users> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await this.getUserById(decoded.userId);

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error: any) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  private generateToken(user: Users): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET as unknown as jwt.Secret,
      {
        expiresIn: JWT_EXPIRES_IN as unknown as jwt.SignOptions["expiresIn"],
      }
    );
  }
}
