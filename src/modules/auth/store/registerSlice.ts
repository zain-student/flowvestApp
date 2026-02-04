import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
export type RegisterStep = 1 | 2 | 3;

interface RegisterState {
  step: RegisterStep;
  email: string;
  role: "user" | "admin";
  verificationCode: string;
  termsAccepted: boolean;
  loading: boolean;
  error: string | null;
}
const initialState: RegisterState = {
  step: 1,
  email: "",
  role: "user",
  verificationCode: "",
  termsAccepted: false,
  loading: false,
  error: null,
};

/**
 * STEP 1 → Check email & send verification code
 */
export const checkEmailAndSendCode = createAsyncThunk<
  void,
  { email: string; role: "user" | "admin" },
  { rejectValue: string }
>(
  "register/checkEmailAndSendCode",
  async ({ email, role }, { rejectWithValue }) => {
    console.log("Thunk called with:", { email, role });
    try {
      const checkRes = await api.post(API_ENDPOINTS.AUTH.CHECK_EMAIL, {
        email,
        role,
      });
      console.log("Check Res", checkRes.data);
      if (checkRes.data.exists && !checkRes.data.can_register) {
        console.log("Email already registered");
        return rejectWithValue("Email already registered");
      }

      const codeRes = await api.post(
        API_ENDPOINTS.AUTH.SEND_VERIFICATION_CODE,
        {
          email,
          type: "registration",
        },
      );
      console.log("Verification code Res:", codeRes.data);
    } catch (error: any) {
      console.log("Error in thunk:", error.message || error);
      return rejectWithValue(error.message || "Something went wrong");
    }
  },
);

/**
 * STEP 2 → Verify code
 */
export const verifyEmailCode = createAsyncThunk<
  void,
  { email: string; code: string },
  { rejectValue: string }
>("register/verifyEmailCode", async ({ email, code }, { rejectWithValue }) => {
  console.log("Thunk called with:", { email, code });
  try {
    const checkRes = await api.post(API_ENDPOINTS.AUTH.VERIFY_CODE, {
      email,
      code,
      type: "registration",
    });
    console.log("Check Res", checkRes.data);
  } catch (error: any) {
    console.log("Verify code error :", error.message);
    return rejectWithValue(error.message || "Invalid verification code");
  }
});

/**
 * STEP 3 → Register
 */
export const registerUser = createAsyncThunk<
  any,
  {
    email: string;
    code: string;
    password: string;
    role: "user" | "admin";
    termsAccepted: boolean;
  },
  { rejectValue: string }
>("register/registerUser", async (payload, { rejectWithValue }) => {
  console.log("Called thunk with:", payload);
  try {
    const res = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.password,
      role: payload.role,
      verification_code: payload.code,
      terms_accepted: payload.termsAccepted,
    });
    console.log("Register response:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("Register error:", error.message);
    // ToastAndroid.show(error.message,ToastAndroid.SHORT);
    return rejectWithValue(error.message || "Registration failed");
  }
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setRole(state, action: PayloadAction<"user" | "admin">) {
      state.role = action.payload;
    },
    setVerificationCode(state, action: PayloadAction<string>) {
      state.verificationCode = action.payload;
    },
    setTermsAccepted(state, action: PayloadAction<boolean>) {
      state.termsAccepted = action.payload;
    },
    setStep(state, action: PayloadAction<RegisterStep>) {
      state.step = action.payload;
    },
    // resetRegister(state) {
    //   Object.assign(state, initialState);
    // },
    resetRegister: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      /* CHECK EMAIL + SEND CODE */
      .addCase(checkEmailAndSendCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEmailAndSendCode.fulfilled, (state) => {
        state.loading = false;
        state.step = 2;
      })
      .addCase(checkEmailAndSendCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send code";
      })

      /* VERIFY CODE */
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailCode.fulfilled, (state) => {
        state.loading = false;
        state.step = 3;
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Verification failed";
      })

      /* REGISTER */
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const {
  setEmail,
  setRole,
  setVerificationCode,
  setTermsAccepted,
  setStep,
  resetRegister,
} = registerSlice.actions;

export default registerSlice.reducer;
