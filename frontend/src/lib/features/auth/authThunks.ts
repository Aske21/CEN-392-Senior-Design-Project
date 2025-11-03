import { createAsyncThunk } from "@reduxjs/toolkit";
import AuthApi, { AuthResponse } from "@/lib/api/auth";
import { AppDispatch, RootState } from "@/lib/store";

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { dispatch: AppDispatch; rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const authApi = new AuthApi();
    const response = await authApi.login(email, password);
    // Redux Persist will automatically persist the token and user to localStorage
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
    username: string;
    dateOfBirth?: string;
    firstName?: string;
    lastName?: string;
  },
  { dispatch: AppDispatch; rejectValue: string }
>(
  "auth/register",
  async (
    { email, password, username, dateOfBirth, firstName, lastName },
    { rejectWithValue }
  ) => {
    try {
      const authApi = new AuthApi();
      const response = await authApi.register(
        email,
        password,
        username,
        dateOfBirth,
        firstName,
        lastName
      );
      // Redux Persist will automatically persist the token and user to localStorage
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const googleAuthUser = createAsyncThunk<
  AuthResponse,
  { idToken: string },
  { dispatch: AppDispatch; rejectValue: string }
>("auth/googleAuth", async ({ idToken }, { rejectWithValue }) => {
  try {
    const authApi = new AuthApi();
    const response = await authApi.googleAuth(idToken);
    // Redux Persist will automatically persist the token and user to localStorage
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Google authentication failed");
  }
});

export const verifyToken = createAsyncThunk<
  { user: AuthResponse["user"] },
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("auth/verifyToken", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No token found");
    }

    const authApi = new AuthApi();
    const response = await authApi.getCurrentUser(token);
    return response;
  } catch (error: any) {
    // Token will be cleared by the reducer on rejection
    return rejectWithValue(error.message || "Token verification failed");
  }
});

export const initializeAuth = createAsyncThunk<
  { user: AuthResponse["user"] } | null,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("auth/initialize", async (_, { getState, rejectWithValue }) => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    // Redux Persist will have already rehydrated the state
    // We just need to verify the token is still valid
    const state = getState();
    const token = state.auth.token;
    const user = state.auth.user;

    if (!token || !user) {
      return null;
    }

    // Verify token is still valid
    const authApi = new AuthApi();
    const response = await authApi.getCurrentUser(token);
    return response;
  } catch (error: any) {
    // Token is invalid, will be cleared by reducer
    return rejectWithValue(error.message || "Token verification failed");
  }
});
