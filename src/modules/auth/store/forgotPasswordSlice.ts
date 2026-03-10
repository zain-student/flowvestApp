/**
 * Forgot Password Redux Slice
 * Handles send code, verify code, and reset password flows
 */

import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showToast } from "../utils/showToast";
// --------------------
// Types
// --------------------

interface ForgotPasswordState {
  email: string | null;
  verificationToken: string | null;
  expiresAt: string | null;

  loading: boolean;
  error: string | null;
}

const initialState: ForgotPasswordState = {
  email: null,
  verificationToken: null,
  expiresAt: null,

  loading: false,
  error: null,
};

// --------------------
// Thunks
// --------------------

export const sendResetCode = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("forgotPassword/sendResetCode", async ({ email }, { rejectWithValue }) => {
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION_CODE, {
      email,
      type: "password_reset",
    });

    showToast(res.data.message);
  } catch (error: any) {
    showToast(error.message, "error");
    return rejectWithValue(error.message || "Failed to send verification code");
  }
});

export const verifyResetCode = createAsyncThunk<
  { token: string; expiresAt: string },
  { email: string; code: string },
  { rejectValue: string }
>(
  "forgotPassword/verifyResetCode",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_CODE, {
        email,
        code,
        type: "password_reset",
      });

      showToast(response.data.message);
      return {
        token: response.data.data.token,
        expiresAt: response.data.data.expires_at,
      };
    } catch (error: any) {
      showToast(error.message, "error");

      return rejectWithValue(error.message || "Invalid verification code");
    }
  },
);

export const resetPassword = createAsyncThunk<
  void,
  { token: string; password: string; confirmPassword: string },
  { rejectValue: string }
>(
  "forgotPassword/resetPassword",
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        new_password: password,
        new_password_confirmation: confirmPassword,
      });
      showToast(response.data.message);
    } catch (error: any) {
      showToast(error.message || "Failed to reset password", "error");
      return rejectWithValue(error.message || "Failed to reset password");
    }
  },
);

// --------------------
// Slice
// --------------------

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    clearForgotPasswordState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Send code
    builder
      .addCase(sendResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendResetCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });

    // Verify code
    builder
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationToken = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, () => {
        return initialState; // clear everything after success
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const { setEmail, clearForgotPasswordState } =
  forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
