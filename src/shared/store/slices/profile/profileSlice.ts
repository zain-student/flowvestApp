/**
 * Profile Redux Slice
 * Manages profile state, user info, and profile-related actions
 */

import { API_ENDPOINTS } from "@/config/env";
import { api } from "@/shared/services/api";
import { storage, StorageKeys } from "@/shared/services/storage";
import type { RootState } from "@/shared/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
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
  avatar_url?: string | null; // ✅ Include avatar in user data
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
}

// Initial state
const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  avatar: null, // ✅ properly initialized
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
export const uploadUserAvatar = createAsyncThunk<
  { avatar_url: string },
  string,
  { rejectValue: string }
>("profile/uploadUserAvatar", async (imageUri, { rejectWithValue }) => {
  try {
    // 1️⃣ Validate file existence
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) throw new Error("Image file not found");

    // 2️⃣ Prepare FormData
    const formData = new FormData();
    formData.append("avatar", {
      uri: imageUri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);

    // 3️⃣ Upload to API
    const response = await api.post<AvatarUploadResponse>(
      API_ENDPOINTS.PROFILE.UPLOAD_AVATAR,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const avatar_url = response.data.data.avatar_url;

    // 4️⃣ Update stored user data immediately
    const userData = await storage.getItem(StorageKeys.USER_DATA);
    if (userData) {
      const user = JSON.parse(userData);
      user.avatar_url = avatar_url;
      await storage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
    }

    ToastAndroid.show(
      response.data.message || "Avatar updated successfully",
      ToastAndroid.SHORT
    );

    return { avatar_url };
  } catch (error: any) {
    console.error("❌ Avatar upload error:", error);
    const msg =
      error.response?.data?.message || error.message || "Upload failed";
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
      );
    // change password extra reducers
    builder
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
      // Upload Avatar
      // .addCase(uploadUserAvatar.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(uploadUserAvatar.fulfilled, (state, action) => {
      //   state.isLoading = false;

      //   // ✅ Update both user and avatar state
      //   if (state.user) {
      //     state.user = { ...state.user, avatar_url: action.payload.avatar_url };
      //   }
      //   state.avatar = {
      //     success: true,
      //     message: "Avatar uploaded successfully",
      //     data: { avatar_url: action.payload.avatar_url },
      //   };
      // })

      // .addCase(uploadUserAvatar.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = (action.payload as string) || "Failed to upload avatar";
      // });
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.avatar_url = action.payload.avatar_url;
        }
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to upload avatar";
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

// ✅ Reducer
export default profileSlice.reducer;
