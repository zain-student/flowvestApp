/**
 * Authentication Redux Slice
 * Manages authentication state, login, logout, and user data
 */

import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { storage, StorageKeys } from "@/shared/services/storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastAndroid } from "react-native";
import { UserRole } from "../../../config/roles";
import type { RootState } from "../../../shared/store";
// const TOKEN_KEY = '@flowvest:token';
// const REFRESH_TOKEN_KEY = '@flowvest:refresh_token';
// const SESSION_KEY = '@flowvest:session';
// const USER_KEY = '@flowvest:user';

// Types
export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  all_permissions: string[];
  is_superadmin: boolean;
  is_admin: boolean;
  company?: {
    id: number;
    name: string;
    type?: string;
    is_independent?: boolean;
  };
  last_login_at?: string;
  email_verified_at?: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
}

export interface AuthSession {
  issued_at: string;
  refresh_available_until: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: AuthToken | null;
  session: AuthSession | null;
  error: string | null;
  lastLoginAttempt: string | null;
  biometricsEnabled: boolean;
  rememberMe: boolean;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  session: null,
  error: null,
  lastLoginAttempt: null,
  biometricsEnabled: false,
  rememberMe: false,
};

// Async thunks (will be implemented with actual API calls)
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    // This will be implemented with actual API call
    // For now, return mock data structure
    return {
      user: {} as User,
      token: {} as AuthToken,
      session: {} as AuthSession,
    };
  }
);

export const registerUser = createAsyncThunk(
  "/v1/auth/register",
  async (registrationData: any, { rejectWithValue }) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.REGISTER,
        registrationData
      );
      const token = response.data?.data?.token;
      const user = response.data?.data?.user;
      const session = response.data?.data?.session; // Assuming session is returned
      console.log("Registration response:", response);
      if (!token || !user) {
        return rejectWithValue(
          "Registration failed: No token or user data returned"
        );
      }
      // Save token and user data to storage
      await storage.multiSet([
        [StorageKeys.AUTH_TOKEN, token?.access_token],
        [StorageKeys.USER_DATA, JSON.stringify(user)],
        // [StorageKeys.REFRESH_TOKEN, token?.refresh_token],
      ]);
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      console.log("✅ User registered successfully:", response.data.message);
      // return { user, token, session };
      return {
        user,
        token: {
          access_token: token.access_token,
          token_type: token.token_type,
          expires_in: token.expires_in,
          expires_at: token.expires_at,
        },
        session: {
          issued_at: session?.issued_at,
          refresh_available_until: session?.refresh_available_until,
        },
      };
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      ToastAndroid.show(errMsg, ToastAndroid.SHORT);
      console.error("❌ Registration error:", errMsg);
      return rejectWithValue(errMsg);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // This will be implemented with actual API call
  return;
});

export const refreshToken = createAsyncThunk("auth/refresh", async () => {
  // This will be implemented with actual API call
  return {
    token: {} as AuthToken,
    session: {} as AuthSession,
  };
});

export const getCurrentUser = createAsyncThunk("auth/me", async () => {
  // This will be implemented with actual API call
  return {} as User;
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setBiometricsEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricsEnabled = action.payload;
    },

    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    resetAuth: (state) => {
      return { ...initialState };
    },
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.lastLoginAttempt = new Date().toISOString();
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.session = action.payload.session;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message || "Login failed";
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.token = {
          access_token: action.payload.token.access_token,
          token_type: action.payload.token.token_type,
          expires_in: action.payload.token.expires_in,
          expires_at: action.payload.token.expires_at,
        };
        // state.session = action.payload.session;
        state.session = {
          issued_at: action.payload.session.issued_at,
          refresh_available_until:
            action.payload.session.refresh_available_until,
        };
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message || "Registration failed";
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState };
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails on server, clear local state
        return { ...initialState };
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.session = action.payload.session;
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, logout user
        return { ...initialState };
      });

    // Get current user
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        // If can't get user, probably invalid token
        return { ...initialState };
      });
  },
});

// Export actions
export const {
  clearError,
  setLoading,
  setBiometricsEnabled,
  setRememberMe,
  updateUserProfile,
  resetAuth,
} = authSlice.actions;

// Selectors - Updated for Redux Persist compatibility
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth?.user || null;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth?.isAuthenticated || false;
export const selectIsLoading = (state: RootState) =>
  state.auth?.isLoading || false;
export const selectAuthError = (state: RootState) => state.auth?.error || null;
export const selectUserRole = (state: RootState) =>
  state.auth?.user?.roles?.[0];
export const selectIsAdmin = (state: RootState) =>
  state.auth?.user?.is_admin || false;
export const selectUserPermissions = (state: RootState) =>
  state.auth?.user?.all_permissions || [];
export const selectBiometricsEnabled = (state: RootState) =>
  state.auth?.biometricsEnabled || false;
export const selectRememberMe = (state: RootState) =>
  state.auth?.rememberMe || false;

// Export reducer
export default authSlice.reducer;
