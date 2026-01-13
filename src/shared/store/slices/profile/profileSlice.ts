import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { storage, StorageKeys } from "@/shared/services/storage";
import type { RootState } from "@/shared/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastAndroid } from "react-native";
// import { User } from "../../../../modules/auth/store/authSlice"; // Reuse the User interface

// Types

// User model
export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  company: {
    id: number;
    name: string;
    type?: string;
    is_independent?: boolean;
  };
  avatar?: string | null; // ✅ Include avatar in user data
}
// Currency model
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  icon: string;
  locale: string;
  decimal_places: number;
}
// Company Detail model
export interface CompanyDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  address: {
    zip: string;
    city: string;
    state: string;
    street: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

// Preferences model
export interface Preferences {
  notifications: {
    email: boolean;
    push: boolean;
    payout_reminders: boolean;
    investment_updates: boolean;
  };
  display: {
    currency: string;
    timezone: string;
    language: string;
  };
}
// Avatar upload response model
export interface AvatarUploadResponse {
  success: boolean;
  message: string;
  data: {
    avatar_url: string;
  };
}

export interface RejectError {
  code: string;
  message: string;
  status: number;
}

// Profile slice state
export interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  avatar: AvatarUploadResponse | null; // ✅ optional field
  currencies: Currency[];
  isCurrenciesLoading: boolean;
  preferences?: Preferences;
  // Company info
  companyInfo?: CompanyDetail;
  isCompanyLoading?: boolean;
}

// Initial state
const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  avatar: null, // ✅ properly initialized
  currencies: [],
  isCurrenciesLoading: false,
  preferences: undefined,
  companyInfo: undefined,
  isCompanyLoading: false,
};

// ✅ Thunk to fetch current user
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: RejectError }
>("/v1/auth/me", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFILE.GET);
    const user = response?.data?.data;
    console.log("✅ Get current user response:", JSON.stringify(response.data));
    await storage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
    return user;
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to get user profile";
    const code = error?.response?.data?.code || "SERVER_ERROR";
    const status = error?.response?.status || 500;

    ToastAndroid.show(errMsg, ToastAndroid.SHORT);
    console.error("❌ Get current user error:", errMsg);

    return rejectWithValue({ code, message: errMsg, status });
  }
});

// Fetch currencies thunk
export const getCurrencies = createAsyncThunk<
  Currency[],
  void,
  { rejectValue: string }
>("profile/getCurrencies", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFILE.CURRENCIES); // define in your env
    const currencies = response?.data?.data?.currencies;
    if (!currencies) throw new Error("No currencies found");
    console.log("✅ Fetched currencies:", currencies);
    return currencies;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to fetch currencies";
    return rejectWithValue(msg);
  }
});
// Update Preferences thunk
export const updatePreferences = createAsyncThunk(
  "profile/updatePreferences",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.PROFILE.PREFERENCES,
        payload
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data || "Update preferences failed"
      );
    }
  }
);
// Get Preferences thunk
export const getPreferences = createAsyncThunk(
  "profile/getPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ENDPOINTS.PROFILE.PREFERENCES);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data || "Get preferences failed");
    }
  }
);
// Change password slice
export const changePassword = createAsyncThunk<
  { success: boolean; message: string },
  {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  },
  { rejectValue: string }
>("profile/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
    return res.data; // { success, message, data: null }
  } catch (err: any) {
    const msg =
      err?.response?.data?.message || err?.message || "Change password failed";
    return rejectWithValue(msg);
  }
});
// Update profile thunk
export const updateUserProfileApi = createAsyncThunk<
  User, // Return type
  { name: string; phone: string; company_name: string }, // Input payload
  { rejectValue: string } // Error type
>("/v1/auth/update-profile", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, payload);
    console.log("✅ Update profile response:", JSON.stringify(response.data));

    const updatedUser = response.data?.data;
    const message = response.data?.message || "Profile updated successfully";

    if (!updatedUser) {
      throw new Error("No user data returned from update profile API");
    }

    // Update local storage
    await storage.setItem(StorageKeys.USER_DATA, JSON.stringify(updatedUser));

    // ToastAndroid.show(message, ToastAndroid.SHORT);

    return updatedUser;
  } catch (err: any) {
    const errMsg = err?.response?.data?.message || err?.message;
    ("Failed to update profile");

    console.error("❌ Update profile error:", errMsg);
    ToastAndroid.show(errMsg, ToastAndroid.SHORT);

    return rejectWithValue(errMsg);
  }
});
// ✅ Upload Avatar Thunk
export const uploadUserAvatar = createAsyncThunk(
  "profile/uploadUserAvatar",
  async (imageUri: string, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri: imageUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      const response = await api.post("/v1/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns { data: { avatar_url: "https://..." } }
      return response.data.data.avatar_url;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Upload failed");
    }
  }
);
// ✅ Get Company Info Thunk
export const getCompanyInfo = createAsyncThunk<
  CompanyDetail,
  void,
  { rejectValue: string }
>("profile/getCompanyInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.PROFILE.COMPANY_INFO);
    console.log("✅ Company info response:", response.data);
    return response.data.data;
  } catch (error: any) {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch company info";

    ToastAndroid.show(msg, ToastAndroid.SHORT);
    return rejectWithValue(msg);
  }
});

// ✅ Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    updateProfileLocally: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    resetProfile: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(
        getCurrentUser.rejected,
        (state, action: PayloadAction<RejectError | undefined>) => {
          state.isLoading = false;
          state.error = action.payload?.message || "Failed to fetch profile";
        }
      )
      // get currencies extra reducers
      .addCase(getCurrencies.pending, (state) => {
        state.isCurrenciesLoading = true;
        state.error = null;
      })
      .addCase(
        getCurrencies.fulfilled,
        (state, action: PayloadAction<Currency[]>) => {
          state.currencies = action.payload;
          state.isCurrenciesLoading = false;
        }
      )
      .addCase(getCurrencies.rejected, (state, action) => {
        state.isCurrenciesLoading = false;
        state.error = action.payload || "Failed to fetch currencies";
      })
      // update preferences extra reducers
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.preferences = action.payload.data;
      })
      // get preferences extra reducers
      .addCase(getPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload.data;
      })
      // change password extra reducers
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || "Change password failed";
      });
    // Update Profile
    builder
      .addCase(updateUserProfileApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfileApi.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          // Merge updated fields into existing user data
          state.user = { ...state.user, ...action.payload };
        } else {
          state.user = action.payload;
        }
        ToastAndroid.show("Profile updated successfully", ToastAndroid.SHORT);
      })
      .addCase(updateUserProfileApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update profile";
      })
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.avatar = action.payload; // Update avatar field
        }
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
      })
      // Get Company Info extra reducers
      .addCase(getCompanyInfo.pending, (state) => {
        state.isCompanyLoading = true;
        state.error = null;
      })
      .addCase(getCompanyInfo.fulfilled, (state, action) => {
        state.isCompanyLoading = false;
        state.companyInfo = action.payload;
      })
      .addCase(getCompanyInfo.rejected, (state, action) => {
        state.isCompanyLoading = false;
        state.error = action.payload || "Failed to fetch company info";
      });
  },
});

// ✅ Actions
export const { clearProfileError, updateProfileLocally, resetProfile } =
  profileSlice.actions;

// ✅ Selectors
export const selectProfile = (state: RootState) => state.profile;
export const selectProfileUser = (state: RootState) =>
  state.profile?.user || null;
export const selectProfileLoading = (state: RootState) =>
  state.profile?.isLoading || false;
export const selectProfileError = (state: RootState) =>
  state.profile?.error || null;
export const selectCompanyInfo = (state: RootState) =>
  state.profile.companyInfo;

export const selectCompanyLoading = (state: RootState) =>
  state.profile.isCompanyLoading || false;

// ✅ Reducer
export default profileSlice.reducer;
// export const selectCurrencies = (state: RootState) => state.profile.currencies;
// export const selectCurrenciesLoading = (state: RootState) => state.profile.isCurrenciesLoading;
