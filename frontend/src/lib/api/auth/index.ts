import AxiosClient from "@/lib/axios/axiosClient";

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  google_id?: string;
  user_type: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async register(
    email: string,
    password: string,
    username: string,
    dateOfBirth?: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    try {
      const response = await this.instance.post("/auth/register", {
        email,
        password,
        username,
        dateOfBirth,
        firstName,
        lastName,
      });
      return response as unknown as AuthResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.instance.post("/auth/login", {
        email,
        password,
      });
      return response as unknown as AuthResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  public async googleAuth(idToken: string): Promise<AuthResponse> {
    try {
      const response = await this.instance.post("/auth/google", {
        idToken,
      });
      return response as unknown as AuthResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Google authentication failed"
      );
    }
  }

  public async verifyToken(token: string): Promise<{ user: User }> {
    try {
      const response = await this.instance.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response as unknown as { user: User };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Token verification failed"
      );
    }
  }

  public async getCurrentUser(token: string): Promise<{ user: User }> {
    try {
      const response = await this.instance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response as unknown as { user: User };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to get current user"
      );
    }
  }
}

export default AuthApi;
