// src/shared/store/slices/notifications/notificationTemplateSlice.ts

import { api } from "@/shared/services/api";
import { API_ENDPOINTS } from "@config/env";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  variables: string[];
  channels: string[];
}

interface NotificationTemplateState {
  templates: NotificationTemplate[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationTemplateState = {
  templates: [],
  isLoading: false,
  error: null,
};

// ✅ Thunk: Fetch Notification Templates
export const fetchNotificationTemplates = createAsyncThunk<
  NotificationTemplate[],
  void,
  { rejectValue: string }
>("notifications/fetchTemplates", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN.NOTIFICATIONS.TEMPLATES);
    const templates = response.data?.data?.templates || [];
console.log("Fetched templates:", templates);
    return templates;
  } catch (error: any) {

    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch templates"
    );
  }
});

const notificationTemplateSlice = createSlice({
  name: "notificationTemplates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchNotificationTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default notificationTemplateSlice.reducer;
